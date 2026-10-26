"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  Client,
  CompanySettings,
  AppNotification,
  Lead,
  LeadSearch,
  LeadMessage,
  LeadStatus,
  LeadChannel,
  LeadTone,
  DEFAULT_SETTINGS,
  DEFAULT_WHATSAPP_TEMPLATE_FR,
  DEFAULT_WHATSAPP_TEMPLATE_EN,
  DEFAULT_WHATSAPP_TEMPLATE_IT,
  MOCK_CLIENTS,
  MOCK_INVOICES,
  MOCK_NOTIFICATIONS,
} from "@/lib/mock-data";
import { Database } from "@/types/database.types";

type InvoiceRow = Database["public"]["Tables"]["invoices"]["Row"];
type InvoiceItemRow = Database["public"]["Tables"]["invoice_items"]["Row"];
type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
type CompanySettingsRow = Database["public"]["Tables"]["company_settings"]["Row"];
type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
type LeadSearchRow = Database["public"]["Tables"]["lead_searches"]["Row"];
type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
type LeadMessageRow = Database["public"]["Tables"]["lead_messages"]["Row"];

// ============================================================================
// CONVERTISSEURS BIDIRECTIONNELS
// ============================================================================

export function rowToInvoice(row: InvoiceRow, items: InvoiceItemRow[] = []): Invoice {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    clientName: row.client_name,
    clientEmail: row.client_email || "",
    clientPhone: row.client_phone || "",
    clientCity: row.client_city || "Dakar",
    clientAddress: row.client_address || undefined,
    clientNinea: row.client_ninea || undefined,
    clientAvatarColor: row.client_avatar_color || "bg-blue-600",
    issueDate: row.issue_date,
    dueDate: row.due_date,
    amountHT: Number(row.amount_ht) || 0,
    taxAmount: Number(row.tax_amount) || 0,
    discountAmount: row.discount_amount ? Number(row.discount_amount) : undefined,
    amountTTC: Number(row.amount_ttc) || 0,
    amountPaid: Number(row.amount_paid) || 0,
    balanceDue: Number(row.balance_due) || 0,
    status: row.status as InvoiceStatus,
    notes: row.notes || undefined,
    paymentMethod: row.payment_method || undefined,
    currency: row.currency || "FCFA",
    appliedRate: row.applied_rate ? Number(row.applied_rate) : undefined,
    showExchangeRate: Boolean(row.show_exchange_rate),
    language: (row.language as "fr" | "en" | "it") || "fr",
    items: items.map((it) => ({
      id: it.id,
      description: it.description,
      quantity: Number(it.quantity) || 1,
      unitPrice: Number(it.unit_price) || 0,
      taxRate: Number(it.tax_rate) || 18,
      amount: Number(it.amount) || 0,
    })),
  };
}

export function rowToClient(row: ClientRow): Client {
  const cleanDate =
    (row as any).acquisition_date ||
    (row.created_at
      ? row.created_at.includes("T")
        ? row.created_at.split("T")[0]
        : row.created_at.split(" ")[0]
      : new Date().toISOString().split("T")[0]);

  return {
    id: row.id,
    name: row.name,
    email: row.email || "",
    emailPec: row.email_pec || undefined,
    phone: row.phone || "",
    whatsapp: row.whatsapp || undefined,
    city: row.city || "Dakar",
    country: (row as any).country || undefined,
    address: row.address || "",
    ninea: row.ninea || undefined,
    rccm: row.rccm || undefined,
    totalBilled: 0,
    balanceDue: 0,
    invoicesCount: 0,
    avatarBg: row.avatar_bg || "bg-blue-600",
    status: (row.status as "active" | "inactive") || "active",
    createdAt: row.created_at || new Date().toISOString(),
    acquisitionDate: cleanDate,
  };
}

