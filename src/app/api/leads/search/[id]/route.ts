import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRun, getPlaces } from "@/lib/leads/apify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const searchId = params.id;
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer la recherche en base
    const { data: search, error: fetchError } = await supabase
      .from("lead_searches")
      .select("*")
      .eq("id", searchId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !search) {
      return NextResponse.json({ error: "Recherche introuvable" }, { status: 404 });
    }

    // 1. Si déjà terminée avec succès, renvoyer directement les leads existants
    if (search.status === "succeeded") {
      const { data: existingLeads } = await supabase
        .from("leads")
        .select("*, lead_messages(*)")
        .eq("search_id", searchId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      return NextResponse.json({
        status: "succeeded",
        search,
        leadsCount: search.results_count,
        leads: existingLeads || [],
      });
    }

    // 2. Si marquée en échec
    if (search.status === "failed") {
      return NextResponse.json({
        status: "failed",
        error: search.error || "La recherche a échoué",
        search,
      });
    }

    // 3. Si en cours ('running') : interroger Apify
    const runId = search.apify_run_id;
    if (!runId) {
      return NextResponse.json({ status: "failed", error: "Identifiant de run manquant" }, { status: 400 });
    }

    const runResult = await getRun(runId);

    if (runResult.status === "RUNNING") {
      return NextResponse.json({ status: "running", searchId });
    }

    if (runResult.status === "FAILED") {
      await supabase
        .from("lead_searches")
        .update({ status: "failed", error: runResult.error || "Échec Apify" })
        .eq("id", searchId);

      return NextResponse.json({
        status: "failed",
        error: runResult.error || "Échec du scraping",
      });
    }

    // 4. Si 'SUCCEEDED' : Importer le dataset Apify dans la table leads
    const datasetId = runResult.datasetId || search.apify_dataset_id;
    if (!datasetId) {
      await supabase
        .from("lead_searches")
        .update({ status: "failed", error: "Dataset introuvable" })
        .eq("id", searchId);

      return NextResponse.json({ status: "failed", error: "Dataset introuvable" }, { status: 500 });
    }

    const places = await getPlaces(datasetId, search.city);

    // Upsert sans doublons sur (user_id, place_id)
    if (places.length > 0) {
      const leadsToUpsert = places.map((p) => ({
        user_id: user.id,
        search_id: searchId,
        place_id: p.placeId,
        name: p.name,
        category: p.category || null,
        address: p.address || null,
        city: p.city || search.city,
        phone: p.phone || null,
        website: p.website || null,
        rating: p.rating || null,
        reviews_count: p.reviewsCount || 0,
        maps_url: p.mapsUrl || null,
        status: "new",
      }));

      const { error: upsertError } = await supabase
        .from("leads")
        .upsert(leadsToUpsert, { onConflict: "user_id, place_id" });

      if (upsertError) {
        console.error("[SearchStatusRoute] Erreur upsert leads:", upsertError);
      }
    }

    // Mettre à jour lead_searches
    await supabase
      .from("lead_searches")
      .update({
        status: "succeeded",
        results_count: places.length,
      })
      .eq("id", searchId);

    // Récupérer les leads enregistrés pour les renvoyer au client
    const { data: savedLeads } = await supabase
      .from("leads")
      .select("*, lead_messages(*)")
      .eq("search_id", searchId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      status: "succeeded",
      leadsCount: places.length,
      leads: savedLeads || [],
    });
  } catch (err: any) {
    console.error("[SearchStatusRoute] Exception:", err);
    return NextResponse.json(
      { error: err.message || "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
