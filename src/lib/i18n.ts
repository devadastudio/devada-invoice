"use client";

export type AppLanguage = "fr" | "en" | "it";

export interface LanguageOption {
  code: AppLanguage;
  name: string;
  flag: string;
  shortName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "fr", name: "Français", flag: "🇫🇷", shortName: "FR" },
  { code: "en", name: "English", flag: "🇬🇧", shortName: "EN" },
  { code: "it", name: "Italiano", flag: "🇮🇹", shortName: "IT" },
];

export const LANGUAGE_STORAGE_KEY = "devada_platform_language";

export function getStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") return "fr";
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === "fr" || saved === "en" || saved === "it") {
      return saved;
    }
    // Also check company settings
    const settingsRaw = localStorage.getItem("devada_settings_data_v2");
    if (settingsRaw) {
      const parsed = JSON.parse(settingsRaw);
      if (parsed.defaultLanguage === "fr" || parsed.defaultLanguage === "en" || parsed.defaultLanguage === "it") {
        return parsed.defaultLanguage;
      }
    }
    return "fr";
  } catch {
    return "fr";
  }
}

export function saveStoredLanguage(lang: AppLanguage) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    window.dispatchEvent(new CustomEvent("language_updated", { detail: lang }));
  } catch (e) {
    console.error("Failed to save language", e);
  }
}

/**
 * Translations for official Invoice Documents (PDF, Preview & Detail View)
 */
export interface InvoiceDocumentTranslations {
  documentTitle: string;
  invoiceNumberPrefix: string;
  issueDate: string;
  dueDate: string;
  paymentMethod: string;
  from: string;
  to: string;
  clientNinea: string;
  clientRccm: string;
  itemDescription: string;
  quantity: string;
  unitPriceHT: string;
  totalHT: string;
  subtotalHT: string;
  discount: string;
  vatSenegal: string;
  totalTTC: string;
  netToPay: string;
  amountPaid: string;
  balanceDue: string;
  paymentTerms: string;
  paymentNotice: string;
  bankDetails: string;
  accountHolder: string;
  status: {
    paid: string;
    overdue: string;
    sent: string;
    draft: string;
  };
  waDescription: {
    paid: string;
    overdue: string;
    standard: string;
    thanks: string;
    attachedNotice: string;
  };
}

export const INVOICE_TRANSLATIONS: Record<AppLanguage, InvoiceDocumentTranslations> = {
  fr: {
    documentTitle: "FACTURE",
    invoiceNumberPrefix: "N°",
    issueDate: "Date d'émission",
    dueDate: "Date d'échéance",
    paymentMethod: "Mode de règlement",
    from: "Émetteur :",
    to: "Facturé à (Client) :",
    clientNinea: "NINEA",
    clientRccm: "RCCM",
    itemDescription: "Désignation de la prestation",
    quantity: "Qté",
    unitPriceHT: "Prix Unitaire HT",
    totalHT: "Total HT",
    subtotalHT: "Sous-total HT",
    discount: "Remise commerciale",
    vatSenegal: "TVA Sénégal (18%)",
    totalTTC: "Total TTC (Net à payer)",
    netToPay: "Net à payer",
    amountPaid: "Déjà réglé",
    balanceDue: "Reste à payer",
    paymentTerms: "Conditions de règlement",
    paymentNotice: "Règlement sous 15 jours à réception. En cas de retard, une pénalité légale sera appliquée conformément à la législation OHADA.",
    bankDetails: "Coordonnées bancaires pour virement",
    accountHolder: "Titulaire du compte",
    status: {
      paid: "Payée",
      overdue: "En retard",
      sent: "Envoyée",
      draft: "Brouillon",
    },
    waDescription: {
      paid: "Veuillez trouver ci-joint votre reçu de facture",
      overdue: "Rappel amical : Veuillez trouver ci-joint votre facture",
      standard: "Veuillez trouver ci-joint votre facture officielle",
      thanks: "Merci pour votre confiance !",
      attachedNotice: "Document PDF officiel en pièce jointe.",
    },
  },
  en: {
    documentTitle: "INVOICE",
    invoiceNumberPrefix: "No.",
    issueDate: "Issue Date",
    dueDate: "Due Date",
    paymentMethod: "Payment Method",
    from: "Issued by:",
    to: "Billed to (Client):",
    clientNinea: "Tax ID (NINEA)",
    clientRccm: "Trade Reg. (RCCM)",
    itemDescription: "Description / Service",
    quantity: "Qty",
    unitPriceHT: "Unit Price (excl. tax)",
    totalHT: "Total (excl. tax)",
    subtotalHT: "Subtotal (excl. tax)",
    discount: "Commercial Discount",
    vatSenegal: "Senegal VAT (18%)",
    totalTTC: "Total Due (incl. tax)",
    netToPay: "Net Amount Due",
    amountPaid: "Amount Paid",
    balanceDue: "Balance Due",
    paymentTerms: "Payment Terms",
    paymentNotice: "Payment due within 15 days upon receipt. In case of late payment, statutory interest will be applied under OHADA business law.",
    bankDetails: "Bank details for wire transfer",
    accountHolder: "Account Holder",
    status: {
      paid: "Paid",
      overdue: "Overdue",
      sent: "Sent",
      draft: "Draft",
    },
    waDescription: {
      paid: "Please find attached your invoice payment receipt",
      overdue: "Friendly reminder: Please find attached your invoice",
      standard: "Please find attached your official invoice",
      thanks: "Thank you for your business!",
      attachedNotice: "Official PDF document attached.",
    },
  },
  it: {
    documentTitle: "FATTURA",
    invoiceNumberPrefix: "N.",
    issueDate: "Data di emissione",
    dueDate: "Data di scadenza",
    paymentMethod: "Metodo di pagamento",
    from: "Emittente:",
    to: "Fatturato a (Cliente):",
    clientNinea: "Codice Fiscale (NINEA)",
    clientRccm: "Reg. Imprese (RCCM)",
    itemDescription: "Descrizione della prestazione",
    quantity: "Q.tà",
    unitPriceHT: "Prezzo Unitario (IVA escl.)",
    totalHT: "Totale (IVA escl.)",
    subtotalHT: "Subtotale (IVA escl.)",
    discount: "Sconto commerciale",
    vatSenegal: "IVA Senegal (18%)",
    totalTTC: "Totale Fattura (da pagare)",
    netToPay: "Netto da pagare",
    amountPaid: "Importo pagato",
    balanceDue: "Saldo dovuto",
    paymentTerms: "Condizioni di pagamento",
    paymentNotice: "Pagamento entro 15 giorni dal ricevimento. In caso di ritardo, verranno applicati gli interessi legali ai sensi del diritto OHADA.",
    bankDetails: "Coordinate bancarie per bonifico",
    accountHolder: "Intestatario del conto",
    status: {
      paid: "Pagata",
      overdue: "In ritardo",
      sent: "Inviata",
      draft: "Bozza",
    },
    waDescription: {
      paid: "In allegato trova la ricevuta di pagamento della fattura",
      overdue: "Promemoria: In allegato trova la fattura scaduta",
      standard: "In allegato trova la fattura ufficiale",
      thanks: "Grazie per la fiducia!",
      attachedNotice: "Documento PDF ufficiale in allegato.",
    },
  },
};

export function getInvoiceTranslations(lang?: string): InvoiceDocumentTranslations {
  if (lang === "en" || lang === "it" || lang === "fr") {
    return INVOICE_TRANSLATIONS[lang];
  }
  return INVOICE_TRANSLATIONS.fr;
}

/**
 * Checks if a payment terms text is a standard default phrase that can be auto-translated
 */