export function rowToSettings(row: CompanySettingsRow): CompanySettings {
  return {
    ...DEFAULT_SETTINGS,
    companyName: row.company_name || "",
    legalForm: row.legal_form || "SARL",
    tradeName: row.trade_name || "",
    ninea: row.ninea || "",
    rccm: row.rccm || "",
    address: row.address || "",
    city: row.city || "",
    postalCode: row.postal_code || "",
    country: row.country || "Sénégal",
    email: row.email || "",
    phone: row.phone || "",
    website: row.website || "",
    currency: row.currency || "FCFA",
    defaultLanguage: (row.default_language as "fr" | "en" | "it") || "fr",
    taxApplicable: row.tax_applicable ?? true,
    defaultTaxRate: Number(row.default_tax_rate) ?? 18,
    invoicePrefix: row.invoice_prefix || "FAC-",
    defaultDueDays: Number(row.default_due_days) || 15,
    nextInvoiceSequence: Number(row.next_invoice_sequence) || 1,
    footerLegalText: row.footer_legal_text || "",
    lateFeeInterestRate: Number(row.late_fee_interest_rate) || 1.5,
    waveEnabled: row.wave_enabled ?? false,
    waveNumber: row.wave_number || "",
    waveAccountName: row.wave_account_name || "",
    omEnabled: row.om_enabled ?? false,
    omNumber: row.om_number || "",
    omMerchantCode: row.om_merchant_code || "",
    bankEnabled: row.bank_enabled ?? false,
    bankName: row.bank_name || "",
    bankIban: row.bank_iban || "",
    bankRibKey: row.bank_rib_key || "",
    bankAccountHolder: row.bank_account_holder || "",
    rateEur: Number(row.rate_eur) || 655.957,
    rateUsd: Number(row.rate_usd) || 600.0,
    signatureType: (row.signature_type as "image" | "name") || "name",
    signatureName: row.signature_name || "",
    signatureImageData: row.signature_image_data || "",
    companyLogo: row.company_logo || "",
    showExchangeRateOnInvoices: row.show_exchange_rate_on_invoices ?? false,
    emailPec: row.email_pec || undefined,
    whatsappNumber: row.whatsapp_number || undefined,
    whatsappTemplateFr: row.whatsapp_template_fr || DEFAULT_WHATSAPP_TEMPLATE_FR,
    whatsappTemplateEn: row.whatsapp_template_en || DEFAULT_WHATSAPP_TEMPLATE_EN,
    whatsappTemplateIt: row.whatsapp_template_it || DEFAULT_WHATSAPP_TEMPLATE_IT,
    whatsappDefaultLanguage: (row.whatsapp_default_language as "fr" | "en" | "it") || "fr",
    emailNotifications: row.email_notifications ?? true,
    autoPaymentReminder: row.auto_payment_reminder ?? true,
    reminderDaysBeforeDue: Number(row.reminder_days_before_due) || 3,
    stripeEnabled: row.stripe_enabled ?? false,
    businessSector: row.business_sector || "",
    prospectingPitch: row.prospecting_pitch || "",
  };
}

// ============================================================================
// OPÉRATIONS FACTURES (INVOICES & INVOICE_ITEMS)
// ============================================================================

export async function fetchInvoices(userId: string): Promise<Invoice[]> {
  const supabase = createClient();

  const { data: invoicesData, error: invError } = await supabase
    .from("invoices")
    .select("*, invoice_items(*)")
    .eq("user_id", userId)
    .order("issue_date", { ascending: false });

  if (invError) {
    console.error("Erreur fetchInvoices:", invError);
    return [];
  }

  if (!invoicesData || invoicesData.length === 0) {
    return [];
  }

  return invoicesData.map((row: any) =>
    rowToInvoice(row, row.invoice_items || [])
  );
}

export async function fetchInvoiceById(
  id: string,
  userId: string
): Promise<Invoice | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("*, invoice_items(*)")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return rowToInvoice(data, (data as any).invoice_items || []);
}

