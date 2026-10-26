import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { startGoogleMapsRun } from "@/lib/leads/apify";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SearchInputSchema = z.object({
  query: z.string().min(2, "La recherche doit comporter au moins 2 caractères").max(100),
  city: z.string().min(2, "La ville doit comporter au moins 2 caractères").max(50),
  senderSector: z.string().max(100).optional(),
  pitch: z.string().max(500).optional(),
  maxResults: z.number().int().min(5).max(100).default(50),
});

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = SearchInputSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const { query, city, senderSector, pitch, maxResults } = parsed.data;

    // Garde-fou : Limite journalière de recherches (défaut 10/jour)
    const maxDaily = parseInt(process.env.LEADS_MAX_SEARCHES_PER_DAY || "10", 10);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count: dailyCount } = await supabase
      .from("lead_searches")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    if (dailyCount !== null && dailyCount >= maxDaily) {
      return NextResponse.json(
        {
          error: `Vous avez atteint la limite quotidienne de ${maxDaily} recherches de prospection. Réessayez demain !`,
        },
        { status: 429 }
      );
    }

    // Réutilisation : Vérifier si une recherche identique a moins de 7 jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentSearch } = await supabase
      .from("lead_searches")
      .select("id, status, results_count, created_at")
      .eq("user_id", user.id)
      .ilike("query", query.trim())
      .ilike("city", city.trim())
      .eq("status", "succeeded")
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentSearch && recentSearch.results_count > 0) {
      return NextResponse.json({
        searchId: recentSearch.id,
        status: "succeeded",
        reused: true,
        message: "Résultats récents (< 7 jours) réutilisés avec succès.",
      });
    }

    // Mettre à jour le secteur et pitch de l'utilisateur dans company_settings si renseigné
    if (senderSector || pitch) {
      const updateSettings: any = {};
      if (senderSector) updateSettings.business_sector = senderSector.trim();
      if (pitch) updateSettings.prospecting_pitch = pitch.trim();

      await supabase
        .from("company_settings")
        .update(updateSettings)
        .eq("user_id", user.id);
    }

    // Lancer le scraping Apify
    const { runId, datasetId, isSimulated } = await startGoogleMapsRun({
      query: query.trim(),
      city: city.trim(),
      maxResults,
    });

    // Enregistrer la recherche dans lead_searches
    const { data: newSearch, error: insertError } = await supabase
      .from("lead_searches")
      .insert({
        user_id: user.id,
        query: query.trim(),
        city: city.trim(),
        sender_sector: senderSector?.trim() || null,
        max_results: maxResults,
        apify_run_id: runId,
        apify_dataset_id: datasetId,
        status: isSimulated ? "succeeded" : "running",
        results_count: 0,
      })
      .select()
      .single();

    if (insertError || !newSearch) {
      console.error("[SearchRoute] Erreur insertion lead_searches:", insertError);
      return NextResponse.json(
        { error: "Impossible de créer la recherche en base" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      searchId: newSearch.id,
      status: newSearch.status,
      isSimulated,
    });
  } catch (err: any) {
    console.error("[SearchRoute] Exception:", err);
    return NextResponse.json(
      { error: err.message || "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