export function isDefaultPaymentNotice(text?: string): boolean {
  if (!text || !text.trim()) return true;
  const trimmed = text.trim();
  const knownDefaults = [
    "Règlement exigible à réception. Tout retard de paiement donnera lieu à une pénalité légale conformément aux règles OHADA.",
    INVOICE_TRANSLATIONS.fr.paymentNotice.trim(),
    INVOICE_TRANSLATIONS.en.paymentNotice.trim(),
    INVOICE_TRANSLATIONS.it.paymentNotice.trim(),
  ];
  return knownDefaults.includes(trimmed);
}

/**
 * Real-time business translator for invoice payment terms, legal mentions, and footer notices.
 * Supports instantaneous translation between French, English, and Italian.
 */
export function translateInvoiceText(
  text: string,
  toLang: AppLanguage,
  fromLang: AppLanguage = "fr"
): string {
  if (!text || !text.trim()) return "";
  if (toLang === fromLang) return text;

  const trimmed = text.trim();

  // 1. Direct standard payment notice match
  if (
    trimmed === INVOICE_TRANSLATIONS.fr.paymentNotice.trim() ||
    trimmed === "Règlement exigible à réception. Tout retard de paiement donnera lieu à une pénalité légale conformément aux règles OHADA." ||
    trimmed === INVOICE_TRANSLATIONS.en.paymentNotice.trim() ||
    trimmed === INVOICE_TRANSLATIONS.it.paymentNotice.trim()
  ) {
    return INVOICE_TRANSLATIONS[toLang].paymentNotice;
  }

  let result = text;

  if (toLang === "en") {
    const rules: [RegExp, string][] = [
      [/SARL au capital de/gi, "LLC with capital of"],
      [/SAS au capital de/gi, "Joint-stock company with capital of"],
      [/SUARL au capital de/gi, "Single-member LLC with capital of"],
      [/Société au capital de/gi, "Company with capital of"],
      [/au capital de/gi, "with capital of"],
      [/Règlement sous (\d+) jours à réception/gi, "Payment due within $1 days upon receipt"],
      [/Règlement sous (\d+) jours fin de mois/gi, "Payment due within $1 days end of month"],
      [/Règlement sous (\d+) jours/gi, "Payment due within $1 days"],
      [/Règlement exigible à réception/gi, "Payment due upon receipt"],
      [/Règlement à réception/gi, "Payment due upon receipt"],
      [/Règlement comptant/gi, "Cash payment upon receipt"],
      [/Paiement sous (\d+) jours à réception/gi, "Payment within $1 days upon receipt"],
      [/Paiement sous (\d+) jours fin de mois/gi, "Payment within $1 days end of month"],
      [/Paiement sous (\d+) jours/gi, "Payment within $1 days"],
      [/Paiement exigible à réception/gi, "Payment due upon receipt"],
      [/Paiement à réception/gi, "Payment upon receipt"],
      [/Paiement comptant/gi, "Cash payment"],
      [/Paiement par virement bancaire/gi, "Payment by bank transfer"],
      [/Paiement par virement/gi, "Payment by wire transfer"],
      [/Paiement par chèque/gi, "Payment by check"],
      [/Paiement par carte bancaire/gi, "Payment by credit card"],
      [/Paiement via Wave/gi, "Payment via Wave"],
      [/Paiement via Orange Money/gi, "Payment via Orange Money"],
      [/En cas de retard, une pénalité légale sera appliquée conformément à la législation OHADA/gi, "In case of late payment, statutory interest will be applied under OHADA business law"],
      [/Tout retard de paiement donnera lieu à une pénalité légale conformément aux règles OHADA/gi, "Any late payment will incur statutory penalties in accordance with OHADA rules"],
      [/Tout retard de paiement donnera lieu à une pénalité/gi, "Any late payment will incur a penalty"],
      [/En cas de retard de paiement/gi, "In case of late payment"],
      [/En cas de retard/gi, "In case of late payment"],
      [/pénalités de retard/gi, "late payment penalties"],
      [/pénalité de retard/gi, "late payment penalty"],
      [/pénalité légale/gi, "statutory penalty"],
      [/conformément aux règles OHADA/gi, "in accordance with OHADA rules"],
      [/conformément à la législation OHADA/gi, "under OHADA business law"],
      [/conformément à la loi/gi, "in accordance with the law"],
      [/taux d'intérêt légal/gi, "statutory interest rate"],
      [/indemnité forfaitaire de compensation/gi, "fixed recovery compensation"],
      [/indemnité forfaitaire/gi, "fixed compensation"],
      [/frais de recouvrement/gi, "recovery costs"],
      [/Pas d'escompte accordé pour paiement anticipé/gi, "No discount granted for early payment"],
      [/Pas d'escompte pour paiement anticipé/gi, "No discount for early payment"],
      [/Pas d'escompte accordé/gi, "No discount granted"],
      [/Aucun escompte consenti/gi, "No discount allowed"],
      [/Escompte pour paiement anticipé/gi, "Early payment discount"],
      [/TVA non applicable/gi, "VAT not applicable"],
      [/selon l'article/gi, "according to article"],
      [/Code Général des Impôts/gi, "General Tax Code"],
      [/Acompte de (\d+)% à la commande/gi, "Deposit of $1% upon order"],
      [/Acompte de (\d+)%/gi, "Deposit of $1%"],
      [/Solde à la livraison/gi, "Balance upon delivery"],
      [/Solde à réception/gi, "Balance upon receipt"],
      [/Solde à la fin des travaux/gi, "Balance upon completion of work"],
      [/Merci pour votre confiance/gi, "Thank you for your business"],
      [/Merci de votre confiance/gi, "Thank you for your trust"],
      [/Signature précédée de la mention lu et approuvé/gi, "Signature preceded by read and approved"],
      [/Bon pour accord/gi, "Approved and agreed"],
      [/Tous droits réservés/gi, "All rights reserved"],
      [/Document officiel conforme aux dispositions fiscales sénégalaises et normes OHADA/gi, "Official document compliant with Senegalese tax regulations and OHADA standards"],
      [/Document officiel/gi, "Official document"],
      [/\bNINEA\b/g, "Tax ID (NINEA)"],
      [/\bRCCM\b/g, "Trade Reg. (RCCM)"],
      [/Conditions de règlement/gi, "Payment terms"],
      [/Conditions de paiement/gi, "Payment terms"],
      [/Mentions légales/gi, "Legal notices"],
      [/Mention de pied de page/gi, "Footer notice"],
      [/Coordonnées bancaires/gi, "Bank details"],
      [/Titulaire du compte/gi, "Account holder"],
      [/virement bancaire/gi, "bank transfer"],
      [/sous\s+(\d+)\s*jours/gi, "within $1 days"],
      [/(\d+)\s*jours/gi, "$1 days"],
      [/(\d+)\s*semaines/gi, "$1 weeks"],
      [/(\d+)\s*mois/gi, "$1 months"],
      [/fin de mois/gi, "end of month"],
      [/à réception/gi, "upon receipt"],
      [/\bsous\b/gi, "within"],
    ];
    for (const [pattern, replacement] of rules) {
      result = result.replace(pattern, replacement);
    }
    return result;
  }

  if (toLang === "it") {
    const rules: [RegExp, string][] = [
      [/SARL au capital de/gi, "SARL con capitale di"],
      [/SAS au capital de/gi, "SAS con capitale di"],
      [/SUARL au capital de/gi, "SUARL con capitale di"],
      [/Société au capital de/gi, "Società con capitale di"],
      [/au capital de/gi, "con capitale di"],
      [/Règlement sous (\d+) jours à réception/gi, "Pagamento entro $1 giorni dal ricevimento"],
      [/Règlement sous (\d+) jours fin de mois/gi, "Pagamento entro $1 giorni fine mese"],
      [/Règlement sous (\d+) jours/gi, "Pagamento entro $1 giorni"],
      [/Règlement exigible à réception/gi, "Pagamento dovuto al ricevimento"],
      [/Règlement à réception/gi, "Pagamento al ricevimento"],
      [/Règlement comptant/gi, "Pagamento in contanti al ricevimento"],
      [/Paiement sous (\d+) jours à réception/gi, "Pagamento entro $1 giorni dal ricevimento"],
      [/Paiement sous (\d+) jours fin de mois/gi, "Pagamento entro $1 giorni fine mese"],
      [/Paiement sous (\d+) jours/gi, "Pagamento entro $1 giorni"],
      [/Paiement exigible à réception/gi, "Pagamento dovuto al ricevimento"],
      [/Paiement à réception/gi, "Pagamento al ricevimento"],
      [/Paiement comptant/gi, "Pagamento in contanti"],
      [/Paiement par virement bancaire/gi, "Pagamento tramite bonifico bancario"],
      [/Paiement par virement/gi, "Pagamento con bonifico"],
      [/Paiement par chèque/gi, "Pagamento tramite assegno"],
      [/Paiement par carte bancaire/gi, "Pagamento con carta di credito"],
      [/Paiement via Wave/gi, "Pagamento tramite Wave"],
      [/Paiement via Orange Money/gi, "Pagamento tramite Orange Money"],
      [/En cas de retard, une pénalité légale sera appliquée conformément à la législation OHADA/gi, "In caso di ritardo, verranno applicati gli interessi legali ai sensi del diritto OHADA"],
      [/Tout retard de paiement donnera lieu à une pénalité légale conformément aux règles OHADA/gi, "Ogni ritardo di pagamento comporterà una penale legale conformemente alle norme OHADA"],
      [/Tout retard de paiement donnera lieu à une pénalité/gi, "Ogni ritardo di pagamento comporterà una penale"],
      [/En cas de retard de paiement/gi, "In caso di ritardo di pagamento"],
      [/En cas de retard/gi, "In caso di ritardo"],
      [/pénalités de retard/gi, "penali per ritardo"],
      [/pénalité de retard/gi, "penale per ritardo"],
      [/pénalité légale/gi, "penale legale"],
      [/conformément aux règles OHADA/gi, "conformemente alle norme OHADA"],
      [/conformément à la législation OHADA/gi, "ai sensi della legislazione OHADA"],
      [/conformément à la loi/gi, "a norma di legge"],
      [/taux d'intérêt légal/gi, "tasso di interesse legale"],
      [/indemnité forfaitaire de compensation/gi, "indennità forfettaria di compensazione"],
      [/indemnité forfaitaire/gi, "indennità forfettaria"],
      [/frais de recouvrement/gi, "spese di recupero crediti"],
      [/Pas d'escompte accordé pour paiement anticipé/gi, "Nessuno sconto concesso per pagamento anticipato"],
      [/Pas d'escompte pour paiement anticipé/gi, "Nessuno sconto per pagamento anticipato"],
      [/Pas d'escompte accordé/gi, "Nessuno sconto accordato"],
      [/Aucun escompte consenti/gi, "Nessuno sconto consentito"],
      [/Escompte pour paiement anticipé/gi, "Sconto per pagamento anticipato"],
      [/TVA non applicable/gi, "IVA non applicabile"],
      [/selon l'article/gi, "ai sensi dell'articolo"],
      [/Code Général des Impôts/gi, "Codice Generale delle Imposte"],
      [/Acompte de (\d+)% à la commande/gi, "Acconto del $1% all'ordine"],
      [/Acompte de (\d+)%/gi, "Acconto del $1%"],
      [/Solde à la livraison/gi, "Saldo alla consegna"],
      [/Solde à réception/gi, "Saldo al ricevimento"],
      [/Solde à la fin des travaux/gi, "Saldo al termine dei lavori"],
      [/Merci pour votre confiance/gi, "Grazie per la fiducia"],
      [/Merci de votre confiance/gi, "Grazie per la vostra fiducia"],
      [/Signature précédée de la mention lu et approuvé/gi, "Firma preceduta dalla dicitura letto e approvato"],
      [/Bon pour accord/gi, "Approvato per accordo"],
      [/Tous droits réservés/gi, "Tutti i diritti riservati"],
      [/Document officiel conforme aux dispositions fiscales sénégalaises et normes OHADA/gi, "Documento ufficiale conforme alle disposizioni fiscali senegalesi e norme OHADA"],
      [/Document officiel/gi, "Documento ufficiale"],
      [/\bNINEA\b/g, "Codice Fiscale (NINEA)"],
      [/\bRCCM\b/g, "Reg. Imprese (RCCM)"],
      [/Conditions de règlement/gi, "Condizioni di pagamento"],
      [/Conditions de paiement/gi, "Condizioni di pagamento"],
      [/Conditions générales/gi, "Condizioni generali"],
      [/Mentions légales/gi, "Note legali"],
      [/Mention de pied de page/gi, "Dicitura a piè di pagina"],
      [/Coordonnées bancaires/gi, "Coordinate bancarie"],
      [/Titulaire du compte/gi, "Intestatario del conto"],
      [/virement bancaire/gi, "bonifico bancario"],
      [/sous\s+(\d+)\s*jours/gi, "entro $1 giorni"],
      [/(\d+)\s*jours/gi, "$1 giorni"],
      [/(\d+)\s*semaines/gi, "$1 settimane"],
      [/(\d+)\s*mois/gi, "$1 mesi"],
      [/fin de mois/gi, "fine mese"],
      [/à réception/gi, "al ricevimento"],
      [/\bsous\b/gi, "entro"],
    ];
    for (const [pattern, replacement] of rules) {
      result = result.replace(pattern, replacement);
    }
    return result;
  }

  if (toLang === "fr") {
    const reverseRules: [RegExp, string][] = [
      [/LLC with capital of/gi, "SARL au capital de"],
      [/Joint-stock company with capital of/gi, "SAS au capital de"],
      [/Single-member LLC with capital of/gi, "SUARL au capital de"],
      [/Company with capital of/gi, "Société au capital de"],
      [/SARL con capitale di/gi, "SARL au capital de"],
      [/SAS con capitale di/gi, "SAS au capital de"],
      [/Payment due within (\d+) days upon receipt/gi, "Règlement sous $1 jours à réception"],
      [/Payment due within (\d+) days/gi, "Règlement sous $1 jours"],
      [/Payment due upon receipt/gi, "Règlement à réception"],
      [/Pagamento entro (\d+) giorni dal ricevimento/gi, "Règlement sous $1 jours à réception"],
      [/Pagamento entro (\d+) giorni/gi, "Règlement sous $1 jours"],
      [/Pagamento al ricevimento/gi, "Règlement à réception"],
      [/Payment by bank transfer/gi, "Paiement par virement bancaire"],
      [/Pagamento tramite bonifico bancario/gi, "Paiement par virement bancaire"],
      [/Tax ID \(NINEA\):?/gi, "NINEA :"],
      [/Trade Reg\. \(RCCM\):?/gi, "RCCM :"],
      [/Codice Fiscale \(NINEA\):?/gi, "NINEA :"],
      [/Reg\. Imprese \(RCCM\):?/gi, "RCCM :"],
      [/Deposit of (\d+)% upon order/gi, "Acompte de $1% à la commande"],
      [/Acconto del (\d+)% all'ordine/gi, "Acompte de $1% à la commande"],
      [/Balance upon delivery/gi, "Solde à la livraison"],
      [/Saldo alla consegna/gi, "Solde à la livraison"],
      [/Thank you for your business/gi, "Merci pour votre confiance"],
      [/Grazie per la fiducia/gi, "Merci pour votre confiance"],
    ];
    for (const [pattern, replacement] of reverseRules) {
      result = result.replace(pattern, replacement);
    }
    return result;
  }

  return text;
}

/**
 * Service & item catalog translations for instant real-time translation of line items.
 */
export interface ServiceTranslationEntry {
  fr: string;
  en: string;
  it: string;
}

export const COMMON_SERVICES_TRANSLATIONS: ServiceTranslationEntry[] = [
  // Prestations de service & conseil
  { fr: "Prestation de service", en: "Service provision", it: "Prestazione di servizi" },
  { fr: "Prestation de service professionnelle", en: "Professional service provision", it: "Prestazione di servizi professionali" },
  { fr: "Prestation de conseil", en: "Consulting services", it: "Servizi di consulenza" },
  { fr: "Conseil en stratégie", en: "Strategy consulting", it: "Consulenza strategica" },
  { fr: "Conseil en gestion", en: "Management consulting", it: "Consulenza direzionale" },
  { fr: "Conseil informatique", en: "IT consulting", it: "Consulenza informatica" },
  { fr: "Consulting stratégique", en: "Strategic consulting", it: "Consulenza strategica" },
  { fr: "Gestion de projet", en: "Project management", it: "Gestione del progetto" },
  { fr: "Assistance technique", en: "Technical assistance", it: "Assistenza tecnica" },
  { fr: "Support technique", en: "Technical support", it: "Supporto tecnico" },
  { fr: "Support et maintenance", en: "Support and maintenance", it: "Supporto e manutenzione" },

  // Web & Informatique
  { fr: "Développement web", en: "Web development", it: "Sviluppo web" },
  { fr: "Développement application mobile", en: "Mobile app development", it: "Sviluppo app mobile" },
  { fr: "Développement d'application mobile", en: "Mobile app development", it: "Sviluppo app mobile" },
  { fr: "Développement logiciel", en: "Software development", it: "Sviluppo software" },
  { fr: "Développement frontend", en: "Frontend development", it: "Sviluppo frontend" },
  { fr: "Développement backend", en: "Backend development", it: "Sviluppo backend" },
  { fr: "Création de site internet", en: "Website creation", it: "Creazione sito web" },
  { fr: "Création de site web", en: "Website creation", it: "Creazione sito web" },
  { fr: "Création de site vitrine", en: "Showcase website creation", it: "Creazione sito vetrina" },
  { fr: "Création de boutique en ligne", en: "Online store creation", it: "Creazione negozio online" },
  { fr: "Création de site e-commerce", en: "E-commerce website creation", it: "Creazione sito e-commerce" },
  { fr: "Refonte de site internet", en: "Website redesign", it: "Restyling del sito web" },
  { fr: "Refonte de site web", en: "Website redesign", it: "Restyling del sito web" },
  { fr: "Maintenance de site internet", en: "Website maintenance", it: "Manutenzione del sito web" },
  { fr: "Maintenance web", en: "Web maintenance", it: "Manutenzione web" },
  { fr: "Maintenance informatique", en: "IT maintenance", it: "Manutenzione informatica" },
  { fr: "Maintenance logicielle", en: "Software maintenance", it: "Manutenzione software" },
  { fr: "Maintenance préventive", en: "Preventive maintenance", it: "Manutenzione preventiva" },
  { fr: "Maintenance corrective", en: "Corrective maintenance", it: "Manutenzione correttiva" },
  { fr: "Maintenance mensuelle", en: "Monthly maintenance", it: "Manutenzione mensile" },
  { fr: "Maintenance annuelle", en: "Annual maintenance", it: "Manutenzione annuale" },
  { fr: "Hébergement web", en: "Web hosting", it: "Hosting web" },
  { fr: "Hébergement cloud", en: "Cloud hosting", it: "Hosting cloud" },
  { fr: "Hébergement serveur", en: "Server hosting", it: "Hosting server" },
  { fr: "Nom de domaine", en: "Domain name", it: "Nome di dominio" },
  { fr: "Certificat SSL", en: "SSL certificate", it: "Certificato SSL" },
  { fr: "Audit de sécurité", en: "Security audit", it: "Audit di sicurezza" },
  { fr: "Audit informatique", en: "IT audit", it: "Audit informatico" },
  { fr: "Audit de performance", en: "Performance audit", it: "Audit delle prestazioni" },
  { fr: "Intégration d'API", en: "API integration", it: "Integrazione API" },
  { fr: "Intégration API de paiement", en: "Payment API integration", it: "Integrazione API di pagamento" },
  { fr: "Sauvegarde de données", en: "Data backup", it: "Backup dei dati" },
  { fr: "Migration de données", en: "Data migration", it: "Migrazione dei dati" },
  { fr: "Configuration serveur", en: "Server configuration", it: "Configurazione del server" },
  { fr: "Installation réseau", en: "Network installation", it: "Installazione di rete" },
  { fr: "Câblage réseau", en: "Network cabling", it: "Cablaggio di rete" },

  // Design, Graphisme & Communication
  { fr: "Design graphique", en: "Graphic design", it: "Progettazione grafica" },
  { fr: "Création de logo", en: "Logo creation", it: "Creazione del logo" },
  { fr: "Conception de logo", en: "Logo design", it: "Progettazione del logo" },
  { fr: "Identité visuelle", en: "Visual identity", it: "Identità visiva" },
  { fr: "Charte graphique", en: "Graphic guidelines", it: "Linee guida grafiche" },
  { fr: "Design UI/UX", en: "UI/UX design", it: "Design UI/UX" },
  { fr: "Conception de maquette", en: "Mockup design", it: "Progettazione mockup" },
  { fr: "Campagne publicitaire", en: "Advertising campaign", it: "Campagna pubblicitaria" },
  { fr: "Campagne marketing", en: "Marketing campaign", it: "Campagna di marketing" },
  { fr: "Gestion des réseaux sociaux", en: "Social media management", it: "Gestione dei social media" },
  { fr: "Community management", en: "Community management", it: "Community management" },
  { fr: "Rédaction de contenu", en: "Content writing", it: "Redazione di contenuti" },
  { fr: "Rédaction web", en: "Web copywriting", it: "Copywriting per il web" },
  { fr: "Optimisation SEO", en: "SEO optimization", it: "Ottimizzazione SEO" },
  { fr: "Référencement naturel", en: "Organic search SEO", it: "Posizionamento organico (SEO)" },
  { fr: "Production vidéo", en: "Video production", it: "Produzione video" },
  { fr: "Montage vidéo", en: "Video editing", it: "Montaggio video" },
  { fr: "Shooting photo", en: "Photo shoot", it: "Servizio fotografico" },
  { fr: "Création de plaquette commerciale", en: "Brochure creation", it: "Creazione depliant commerciale" },
  { fr: "Impression cartes de visite", en: "Business cards printing", it: "Stampa biglietti da visita" },

  // Formation & Audit
  { fr: "Formation professionnelle", en: "Professional training", it: "Formazione professionale" },
  { fr: "Formation en entreprise", en: "Corporate training", it: "Formazione aziendale" },
  { fr: "Formation bureautique", en: "Office software training", it: "Formazione informatica di base" },
  { fr: "Atelier de formation", en: "Training workshop", it: "Workshop formativo" },
  { fr: "Audit comptable", en: "Accounting audit", it: "Audit contabile" },
  { fr: "Audit financier", en: "Financial audit", it: "Audit finanziario" },
  { fr: "Tenue de comptabilité", en: "Bookkeeping", it: "Tenuta della contabilità" },
  { fr: "Déclaration fiscale", en: "Tax return filing", it: "Dichiarazione dei redditi" },
  { fr: "Expertise juridique", en: "Legal expertise", it: "Perizia legale" },

  // Licences, Abonnements & Produits
  { fr: "Licence logicielle", en: "Software license", it: "Licenza software" },
  { fr: "Licence annuelle", en: "Annual license", it: "Licenza annuale" },
  { fr: "Abonnement mensuel", en: "Monthly subscription", it: "Abbonamento mensile" },
  { fr: "Abonnement annuel", en: "Annual subscription", it: "Abbonamento annuale" },
  { fr: "Matériel informatique", en: "IT equipment", it: "Materiale informatico" },
  { fr: "Vente de matériel", en: "Equipment sale", it: "Vendita di attrezzature" },
  { fr: "Ordinateur portable", en: "Laptop computer", it: "Computer portatile" },
  { fr: "Ordinateur de bureau", en: "Desktop computer", it: "Computer fisso" },
  { fr: "Écran d'ordinateur", en: "Computer monitor", it: "Schermo per computer" },
  { fr: "Imprimante multifonction", en: "Multifunction printer", it: "Stampante multifunzione" },
  { fr: "Fournitures de bureau", en: "Office supplies", it: "Forniture per ufficio" },
  { fr: "Mobilier de bureau", en: "Office furniture", it: "Mobili per ufficio" },
  { fr: "Frais de déplacement", en: "Travel expenses", it: "Spese di trasferta" },
  { fr: "Frais de livraison", en: "Delivery charges", it: "Spese di spedizione" },
  { fr: "Frais de transport", en: "Transportation fees", it: "Spese di trasporto" },
  { fr: "Installation et configuration", en: "Installation and configuration", it: "Installazione e configurazione" },
  { fr: "Mise en service", en: "Commissioning", it: "Messa in servizio" },
];

/**
 * Translates a line item product/service description into English, French, or Italian.
 * First checks known full phrases, then falls back to word and composite pattern replacements.
 */
export function translateItemDescription(
  text: string,
  toLang: AppLanguage
): string {
  if (!text || !text.trim()) return "";
  const trimmed = text.trim();

  // 1. Exact catalog match check (case-insensitive)
  const exactMatch = COMMON_SERVICES_TRANSLATIONS.find((item) => {
    return (
      item.fr.toLowerCase() === trimmed.toLowerCase() ||
      item.en.toLowerCase() === trimmed.toLowerCase() ||
      item.it.toLowerCase() === trimmed.toLowerCase()
    );
  });

  if (exactMatch) {
    return exactMatch[toLang];
  }

  // 2. Partial starts-with or contains catalog match
  const sortedCatalog = [...COMMON_SERVICES_TRANSLATIONS].sort(
    (a, b) => b.fr.length - a.fr.length
  );

  let result = trimmed;

  // If target is English
  if (toLang === "en") {
    for (const item of sortedCatalog) {
      const regFr = new RegExp(`\\b${escapeRegExp(item.fr)}\\b`, "gi");
      const regIt = new RegExp(`\\b${escapeRegExp(item.it)}\\b`, "gi");
      if (regFr.test(result)) result = result.replace(regFr, item.en);
      else if (regIt.test(result)) result = result.replace(regIt, item.en);
    }
    // Component rules FR -> EN
    const rulesEN: [RegExp, string][] = [
      [/Prestation de service/gi, "Service provision"],
      [/Prestation de/gi, "Provision of"],
      [/Prestations de/gi, "Services of"],
      [/Développement de/gi, "Development of"],
      [/Développement/gi, "Development"],
      [/Création de/gi, "Creation of"],
      [/Création/gi, "Creation"],
      [/Conception de/gi, "Design of"],
      [/Conception/gi, "Design"],
      [/Maintenance de/gi, "Maintenance of"],
      [/Maintenance/gi, "Maintenance"],
      [/Formation sur/gi, "Training on"],
      [/Formation en/gi, "Training in"],
      [/Formation/gi, "Training"],
      [/Audit de/gi, "Audit of"],
      [/Audit/gi, "Audit"],
      [/Conseil en/gi, "Consulting in"],
      [/Conseil/gi, "Consulting"],
      [/Assistance/gi, "Assistance"],
      [/Support/gi, "Support"],
      [/Installation de/gi, "Installation of"],
      [/Installation/gi, "Installation"],
      [/Configuration de/gi, "Configuration of"],
      [/Configuration/gi, "Configuration"],
      [/Intégration de/gi, "Integration of"],
      [/Intégration/gi, "Integration"],
      [/Gestion de/gi, "Management of"],
      [/Gestion/gi, "Management"],
      [/Hébergement/gi, "Hosting"],
      [/Abonnement/gi, "Subscription"],
      [/Licence/gi, "License"],
      [/Vente de/gi, "Sale of"],
      [/Fourniture de/gi, "Supply of"],
      [/Frais de/gi, "Fees for"],
      [/\bmensuel(le)?\b/gi, "monthly"],
      [/\bannuel(le)?\b/gi, "annual"],
      [/\bprofessionnel(le)?\b/gi, "professional"],
      [/\binformatique\b/gi, "IT"],
      [/\bmatériel\b/gi, "equipment"],
      [/\bet\b/gi, "and"],
      [/\bpour\b/gi, "for"],
      [/\bavec\b/gi, "with"],
    ];
    for (const [pattern, rep] of rulesEN) {
      result = result.replace(pattern, rep);
    }
    return result;
  }

  // If target is Italian
  if (toLang === "it") {
    for (const item of sortedCatalog) {
      const regFr = new RegExp(`\\b${escapeRegExp(item.fr)}\\b`, "gi");
      const regEn = new RegExp(`\\b${escapeRegExp(item.en)}\\b`, "gi");
      if (regFr.test(result)) result = result.replace(regFr, item.it);
      else if (regEn.test(result)) result = result.replace(regEn, item.it);
    }
    // Component rules FR/EN -> IT
    const rulesIT: [RegExp, string][] = [
      [/Prestation de service/gi, "Prestazione di servizi"],
      [/Prestation de/gi, "Prestazione di"],
      [/Prestations de/gi, "Servizi di"],
      [/Développement de/gi, "Sviluppo di"],
      [/Développement/gi, "Sviluppo"],
      [/Development of/gi, "Sviluppo di"],
      [/Development/gi, "Sviluppo"],
      [/Création de/gi, "Creazione di"],
      [/Création/gi, "Creazione"],
      [/Creation of/gi, "Creazione di"],
      [/Conception de/gi, "Progettazione di"],
      [/Conception/gi, "Progettazione"],
      [/Design of/gi, "Progettazione di"],
      [/Maintenance de/gi, "Manutenzione di"],
      [/Maintenance/gi, "Manutenzione"],
      [/Formation sur/gi, "Formazione su"],
      [/Formation en/gi, "Formazione in"],
      [/Formation/gi, "Formazione"],
      [/Training on/gi, "Formazione su"],
      [/Training/gi, "Formazione"],
      [/Audit de/gi, "Audit di"],
      [/Audit/gi, "Audit"],
      [/Conseil en/gi, "Consulenza in"],
      [/Conseil/gi, "Consulenza"],
      [/Consulting in/gi, "Consulenza in"],
      [/Consulting/gi, "Consulenza"],
      [/Assistance/gi, "Assistenza"],
      [/Support/gi, "Supporto"],
      [/Installation de/gi, "Installazione di"],
      [/Installation/gi, "Installazione"],
      [/Configuration de/gi, "Configurazione di"],
      [/Configuration/gi, "Configurazione"],
      [/Intégration de/gi, "Integrazione di"],
      [/Intégration/gi, "Integrazione"],
      [/Gestion de/gi, "Gestione di"],
      [/Gestion/gi, "Gestione"],
      [/Management/gi, "Gestione"],
      [/Hébergement/gi, "Hosting"],
      [/Abonnement/gi, "Abbonamento"],
      [/Subscription/gi, "Abbonamento"],
      [/Licence/gi, "Licenza"],
      [/License/gi, "Licenza"],
      [/Vente de/gi, "Vendita di"],
      [/Sale of/gi, "Vendita di"],
      [/Fourniture de/gi, "Fornitura di"],
      [/Supply of/gi, "Fornitura di"],
      [/Frais de/gi, "Spese di"],
      [/\bmensuel(le)?\b/gi, "mensile"],
      [/\bmonthly\b/gi, "mensile"],
      [/\bannuel(le)?\b/gi, "annuale"],
      [/\bannual\b/gi, "annuale"],
      [/\bprofessionnel(le)?\b/gi, "professionale"],
      [/\bprofessional\b/gi, "professionale"],
      [/\binformatique\b/gi, "informatica"],
      [/\bmatériel\b/gi, "attrezzature"],
      [/\bequipment\b/gi, "attrezzature"],
      [/\bet\b/gi, "e"],
      [/\band\b/gi, "e"],
      [/\bpour\b/gi, "per"],
      [/\bfor\b/gi, "per"],
      [/\bavec\b/gi, "con"],
      [/\bwith\b/gi, "con"],
    ];
    for (const [pattern, rep] of rulesIT) {
      result = result.replace(pattern, rep);
    }
    return result;
  }

  // If target is French
  if (toLang === "fr") {
    for (const item of sortedCatalog) {
      const regEn = new RegExp(`\\b${escapeRegExp(item.en)}\\b`, "gi");
      const regIt = new RegExp(`\\b${escapeRegExp(item.it)}\\b`, "gi");
      if (regEn.test(result)) result = result.replace(regEn, item.fr);
      else if (regIt.test(result)) result = result.replace(regIt, item.fr);
    }
    // Component rules EN/IT -> FR
    const rulesFR: [RegExp, string][] = [
      [/Service provision/gi, "Prestation de service"],
      [/Prestazione di servizi/gi, "Prestation de service"],
      [/Web development/gi, "Développement web"],
      [/Sviluppo web/gi, "Développement web"],
      [/Software development/gi, "Développement logiciel"],
      [/Sviluppo software/gi, "Développement logiciel"],
      [/Website creation/gi, "Création de site internet"],
      [/Creazione sito web/gi, "Création de site internet"],
      [/Website maintenance/gi, "Maintenance de site internet"],
      [/Manutenzione del sito web/gi, "Maintenance de site internet"],
      [/IT maintenance/gi, "Maintenance informatique"],
      [/Manutenzione informatica/gi, "Maintenance informatique"],
      [/Graphic design/gi, "Design graphique"],
      [/Progettazione grafica/gi, "Design graphique"],
      [/Professional training/gi, "Formation professionnelle"],
      [/Formazione professionale/gi, "Formation professionnelle"],
      [/Project management/gi, "Gestion de projet"],
      [/Gestione del progetto/gi, "Gestion de projet"],
      [/Technical support/gi, "Support technique"],
      [/Supporto tecnico/gi, "Support technique"],
      [/Software license/gi, "Licence logicielle"],
      [/Licenza software/gi, "Licence logicielle"],
      [/Monthly subscription/gi, "Abonnement mensuel"],
      [/Abbonamento mensile/gi, "Abonnement mensuel"],
      [/Annual subscription/gi, "Abonnement annuel"],
      [/Abbonamento annuale/gi, "Abonnement annuel"],
      [/Development of/gi, "Développement de"],
      [/Sviluppo di/gi, "Développement de"],
      [/Development/gi, "Développement"],
      [/Sviluppo/gi, "Développement"],
      [/Creation of/gi, "Création de"],
      [/Creazione di/gi, "Création de"],
      [/Maintenance of/gi, "Maintenance de"],
      [/Manutenzione di/gi, "Maintenance de"],
      [/Maintenance/gi, "Maintenance"],
      [/Manutenzione/gi, "Maintenance"],
      [/Training on/gi, "Formation sur"],
      [/Formazione su/gi, "Formation sur"],
      [/Training/gi, "Formation"],
      [/Formazione/gi, "Formation"],
      [/monthly/gi, "mensuel"],
      [/mensile/gi, "mensuel"],
      [/annual/gi, "annuel"],
      [/annuale/gi, "annuel"],
      [/Sale of/gi, "Vente de"],
      [/Vendita di/gi, "Vente de"],
      [/IT equipment/gi, "matériel informatique"],
      [/Materiale informatico/gi, "matériel informatique"],
      [/Logo creation/gi, "création de logo"],
      [/Creazione del logo/gi, "création de logo"],
      [/\band\b/gi, "et"],
      [/\be\b/gi, "et"],
      [/\bper\b/gi, "pour"],
      [/\bfor\b/gi, "pour"],
      [/\bwith\b/gi, "avec"],
      [/\bcon\b/gi, "avec"],
    ];
    for (const [pattern, rep] of rulesFR) {
      result = result.replace(pattern, rep);
    }
    return result;
  }

  return result;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

import { useState, useEffect } from "react";

/**
 * Translations for Platform Interface (Sidebar, Menus, Common Actions, Dashboard, Invoices, Clients)
 */
export interface PlatformUITranslations {
  nav: {
    dashboard: string;
    invoices: string;
    clients: string;
    leads: string;
    settings: string;
    help: string;
    newInvoice: string;
    logout: string;
  };
  header: {
    searchPlaceholder: string;
    exportButton: string;
    newInvoiceButton: string;
    notifications: string;
    markAllRead: string;
    profile: string;
  };
  common: {
    cancel: string;
    save: string;
    confirm: string;
    delete: string;
    edit: string;
    view: string;
    copy: string;
    copied: string;
    downloadPDF: string;
    sendWhatsApp: string;
    currency: string;
    language: string;
    actions: string;
    status: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    billedAmount: string;
    collectedAmount: string;
    pendingAmount: string;
    overdueAmount: string;
    recentInvoicesTitle: string;
    topClientsTitle: string;
    billingRevenueTitle: string;
    billedLabel: string;
    collectedLabel: string;
    pendingLabel: string;
  };
  invoices: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterPaid: string;
    filterSent: string;
    filterOverdue: string;
    filterDraft: string;
    newInvoice: string;
    searchPlaceholder: string;
    number: string;
    client: string;
    issueDate: string;
    dueDate: string;
    amount: string;
    status: string;
    actions: string;
  };
  clients: {
    title: string;
    subtitle: string;
    newClient: string;
    searchPlaceholder: string;
    companyAndName: string;
    contact: string;
    acquisitionDate: string;
    totalBilled: string;
    balanceDue: string;
    status: string;
    actions: string;
  };
  leads: {
    title: string;
    subtitle: string;
    searchTab: string;
    leadsTab: string;
    historyTab: string;
    queryLabel: string;
    queryPlaceholder: string;
    senderSectorLabel: string;
    senderSectorPlaceholder: string;
    cityLabel: string;
    cityPlaceholder: string;
    maxResultsLabel: string;
    pitchLabel: string;
    pitchPlaceholder: string;
    searchButton: string;
    searching: string;
    filterAll: string;
    filterNew: string;
    filterContacted: string;
    filterReplied: string;
    filterConverted: string;
    filterIgnored: string;
    statsTotal: string;
    statsWithPhone: string;
    statsWithoutWebsite: string;
    statsConverted: string;
    generateMessage: string;
    batchGenerate: string;
    exportCSV: string;
    convertToClient: string;
    openWhatsApp: string;
    ignore: string;
    delete: string;
  };
  settings: {
    title: string;
    subtitle: string;
    tabGeneral: string;
    tabBilling: string;
    tabPayments: string;
    tabLanguage: string;
    tabWhatsApp: string;
    tabNotifications: string;
    save: string;
    reset: string;
  };
}

export const PLATFORM_TRANSLATIONS: Record<AppLanguage, PlatformUITranslations> = {
  fr: {
    nav: {
      dashboard: "Tableau de bord",
      invoices: "Factures",
      clients: "Clients",
      leads: "Devada Leads",
      settings: "Paramètres",
      help: "Aide & Support",
      newInvoice: "Nouvelle facture",
      logout: "Déconnexion",
    },
    header: {
      searchPlaceholder: "Rechercher numéro, client, montant...",
      exportButton: "Exporter Excel",
      newInvoiceButton: "Nouvelle facture",
      notifications: "Notifications",
      markAllRead: "Tout marquer comme lu",
      profile: "Mon profil",
    },
    common: {
      cancel: "Annuler",
      save: "Enregistrer",
      confirm: "Confirmer",
      delete: "Supprimer",
      edit: "Modifier",
      view: "Consulter",
      copy: "Copier",
      copied: "Copié !",
      downloadPDF: "Télécharger PDF",
      sendWhatsApp: "Envoyer par WhatsApp",
      currency: "Devise",
      language: "Langue",
      actions: "Actions",
      status: "Statut",
    },
    dashboard: {
      title: "Tableau de bord financier",
      subtitle: "Supervisez vos encaissements, factures émises et trésorerie en temps réel",
      billedAmount: "Montant facturé",
      collectedAmount: "Montant encaissé",
      pendingAmount: "En attente d'encaissement",
      overdueAmount: "Factures émises / En retard",
      recentInvoicesTitle: "Dernières factures",
      topClientsTitle: "Top Clients",
      billingRevenueTitle: "Facturation & Encaissements",
      billedLabel: "Facturé",
      collectedLabel: "Encaissé",
      pendingLabel: "Solde",
    },
    invoices: {
      title: "Factures & Règlements",
      subtitle: "Gérez votre carnet de facturation, suivez les encaissements et relances",
      filterAll: "Toutes les factures",
      filterPaid: "Payées",
      filterSent: "Envoyées",
      filterOverdue: "En retard",
      filterDraft: "Brouillons",
      newInvoice: "Créer une facture",
      searchPlaceholder: "Rechercher par numéro, client, montant...",
      number: "N° Facture",
      client: "Client & Contact",
      issueDate: "Émission",
      dueDate: "Échéance",
      amount: "Montant TTC",
      status: "Statut",
      actions: "Actions",
    },
    clients: {
      title: "Répertoire des Clients",
      subtitle: "Gestion de votre portefeuille clients professionnels et suivi des soldes dus",
      newClient: "Ajouter un client",
      searchPlaceholder: "Rechercher un client par raison sociale, NINEA, email...",
      companyAndName: "Raison Sociale & NINEA",
      contact: "Coordonnées",
      acquisitionDate: "Date d'acquisition",
      totalBilled: "Total facturé",
      balanceDue: "Solde dû",
      status: "Statut",
      actions: "Actions",
    },
    leads: {
      title: "Devada Leads — Prospection B2B",
      subtitle: "Trouvez des prospects qualifiés au Sénégal et générez des messages d'approche personnalisés par IA",
      searchTab: "Rechercher des prospects",
      leadsTab: "Liste des prospects",
      historyTab: "Historique des recherches",
      queryLabel: "Activité ou mots-clés recherchés",
      queryPlaceholder: "Ex: restaurants, agences de voyage, pharmacies...",
      senderSectorLabel: "Votre secteur d'activité",
      senderSectorPlaceholder: "Ex: Agence web & marketing digital",
      cityLabel: "Ville ciblée",
      cityPlaceholder: "Dakar, Thiès, Saint-Louis...",
      maxResultsLabel: "Nombre de résultats",
      pitchLabel: "Votre proposition de valeur (pitch)",
      pitchPlaceholder: "Ex: Nous créons des sites vitrines modernes et optimisés pour le référencement local",
      searchButton: "Trouver des prospects",
      searching: "Recherche en cours sur Google Maps...",
      filterAll: "Tous",
      filterNew: "Nouveaux",
      filterContacted: "Contactés",
      filterReplied: "Ont répondu",
      filterConverted: "Convertis",
      filterIgnored: "Ignorés",
      statsTotal: "Total prospects",
      statsWithPhone: "Avec téléphone",
      statsWithoutWebsite: "Sans site web",
      statsConverted: "Clients convertis",
      generateMessage: "Générer un message IA",
      batchGenerate: "Générer les messages",
      exportCSV: "Exporter en CSV",
      convertToClient: "Convertir en client",
      openWhatsApp: "Ouvrir dans WhatsApp",
      ignore: "Ignorer le prospect",
      delete: "Supprimer",
    },
    settings: {
      title: "Paramètres de l'entreprise",
      subtitle: "Configurez vos mentions légales, fiscalité, coordonnées et langues",
      tabGeneral: "Entreprise & Légal",
      tabBilling: "Facturation & TVA",
      tabPayments: "Moyens de paiement",
      tabLanguage: "Langue & Région",
      tabWhatsApp: "Messages WhatsApp",
      tabNotifications: "Notifications & Équipe",
      save: "Enregistrer les modifications",
      reset: "Réinitialiser",
    },
  },
  en: {
    nav: {
      dashboard: "Dashboard",
      invoices: "Invoices",
      clients: "Clients",
      leads: "Devada Leads",
      settings: "Settings",
      help: "Help & Support",
      newInvoice: "New Invoice",
      logout: "Sign Out",
    },
    header: {
      searchPlaceholder: "Search invoice number, client, amount...",
      exportButton: "Export Excel",
      newInvoiceButton: "New Invoice",
      notifications: "Notifications",
      markAllRead: "Mark all as read",
      profile: "My Profile",
    },
    common: {
      cancel: "Cancel",
      save: "Save",
      confirm: "Confirm",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      copy: "Copy",
      copied: "Copied!",
      downloadPDF: "Download PDF",
      sendWhatsApp: "Send via WhatsApp",
      currency: "Currency",
      language: "Language",
      actions: "Actions",
      status: "Status",
    },
    dashboard: {
      title: "Financial Dashboard",
      subtitle: "Monitor cash collections, issued invoices, and liquidity in real time",
      billedAmount: "Total Invoiced",
      collectedAmount: "Amount Collected",
      pendingAmount: "Pending Collection",
      overdueAmount: "Invoices / Overdue",
      recentInvoicesTitle: "Recent Invoices",
      topClientsTitle: "Top Clients",
      billingRevenueTitle: "Invoicing & Collections",
      billedLabel: "Billed",
      collectedLabel: "Collected",
      pendingLabel: "Balance",
    },
    invoices: {
      title: "Invoices & Payments",
      subtitle: "Manage billing ledger, track incoming payments, and overdue accounts",
      filterAll: "All Invoices",
      filterPaid: "Paid",
      filterSent: "Sent",
      filterOverdue: "Overdue",
      filterDraft: "Drafts",
      newInvoice: "Create Invoice",
      searchPlaceholder: "Search by number, client, amount...",
      number: "Invoice No.",
      client: "Client & Contact",
      issueDate: "Issue Date",
      dueDate: "Due Date",
      amount: "Total (TTC)",
      status: "Status",
      actions: "Actions",
    },
    clients: {
      title: "Client Directory",
      subtitle: "Manage business client accounts and track outstanding receivables",
      newClient: "Add Client",
      searchPlaceholder: "Search client by company name, Tax ID, email...",
      companyAndName: "Company & Tax ID",
      contact: "Contact Details",
      acquisitionDate: "Acquisition Date",
      totalBilled: "Total Billed",
      balanceDue: "Balance Due",
      status: "Status",
      actions: "Actions",
    },
    leads: {
      title: "Devada Leads — B2B Prospecting",
      subtitle: "Find qualified business prospects in Senegal and generate personalized AI sales messages",
      searchTab: "Find Prospects",
      leadsTab: "Prospects List",
      historyTab: "Search History",
      queryLabel: "Business type or keywords",
      queryPlaceholder: "e.g. restaurants, travel agencies, pharmacies...",
      senderSectorLabel: "Your business sector",
      senderSectorPlaceholder: "e.g. Web agency & digital marketing",
      cityLabel: "Target City",
      cityPlaceholder: "Dakar, Thiès, Saint-Louis...",
      maxResultsLabel: "Max Results",
      pitchLabel: "Your value proposition (pitch)",
      pitchPlaceholder: "e.g. We design modern websites optimized for local SEO",
      searchButton: "Find Prospects",
      searching: "Searching on Google Maps...",
      filterAll: "All",
      filterNew: "New",
      filterContacted: "Contacted",
      filterReplied: "Replied",
      filterConverted: "Converted",
      filterIgnored: "Ignored",
      statsTotal: "Total Prospects",
      statsWithPhone: "With Phone",
      statsWithoutWebsite: "No Website",
      statsConverted: "Converted Clients",
      generateMessage: "Generate AI Message",
      batchGenerate: "Generate Messages",
      exportCSV: "Export CSV",
      convertToClient: "Convert to Client",
      openWhatsApp: "Open in WhatsApp",
      ignore: "Ignore Prospect",
      delete: "Delete",
    },
    settings: {
      title: "Company Settings",
      subtitle: "Configure legal records, tax ID, payment details, and languages",
      tabGeneral: "Company & Legal",
      tabBilling: "Billing & VAT",
      tabPayments: "Payment Methods",
      tabLanguage: "Language & Region",
      tabWhatsApp: "WhatsApp Messages",
      tabNotifications: "Notifications & Team",
      save: "Save Changes",
      reset: "Reset Defaults",
    },
  },
  it: {
    nav: {
      dashboard: "Dashboard",
      invoices: "Fatture",
      clients: "Clienti",
      leads: "Devada Leads",
      settings: "Impostazioni",
      help: "Aiuto & Supporto",
      newInvoice: "Nuova Fattura",
      logout: "Disconnetti",
    },
    header: {
      searchPlaceholder: "Cerca fattura, cliente, importo...",
      exportButton: "Esporta Excel",
      newInvoiceButton: "Nuova Fattura",
      notifications: "Notifiche",
      markAllRead: "Segna tutte come lette",
      profile: "Il mio profilo",
    },
    common: {
      cancel: "Annulla",
      save: "Salva",
      confirm: "Conferma",
      delete: "Elimina",
      edit: "Modifica",
      view: "Visualizza",
      copy: "Copia",
      copied: "Copiato!",
      downloadPDF: "Scarica PDF",
      sendWhatsApp: "Invia tramite WhatsApp",
      currency: "Valuta",
      language: "Lingua",
      actions: "Azioni",
      status: "Stato",
    },
    dashboard: {
      title: "Dashboard Finanziario",
      subtitle: "Monitora incassi, fatture emesse e liquidità in tempo reale",
      billedAmount: "Importo Fatturato",
      collectedAmount: "Importo Incassato",
      pendingAmount: "In Attesa di Incasso",
      overdueAmount: "Fatture / In Ritardo",
      recentInvoicesTitle: "Fatture Recenti",
      topClientsTitle: "Migliori Clienti",
      billingRevenueTitle: "Fatturazione & Incassi",
      billedLabel: "Fatturato",
      collectedLabel: "Incassato",
      pendingLabel: "Saldo",
    },
    invoices: {
      title: "Fatture & Pagamenti",
      subtitle: "Gestisci il registro fatture, controlla gli incassi e i solleciti",
      filterAll: "Tutte le Fatture",
      filterPaid: "Pagate",
      filterSent: "Inviate",
      filterOverdue: "In Ritardo",
      filterDraft: "Bozze",
      newInvoice: "Crea Fattura",
      searchPlaceholder: "Cerca per numero, cliente, importo...",
      number: "N. Fattura",
      client: "Cliente & Contatti",
      issueDate: "Emissione",
      dueDate: "Scadenza",
      amount: "Totale Fattura",
      status: "Stato",
      actions: "Actions",
    },
    clients: {
      title: "Registro Clienti",
      subtitle: "Gestione del portafoglio clienti aziendali e monitoraggio dei saldi",
      newClient: "Aggiungi Cliente",
      searchPlaceholder: "Cerca cliente per ragione sociale, codice fiscale, email...",
      companyAndName: "Ragione Sociale & NINEA",
      contact: "Contatti",
      acquisitionDate: "Data Acquisizione",
      totalBilled: "Totale Fatturato",
      balanceDue: "Saldo Dovuto",
      status: "Stato",
      actions: "Azioni",
    },
    leads: {
      title: "Devada Leads — Ricerca Clienti B2B",
      subtitle: "Trova potenziali clienti qualificati in Senegal e genera messaggi commerciali personalizzati con l'IA",
      searchTab: "Cerca Clienti",
      leadsTab: "Elenco Contatti",
      historyTab: "Cronologia Ricerche",
      queryLabel: "Attività o parole chiave",
      queryPlaceholder: "Es: ristoranti, agenzie di viaggio, farmacie...",
      senderSectorLabel: "Il tuo settore di attività",
      senderSectorPlaceholder: "Es: Web agency & marketing digitale",
      cityLabel: "Città di destinazione",
      cityPlaceholder: "Dakar, Thiès, Saint-Louis...",
      maxResultsLabel: "Numero massimo di risultati",
      pitchLabel: "La tua proposta di valore (pitch)",
      pitchPlaceholder: "Es: Realizziamo siti web moderni e ottimizzati per la visibilità locale",
      searchButton: "Trova Contatti",
      searching: "Ricerca in corso su Google Maps...",
      filterAll: "Tutti",
      filterNew: "Nuovi",
      filterContacted: "Contattati",
      filterReplied: "Hanno risposto",
      filterConverted: "Convertiti",
      filterIgnored: "Ignorati",
      statsTotal: "Totale Contatti",
      statsWithPhone: "Con Telefono",
      statsWithoutWebsite: "Senza Sito Web",
      statsConverted: "Clienti Convertiti",
      generateMessage: "Genera Messaggio IA",
      batchGenerate: "Genera Messaggi",
      exportCSV: "Esporta in CSV",
      convertToClient: "Converti in Cliente",
      openWhatsApp: "Apri su WhatsApp",
      ignore: "Ignora Contatto",
      delete: "Elimina",
    },
    settings: {
      title: "Impostazioni Aziendali",
      subtitle: "Configura dati legali, fiscalità, coordinate e lingue",
      tabGeneral: "Azienda & Dati Legali",
      tabBilling: "Fatturazione & IVA",
      tabPayments: "Metodi di Pagamento",
      tabLanguage: "Lingua & Regione",
      tabWhatsApp: "Messaggi WhatsApp",
      tabNotifications: "Notifiche & Team",
      save: "Salva Modifiche",
      reset: "Ripristina",
    },
  },
};

export function getPlatformTranslations(lang?: string): PlatformUITranslations {
  if (lang === "en" || lang === "it" || lang === "fr") {
    return PLATFORM_TRANSLATIONS[lang];
  }
  return PLATFORM_TRANSLATIONS.fr;
}

/**
 * Universal React Hook for reactive platform language and translations
 */
export function usePlatformLanguage() {
  const [lang, setLang] = useState<AppLanguage>("fr");

  useEffect(() => {
    setLang(getStoredLanguage());
    const handleUpdate = () => {
      setLang(getStoredLanguage());
    };
    window.addEventListener("language_updated", handleUpdate);
    window.addEventListener("settings_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("language_updated", handleUpdate);
      window.removeEventListener("settings_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const t = getPlatformTranslations(lang);
  return { lang, t };
}