export async function saveInvoice(
  invoice: Invoice,
  userId: string
): Promise<{ success: boolean; id: string; error?: string }> {
  const supabase = createClient();

  const invoiceRow = {
    user_id: userId,
    invoice_number: invoice.invoiceNumber,
    client_name: invoice.clientName,
    client_email: invoice.clientEmail,
    client_phone: invoice.clientPhone,
    client_city: invoice.clientCity,
    client_address: invoice.clientAddress || null,
    client_ninea: invoice.clientNinea || null,
    client_avatar_color: invoice.clientAvatarColor || "bg-blue-600",
    issue_date: invoice.issueDate,
    due_date: invoice.dueDate,
    amount_ht: invoice.amountHT,
    tax_amount: invoice.taxAmount,
    discount_amount: invoice.discountAmount || 0,
    amount_ttc: invoice.amountTTC,
    amount_paid: invoice.amountPaid,
    balance_due: invoice.balanceDue,
    status: invoice.status,
    notes: invoice.notes || null,
    payment_method: invoice.paymentMethod || "Wave / Virement",
    currency: invoice.currency || "FCFA",
    applied_rate: invoice.appliedRate || null,
    show_exchange_rate: invoice.showExchangeRate || false,
    language: invoice.language || "fr",
  };

  let savedInvoiceId = invoice.id;

  // Si c'est un ID temporaire généré côté client (ex: "inv-1729..."), laisser Postgres générer un UUID valide
  const isTempId = !invoice.id || invoice.id.startsWith("inv-");

  if (isTempId) {
    const { data: inserted, error: insertErr } = await supabase
      .from("invoices")
      .insert(invoiceRow)
      .select("id")
      .single();

    if (insertErr) {
      console.error("Erreur insertion facture:", insertErr);
      return { success: false, id: "", error: insertErr.message };
    }
    savedInvoiceId = inserted.id;
  } else {
    const { error: updateErr } = await supabase
      .from("invoices")
      .update(invoiceRow)
      .eq("id", invoice.id)
      .eq("user_id", userId);

    if (updateErr) {
      console.error("Erreur mise à jour facture:", updateErr);
      return { success: false, id: invoice.id, error: updateErr.message };
    }

    // Supprimer les anciennes lignes pour réinsérer les nouvelles
    await supabase.from("invoice_items").delete().eq("invoice_id", savedInvoiceId);
  }

  // Insérer les lignes d'articles associées
  if (invoice.items && invoice.items.length > 0) {
    const itemsRows = invoice.items.map((item, index) => ({
      invoice_id: savedInvoiceId,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      tax_rate: item.taxRate,
      amount: item.amount,
      sort_order: index,
    }));

    const { error: itemsErr } = await supabase
      .from("invoice_items")
      .insert(itemsRows);

    if (itemsErr) {
      console.error("Erreur insertion lignes de facture:", itemsErr);
    }
  }

  // Déclencher un événement de rafraîchissement
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("invoices_updated"));
  }

  return { success: true, id: savedInvoiceId };
}

export async function updateInvoiceStatus(
  invoiceId: string,
  newStatus: InvoiceStatus,
  amountTTC: number,
  userId: string
): Promise<boolean> {
  const supabase = createClient();

  let amountPaid = 0;
  let balanceDue = amountTTC;

  if (newStatus === "paid") {
    amountPaid = amountTTC;
    balanceDue = 0;
  }

  const { error } = await supabase
    .from("invoices")
    .update({
      status: newStatus,
      amount_paid: amountPaid,
      balance_due: balanceDue,
    })
    .eq("id", invoiceId)
    .eq("user_id", userId);

  if (error) {
    console.error("Erreur updateInvoiceStatus:", error);
    return false;
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("invoices_updated"));
  }

  return true;
}

export async function deleteInvoice(
  invoiceId: string,
  userId: string
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", invoiceId)
    .eq("user_id", userId);

  if (error) {
    console.error("Erreur deleteInvoice:", error);
    return false;
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("invoices_updated"));
  }

  return true;
}

// ============================================================================
// OPÉRATIONS CLIENTS
// ============================================================================

export async function fetchClients(userId: string): Promise<Client[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) {
    console.error("Erreur fetchClients:", error);
    return [];
  }

  return (data || []).map(rowToClient);
}

