"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  Client,
  CompanySettings,
  AppNotification,
  DEFAULT_SETTINGS,
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
  return {
    id: row.id,
    name: row.name,
    email: row.email || "",
    emailPec: row.email_pec || undefined,
    phone: row.phone || "",
    whatsapp: row.whatsapp || undefined,
    city: row.city || "Dakar",
    address: row.address || "",
    ninea: row.ninea || undefined,
    rccm: row.rccm || undefined,
    totalBilled: 0,
    balanceDue: 0,
    invoicesCount: 0,
    avatarBg: row.avatar_bg || "bg-blue-600",
    status: (row.status as "active" | "inactive") || "active",
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function rowToSettings(row: CompanySettingsRow): CompanySettings {
  return {
    ...DEFAULT_SETTINGS,
    companyName: row.company_name || DEFAULT_SETTINGS.companyName,
    legalForm: row.legal_form || DEFAULT_SETTINGS.legalForm,
    tradeName: row.trade_name || DEFAULT_SETTINGS.tradeName || "",
    ninea: row.ninea || DEFAULT_SETTINGS.ninea,
    rccm: row.rccm || DEFAULT_SETTINGS.rccm,
    address: row.address || DEFAULT_SETTINGS.address,
    city: row.city || DEFAULT_SETTINGS.city,
    postalCode: row.postal_code || DEFAULT_SETTINGS.postalCode,
    country: row.country || DEFAULT_SETTINGS.country,
    email: row.email || DEFAULT_SETTINGS.email,
    phone: row.phone || DEFAULT_SETTINGS.phone,
    website: row.website || DEFAULT_SETTINGS.website,
    currency: row.currency || DEFAULT_SETTINGS.currency,
    defaultLanguage: (row.default_language as "fr" | "en" | "it") || "fr",
    taxApplicable: row.tax_applicable ?? true,
    defaultTaxRate: Number(row.default_tax_rate) || 18,
    invoicePrefix: row.invoice_prefix || "FAC-",
    defaultDueDays: row.default_due_days || 15,
    nextInvoiceSequence: row.next_invoice_sequence || 51,
    footerLegalText: row.footer_legal_text || DEFAULT_SETTINGS.footerLegalText,
    lateFeeInterestRate: Number(row.late_fee_interest_rate) || 1.5,
    waveEnabled: row.wave_enabled ?? true,
    waveNumber: row.wave_number || DEFAULT_SETTINGS.waveNumber,
    waveAccountName: row.wave_account_name || DEFAULT_SETTINGS.waveAccountName,
    omEnabled: row.om_enabled ?? true,
    omNumber: row.om_number || DEFAULT_SETTINGS.omNumber,
    omMerchantCode: row.om_merchant_code || DEFAULT_SETTINGS.omMerchantCode,
    bankEnabled: row.bank_enabled ?? true,
    bankName: row.bank_name || DEFAULT_SETTINGS.bankName,
    bankIban: row.bank_iban || DEFAULT_SETTINGS.bankIban,
    bankRibKey: row.bank_rib_key || DEFAULT_SETTINGS.bankRibKey,
    bankAccountHolder: row.bank_account_holder || DEFAULT_SETTINGS.bankAccountHolder,
    rateEur: Number(row.rate_eur) || 655.957,
    rateUsd: Number(row.rate_usd) || 600.0,
    signatureType: (row.signature_type as "image" | "name") || "name",
    signatureName: row.signature_name || DEFAULT_SETTINGS.signatureName,
    signatureImageData: row.signature_image_data || "",
    companyLogo: row.company_logo || "",
    showExchangeRateOnInvoices: row.show_exchange_rate_on_invoices ?? false,
    emailPec: row.email_pec || undefined,
    whatsappNumber: row.whatsapp_number || undefined,
    whatsappTemplateFr: row.whatsapp_template_fr || DEFAULT_SETTINGS.whatsappTemplateFr,
    whatsappTemplateEn: row.whatsapp_template_en || DEFAULT_SETTINGS.whatsappTemplateEn,
    whatsappTemplateIt: row.whatsapp_template_it || DEFAULT_SETTINGS.whatsappTemplateIt,
    whatsappDefaultLanguage: (row.whatsapp_default_language as "fr" | "en" | "it") || "fr",
    emailNotifications: row.email_notifications ?? true,
    autoPaymentReminder: row.auto_payment_reminder ?? true,
    reminderDaysBeforeDue: Number(row.reminder_days_before_due) || 3,
    stripeEnabled: row.stripe_enabled ?? false,
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
    address: client.address || null,
    ninea: client.ninea || null,
    rccm: client.rccm || null,
    avatar_bg: client.avatarBg || "bg-blue-600",
    status: client.status || "active",
  };

  const isTempId = !client.id || client.id.startsWith("client-");

  if (isTempId) {
    const { data, error } = await supabase
      .from("clients")
      .insert(clientRow)
      .select("id")
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, id: data.id };
  } else {
    const { error } = await supabase
      .from("clients")
      .update(clientRow)
      .eq("id", client.id!)
      .eq("user_id", userId);

    if (error) return { success: false, error: error.message };
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

  return !error;
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
  folder: "logos" | "signatures"
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
