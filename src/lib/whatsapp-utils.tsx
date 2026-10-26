"use client";
import React, { useState, useEffect } from "react";
import {
  Invoice,
  CompanySettings,
  CURRENT_USER,
  getStoredClients,
  getStoredSettings,
  DEFAULT_WHATSAPP_TEMPLATE_FR,
  DEFAULT_WHATSAPP_TEMPLATE_EN,
  DEFAULT_WHATSAPP_TEMPLATE_IT,
} from "@/lib/mock-data";
import { formatFCFA, formatDate, formatCurrency, cn, sanitizeWhatsAppNumber, generateWhatsAppLink } from "@/lib/utils";
import { generateInvoicePDFBlob, generateAndDownloadInvoicePDF } from "@/lib/pdf-generator";
import { getInvoiceTranslations, AppLanguage, SUPPORTED_LANGUAGES } from "@/lib/i18n";
import { X, Send, Copy, Check, Sparkles, FileText, Globe } from "lucide-react";

export { sanitizeWhatsAppNumber, generateWhatsAppLink };


/**
 * Find the client's best WhatsApp number by matching the client in stored clients or falling back to invoice phone
 */
export function getInvoiceClientWhatsApp(invoice: Invoice): string | null {
  try {
    const clients = getStoredClients();
    const found = clients.find(
      (c) =>
        c.name.toLowerCase().trim() === invoice.clientName.toLowerCase().trim() ||
        (invoice.clientNinea && c.ninea && c.ninea === invoice.clientNinea)
    );

    if (found?.whatsapp) {
      const sanitized = sanitizeWhatsAppNumber(found.whatsapp);
      if (sanitized) return sanitized;
    }

    if (found?.phone) {
      const sanitized = sanitizeWhatsAppNumber(found.phone);
      if (sanitized) return sanitized;
    }
  } catch {
    // fallback to invoice.clientPhone
  }

  if (invoice.clientPhone) {
    return sanitizeWhatsAppNumber(invoice.clientPhone);
  }

  return null;
}

export interface ClientWhatsAppInfo {
  hasWhatsApp: boolean;
  phone: string | null;
  name: string;
}

/**
 * Convenience helper returning status and client info for WhatsApp button rendering
 */
export function getInvoiceWhatsAppInfo(invoice: Invoice): ClientWhatsAppInfo {
  const phone = getInvoiceClientWhatsApp(invoice);
  return {
    hasWhatsApp: Boolean(phone),
    phone,
    name: invoice.clientName,
  };
}

/**
 * Build a customized WhatsApp invoice message based on company settings and language
 * with dynamic replacement of template tags:
 * {client_name}, {invoice_number}, {amount}, {due_date}, {issue_date}, {status}, {company_name}
 */
export function buildWhatsAppInvoiceMessage(
  invoice: Invoice,
  targetLang?: AppLanguage,
  customTemplate?: string,
  settings?: CompanySettings
): string {
  const activeSettings = settings || getStoredSettings();
  const lang: AppLanguage =
    targetLang ||
    invoice.language ||
    activeSettings.whatsappDefaultLanguage ||
    activeSettings.defaultLanguage ||
    "fr";

  const t = getInvoiceTranslations(lang);
  const cur = invoice.currency || "FCFA";
  const formattedAmt =
    cur === "FCFA" ? formatFCFA(invoice.amountTTC) : formatCurrency(invoice.amountTTC, cur);
  const statusLabel = t.status[invoice.status] || invoice.status;

  // Retrieve template skeleton
  let skeleton = customTemplate;
  if (!skeleton) {
    if (lang === "en") {
      skeleton = activeSettings.whatsappTemplateEn || DEFAULT_WHATSAPP_TEMPLATE_EN;
    } else if (lang === "it") {
      skeleton = activeSettings.whatsappTemplateIt || DEFAULT_WHATSAPP_TEMPLATE_IT;
    } else {
      skeleton = activeSettings.whatsappTemplateFr || DEFAULT_WHATSAPP_TEMPLATE_FR;
    }
  }

  const companyName = activeSettings.companyName || "Mon Entreprise";

  return skeleton
    .replace(/{client_name}/g, invoice.clientName || "Cher Client")
    .replace(/{invoice_number}/g, invoice.invoiceNumber)
    .replace(/{amount}/g, formattedAmt)
    .replace(/{issue_date}/g, formatDate(invoice.issueDate))
    .replace(/{due_date}/g, formatDate(invoice.dueDate))
    .replace(/{status}/g, statusLabel)
    .replace(/{company_name}/g, companyName);
}

/**
 * Generate a pre-formatted, polite WhatsApp invoice sharing URL
 */