export async function saveClient(
  client: Partial<Client>,
  userId: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = createClient();

  const clientRow = {
    user_id: userId,
    name: client.name || "",
    email: client.email || null,
    email_pec: client.emailPec || null,
    phone: client.phone || null,
    whatsapp: client.whatsapp || null,
    city: client.city || "Dakar",
    country: client.country || null,
    address: client.address || null,
    ninea: client.ninea || null,
    rccm: client.rccm || null,
    avatar_bg: client.avatarBg || "bg-blue-600",
    status: client.status || "active",
    acquisition_date: client.acquisitionDate || new Date().toISOString().split("T")[0],
  };

  const isTempId = !client.id || client.id.startsWith("client-");

  if (isTempId) {
    const { data, error } = await supabase
      .from("clients")
      .insert(clientRow)
      .select("id")
      .single();

    if (error) {
      console.error("Erreur saveClient insert:", error);
      return { success: false, error: error.message };
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("clients_updated"));
    }
    return { success: true, id: data.id };
  } else {
    const { error } = await supabase
      .from("clients")
      .update(clientRow)
      .eq("id", client.id!)
      .eq("user_id", userId);

    if (error) {
      console.error("Erreur saveClient update:", error);
      return { success: false, error: error.message };
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("clients_updated"));
    }
    return { success: true, id: client.id };
  }
}

export async function deleteClient(
  clientId: string,
  userId: string
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", clientId)
    .eq("user_id", userId);

  if (error) {
    console.error("Erreur deleteClient:", error);
    return false;
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("clients_updated"));
  }

  return true;
}

// ============================================================================
// OPÉRATIONS PARAMÈTRES D'ENTREPRISE
// ============================================================================

export async function fetchCompanySettings(
  userId: string
): Promise<CompanySettings | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("company_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return rowToSettings(data);
}

export async function saveCompanySettings(
  settings: CompanySettings,
  userId: string
): Promise<boolean> {
  const supabase = createClient();

  const row = {
    user_id: userId,
    company_name: settings.companyName,
    legal_form: settings.legalForm,
    trade_name: settings.tradeName || null,
    ninea: settings.ninea,
    rccm: settings.rccm,
    address: settings.address,
    city: settings.city,
    postal_code: settings.postalCode,
    country: settings.country,
    email: settings.email,
    phone: settings.phone,
    website: settings.website,
    currency: settings.currency,
    default_language: settings.defaultLanguage,
    tax_applicable: settings.taxApplicable,
    default_tax_rate: settings.defaultTaxRate,
    invoice_prefix: settings.invoicePrefix,
    default_due_days: settings.defaultDueDays,
    next_invoice_sequence: settings.nextInvoiceSequence,
    footer_legal_text: settings.footerLegalText,
    late_fee_interest_rate: settings.lateFeeInterestRate,
    wave_enabled: settings.waveEnabled,
    wave_number: settings.waveNumber,
    wave_account_name: settings.waveAccountName,
    om_enabled: settings.omEnabled,
    om_number: settings.omNumber,
    om_merchant_code: settings.omMerchantCode,
    bank_enabled: settings.bankEnabled,
    bank_name: settings.bankName,
    bank_iban: settings.bankIban,
    bank_rib_key: settings.bankRibKey,
    bank_account_holder: settings.bankAccountHolder,
    rate_eur: settings.rateEur,
    rate_usd: settings.rateUsd,
    signature_type: settings.signatureType,
    signature_name: settings.signatureName,
    signature_image_data: settings.signatureImageData || null,
    company_logo: settings.companyLogo || null,
    show_exchange_rate_on_invoices: settings.showExchangeRateOnInvoices,
    email_pec: settings.emailPec || null,
    whatsapp_number: settings.whatsappNumber || null,
    whatsapp_template_fr: settings.whatsappTemplateFr || null,
    whatsapp_template_en: settings.whatsappTemplateEn || null,
    whatsapp_template_it: settings.whatsappTemplateIt || null,
    whatsapp_default_language: settings.whatsappDefaultLanguage || "fr",
    email_notifications: settings.emailNotifications ?? true,
    auto_payment_reminder: settings.autoPaymentReminder ?? true,
    reminder_days_before_due: settings.reminderDaysBeforeDue ?? 3,
    stripe_enabled: settings.stripeEnabled ?? false,
    business_sector: settings.businessSector || null,
    prospecting_pitch: settings.prospectingPitch || null,
  };

  const { error } = await supabase
    .from("company_settings")
    .upsert(row, { onConflict: "user_id" });

  if (error) {
    console.error("Erreur saveCompanySettings:", error);
    return false;
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("settings_updated"));
  }

  return true;
}

