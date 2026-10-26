import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateProspectMessage } from "@/lib/leads/openai";
import { rowToLead, rowToLeadMessage } from "@/lib/supabase/db";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GenerateInputSchema = z.object({
  leadIds: z.array(z.string().uuid()).min(1, "Sélectionnez au moins un prospect").max(10, "Maximum 10 prospects à la fois"),
  channel: z.enum(["whatsapp", "email", "sms"]).default("whatsapp"),
  tone: z.enum(["professional", "warm", "direct"]).default("professional"),
  language: z.string().default("fr"),
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
    const parsed = GenerateInputSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const { leadIds, channel, tone, language } = parsed.data;

    // 1. Garde-fou : Limite journalière de messages (défaut 200/jour)
    const maxDailyMessages = parseInt(process.env.LEADS_MAX_MESSAGES_PER_DAY || "200", 10);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count: dailyMsgCount } = await supabase
      .from("lead_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    if (dailyMsgCount !== null && dailyMsgCount + leadIds.length > maxDailyMessages) {
      return NextResponse.json(
        {
          error: `Limite journalière atteinte (${maxDailyMessages} messages / jour). Réessayez demain !`,
        },
        { status: 429 }
      );
    }

    // 2. Récupérer les paramètres de l'entreprise et le profil de l'utilisateur
    const [settingsRes, profileRes] = await Promise.all([
      supabase.from("company_settings").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    ]);

    const settings = settingsRes.data;
    const profile = profileRes.data;

    const sender = {
      fullName: profile?.full_name || user.email?.split("@")[0] || "Le responsable",
      companyName: settings?.company_name || "Notre entreprise",
      sector: settings?.business_sector || undefined,
      pitch: settings?.prospecting_pitch || undefined,
      phone: settings?.whatsapp_number || settings?.phone || undefined,
    };

    // 3. Récupérer les prospects ciblés
    const { data: rawLeads, error: leadsError } = await supabase
      .from("leads")
      .select("*")
      .in("id", leadIds)
      .eq("user_id", user.id);

    if (leadsError || !rawLeads || rawLeads.length === 0) {
      return NextResponse.json({ error: "Aucun prospect trouvé" }, { status: 404 });
    }

    const leads = rawLeads.map((r) => rowToLead(r));

    // 4. Générer les messages par lots de 3 en parallèle
    const BATCH_SIZE = 3;
    const results: any[] = [];

    for (let i = 0; i < leads.length; i += BATCH_SIZE) {
      const batch = leads.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(async (lead) => {
        const generated = await generateProspectMessage({
          lead,
          sender,
          channel,
          tone,
          language,
        });

        // Enregistrer dans lead_messages
        const { data: savedMsg, error: saveErr } = await supabase
          .from("lead_messages")
          .insert({
            user_id: user.id,
            lead_id: lead.id,
            channel,
            tone,
            subject: generated.subject,
            content: generated.content,
            model: generated.model,
          })
          .select()
          .single();

        if (saveErr || !savedMsg) {
          console.error("[GenerateRoute] Erreur sauvegarde message:", saveErr);
          return null;
        }

        return rowToLeadMessage(savedMsg);
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(Boolean));
    }

    return NextResponse.json({
      success: true,
      messages: results,
      count: results.length,
    });
  } catch (err: any) {
    console.error("[GenerateRoute] Exception:", err);
    return NextResponse.json(
      { error: err.message || "Erreur lors de la génération des messages" },
      { status: 500 }
    );
  }
}