export function generateInvoiceWhatsAppUrl(
  invoice: Invoice,
  targetLang?: AppLanguage,
  customMessage?: string
): string | null {
  const phone = getInvoiceClientWhatsApp(invoice);
  if (!phone) return null;

  const message = customMessage || buildWhatsAppInvoiceMessage(invoice, targetLang);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Send an invoice via WhatsApp with native selectable PDF attached
 * (using Web Share API or auto-downloading and opening WhatsApp)
 */
export async function sendInvoiceViaWhatsApp(
  invoice: Invoice,
  settings?: CompanySettings,
  onNotify?: (msg: string) => void,
  customMessage?: string,
  targetLang?: AppLanguage
): Promise<void> {
  const activeSettings = settings || getStoredSettings();
  const phone = getInvoiceClientWhatsApp(invoice);
  const lang: AppLanguage = targetLang || invoice.language || activeSettings.defaultLanguage || "fr";
  const t = getInvoiceTranslations(lang);

  if (!phone) {
    onNotify?.("Aucun numéro de téléphone ou WhatsApp renseigné pour ce client.");
    return;
  }

  const messageText =
    customMessage || buildWhatsAppInvoiceMessage(invoice, lang, undefined, activeSettings);
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`;

  // 1. Try Native Web Share API with attached PDF file and description
  try {
    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare) {
      onNotify?.("Préparation du document PDF pour WhatsApp...");
      const pdfBlob = await generateInvoicePDFBlob(invoice, activeSettings);
      const pdfFile = new File([pdfBlob], `Facture_${invoice.invoiceNumber}.pdf`, {
        type: "application/pdf",
      });

      if (navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          title: `${t.documentTitle} ${invoice.invoiceNumber}`,
          text: messageText,
          files: [pdfFile],
        });
        onNotify?.(`Facture ${invoice.invoiceNumber} et PDF transmis par WhatsApp !`);
        return;
      }
    }
  } catch (err: any) {
    if (err?.name === "AbortError") return;
    console.warn("Native file share fallback:", err);
  }

  // 2. Fallback: Automatically download the PDF document locally & open WhatsApp conversation
  onNotify?.(`Téléchargement de la facture ${invoice.invoiceNumber} en pièce jointe...`);
  try {
    await generateAndDownloadInvoicePDF(invoice, activeSettings);
  } catch (e) {
    console.warn("Could not auto-download PDF:", e);
  }

  // Open WhatsApp Web with pre-formatted message
  if (waUrl) {
    window.open(waUrl, "_blank");
  }

  onNotify?.(
    `Facture PDF téléchargée ! Glissez-la simplement en pièce jointe dans la discussion WhatsApp.`
  );
}

/**
 * Official crisp WhatsApp icon SVG
 */
export function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/**
 * Interactive WhatsApp Share Modal:
 * Allows user to:
 * 1. Choose the language of the WhatsApp description (FR 🇫🇷, EN 🇬🇧, IT 🇮🇹)
 * 2. Preview and edit the exact message generated from settings templates
 * 3. Send with native vector PDF attached or copy text
 */
export interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  settings?: CompanySettings;
  onNotify?: (msg: string) => void;
}

export function WhatsAppShareModal({
  isOpen,
  onClose,
  invoice,
  settings,
  onNotify,
}: WhatsAppModalProps) {
  const activeSettings = settings || getStoredSettings();
  const [selectedLang, setSelectedLang] = useState<AppLanguage>(() => {
    return (
      invoice.language ||
      activeSettings.whatsappDefaultLanguage ||
      activeSettings.defaultLanguage ||
      "fr"
    );
  });
  const [message, setMessage] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const initialLang: AppLanguage =
        invoice.language ||
        activeSettings.whatsappDefaultLanguage ||
        activeSettings.defaultLanguage ||
        "fr";
      setSelectedLang(initialLang);
      const generated = buildWhatsAppInvoiceMessage(invoice, initialLang, undefined, activeSettings);
      setMessage(generated);
    }
  }, [isOpen, invoice]);

  const handleLangChange = (lang: AppLanguage) => {
    setSelectedLang(lang);
    const updated = buildWhatsAppInvoiceMessage(invoice, lang, undefined, activeSettings);
    setMessage(updated);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      await sendInvoiceViaWhatsApp(
        invoice,
        activeSettings,
        onNotify,
        message,
        selectedLang
      );
      onClose();
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const phone = getInvoiceClientWhatsApp(invoice);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
              <WhatsAppIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Partage WhatsApp</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
                  {invoice.invoiceNumber}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Destinataire : <strong className="text-slate-700 dark:text-slate-300">{invoice.clientName}</strong>
                {phone ? ` (${phone})` : " (Numéro non renseigné)"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Language Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Langue du message WhatsApp :</span>
              </label>
              <span className="text-[10px] text-slate-400">
                Modèle défini dans les Paramètres
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isActive = selectedLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLangChange(lang.code)}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold border transition-all text-xs",
                      isActive
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editable message description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Texte du message :
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copié !" : "Copier le texte"}</span>
              </button>
            </div>
            <textarea
              rows={7}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none leading-relaxed"
            />
          </div>

          {/* PDF Attachment Notice */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-start gap-2.5 text-emerald-800 dark:text-emerald-300">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div className="text-[11px] leading-relaxed">
              <strong>Fichier PDF inclus automatiquement :</strong> La facture officielle en format vectoriel ultra-léger (&lt; 25 Ko) avec texte sélectionnable sera transmise en pièce jointe.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>{isSending ? "Préparation..." : "Envoyer sur WhatsApp"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