// ============================================================================
// SEED INITIAL DES DONNÉES DE DÉMONSTRATION SÉNÉGALAISES
// ============================================================================

export async function seedDemoDataIfEmpty(_userId: string): Promise<boolean> {
  // Neutralisé : l'application n'injecte plus aucune fausse donnée mock dans la base Supabase.
  // L'utilisateur démarre avec ses propres données réelles.
  return false;
}

// ============================================================================
// UPLOAD ASSETS (STORAGE: company-assets)
// ============================================================================

export async function uploadCompanyAsset(
  file: File,
  userId: string,
  folder: "logos" | "signatures" | "avatars"
): Promise<{ url: string | null; error?: string }> {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${folder}_${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("company-assets")
    .upload(fileName, file, {
      upsert: true,
      cacheControl: "3600",
    });

  if (uploadError) {
    console.error("Erreur upload asset:", uploadError);
    return { url: null, error: uploadError.message };
  }

  const { data } = supabase.storage.from("company-assets").getPublicUrl(fileName);
  return { url: data.publicUrl };
}

// ============================================================================
// OPÉRATIONS PROFIL UTILISATEUR
// ============================================================================

export async function saveProfile(
  userId: string,
  profileData: {
    full_name?: string;
    email?: string;
    phone?: string;
    role?: string;
    city?: string;
    bio?: string;
    avatar_url?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Erreur saveProfile:", error);
    return { success: false, error: error.message };
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("user_profile_updated"));
  }

  return { success: true };
}

// ============================================================================
// OPÉRATIONS DEVADA LEADS (PROSPECTION B2B & MESSAGES IA)
// ============================================================================

export function rowToLeadSearch(row: LeadSearchRow): LeadSearch {
  return {
    id: row.id,
    userId: row.user_id,
    query: row.query,
    city: row.city,
    senderSector: row.sender_sector || undefined,
    maxResults: row.max_results,
    apifyRunId: row.apify_run_id || undefined,
    apifyDatasetId: row.apify_dataset_id || undefined,
    status: (row.status as "running" | "succeeded" | "failed") || "running",
    resultsCount: row.results_count,
    error: row.error || undefined,
    createdAt: row.created_at,
  };
}

export function rowToLead(row: LeadRow, messages: LeadMessage[] = []): Lead {
  return {
    id: row.id,
    userId: row.user_id,
    searchId: row.search_id || undefined,
    placeId: row.place_id,
    name: row.name,
    category: row.category || undefined,
    address: row.address || undefined,
    city: row.city || undefined,
    phone: row.phone || undefined,
    website: row.website || undefined,
    rating: row.rating ? Number(row.rating) : undefined,
    reviewsCount: row.reviews_count ?? 0,
    mapsUrl: row.maps_url || undefined,
    status: (row.status as LeadStatus) || "new",
    notes: row.notes || undefined,
    convertedClientId: row.converted_client_id || undefined,
    createdAt: row.created_at,
    messages,
  };
}

export function rowToLeadMessage(row: LeadMessageRow): LeadMessage {
  return {
    id: row.id,
    userId: row.user_id,
    leadId: row.lead_id,
    channel: (row.channel as LeadChannel) || "whatsapp",
    tone: (row.tone as LeadTone) || "professional",
    subject: row.subject || undefined,
    content: row.content,
    model: row.model || undefined,
    createdAt: row.created_at,
  };
}

export async function fetchLeadSearches(userId: string): Promise<LeadSearch[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lead_searches")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur fetchLeadSearches:", error);
    return [];
  }

  return (data || []).map(rowToLeadSearch);
}

export async function fetchLeads(userId: string, searchId?: string): Promise<Lead[]> {
  const supabase = createClient();

  let query = supabase
    .from("leads")
    .select("*, lead_messages(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (searchId) {
    query = query.eq("search_id", searchId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erreur fetchLeads:", error);
    return [];
  }

  return (data || []).map((row: any) => {
    const messages = Array.isArray(row.lead_messages)
      ? row.lead_messages.map(rowToLeadMessage)
      : [];
    return rowToLead(row, messages);
  });
}

export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
  notes?: string
): Promise<boolean> {
  const supabase = createClient();
  const payload: any = { status };
  if (notes !== undefined) payload.notes = notes;

  const { error } = await supabase
    .from("leads")
    .update(payload)
    .eq("id", leadId);

  if (error) {
    console.error("Erreur updateLeadStatus:", error);
    return false;
  }

  return true;
}

export async function deleteLead(leadId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("leads").delete().eq("id", leadId);

  if (error) {
    console.error("Erreur deleteLead:", error);
    return false;
  }

  return true;
}

export async function deleteLeadSearch(searchId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("lead_searches").delete().eq("id", searchId);

  if (error) {
    console.error("Erreur deleteLeadSearch:", error);
    return false;
  }

  return true;
}

export async function convertLeadToClient(
  lead: Lead,
  userId: string
): Promise<{ client: Client | null; error?: string }> {
  const supabase = createClient();

  const avatarColors = [
    "bg-blue-600",
    "bg-emerald-600",
    "bg-violet-600",
    "bg-rose-600",
    "bg-indigo-600",
    "bg-amber-600",
    "bg-teal-600",
  ];
  const avatarBg = avatarColors[Math.floor(Math.random() * avatarColors.length)];

  // 1. Créer le client dans la table clients
  const clientPayload = {
    user_id: userId,
    name: lead.name,
    email: null,
    phone: lead.phone || null,
    whatsapp: lead.phone || null,
    city: lead.city || "Dakar",
    address: lead.address || null,
    country: "Sénégal",
    avatar_bg: avatarBg,
    status: "active",
  };

  const { data: newClient, error: clientError } = await supabase
    .from("clients")
    .insert(clientPayload)
    .select()
    .single();

  if (clientError || !newClient) {
    console.error("Erreur convertLeadToClient (création client):", clientError);
    return { client: null, error: clientError?.message || "Impossible de créer le client" };
  }

  // 2. Marquer le lead comme converti
  await supabase
    .from("leads")
    .update({
      status: "converted",
      converted_client_id: newClient.id,
    })
    .eq("id", lead.id);

  const mappedClient: Client = {
    id: newClient.id,
    name: newClient.name,
    email: newClient.email || "",
    phone: newClient.phone || "",
    whatsapp: newClient.whatsapp || undefined,
    city: newClient.city || "",
    address: newClient.address || "",
    country: newClient.country || "Sénégal",
    ninea: newClient.ninea || undefined,
    rccm: newClient.rccm || undefined,
    totalBilled: 0,
    balanceDue: 0,
    invoicesCount: 0,
    avatarBg: newClient.avatar_bg || avatarBg,
    status: (newClient.status as "active" | "inactive") || "active",
    createdAt: newClient.created_at || new Date().toISOString(),
  };

  return { client: mappedClient };
}

export async function fetchLeadMessages(leadId: string): Promise<LeadMessage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lead_messages")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur fetchLeadMessages:", error);
    return [];
  }

  return (data || []).map(rowToLeadMessage);
}

export async function saveLeadMessage(
  message: Omit<LeadMessage, "id" | "createdAt">
): Promise<LeadMessage | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lead_messages")
    .insert({
      user_id: message.userId,
      lead_id: message.leadId,
      channel: message.channel,
      tone: message.tone,
      subject: message.subject || null,
      content: message.content,
      model: message.model || null,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Erreur saveLeadMessage:", error);
    return null;
  }

  return rowToLeadMessage(data);
}

