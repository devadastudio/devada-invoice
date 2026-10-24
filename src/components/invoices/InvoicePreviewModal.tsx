"use client";

import React from "react";
import {
  X,
  Printer,
  Download,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Mail,
  Phone,
  FileText,
  Share2,
} from "lucide-react";
import {
  Invoice,
  CURRENT_USER,
  getStoredSettings,
  CompanySettings,
  DEFAULT_SETTINGS,
} from "@/lib/mock-data";
import { formatFCFA, formatDate, formatCurrency, SupportedCurrency, cn } from "@/lib/utils";

interface InvoicePreviewModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export function InvoicePreviewModal({ invoice, onClose }: InvoicePreviewModalProps) {
  const [settings, setSettings] = React.useState<CompanySettings>(DEFAULT_SETTINGS);

  React.useEffect(() => {
    setSettings(getStoredSettings());
  }, []);

  if (!invoice) return null;

  const invoiceCurrency = (invoice.currency || "FCFA") as SupportedCurrency;
  const formatInvoiceAmt = (val: number) => {
    if (invoiceCurrency === "FCFA") return formatFCFA(val);
    return formatCurrency(val, invoiceCurrency);
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Payée
          </span>
        );
      case "sent":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            Envoyée
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            En retard
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Brouillon
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/80 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Aperçu de la facture
            </h3>
            {getStatusBadge(invoice.status)}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Imprimer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => alert(`Téléchargement du PDF pour ${invoice.invoiceNumber}`)}
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Télécharger PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors ml-1"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content: Styled Invoice Document */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 text-slate-800 dark:text-slate-200">
          {/* Invoice Document Card */}
          <div className="bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-8">
            {/* Header: Brand & Invoice Meta */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src="/images/devada-logo.png"
                    alt="Devada Invoice"
                    className="w-9 h-9 object-contain rounded-xl shadow-sm"
                  />
                  <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    devada<span className="text-emerald-600">invoice</span>
                  </span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase mt-4">
                  FACTURE
                </h2>
                <p className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                  N° {invoice.invoiceNumber}
                </p>
              </div>

              <div className="text-right sm:text-right space-y-1 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Date d&apos;émission : </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatDate(invoice.issueDate)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Date d&apos;échéance : </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatDate(invoice.dueDate)}
                  </span>
                </div>
                {invoice.paymentMethod && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Règlement : </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {invoice.paymentMethod}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Issuer & Client Info Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Émetteur :
                </span>
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  Dakar Digital Agency SARL
                </p>
                <p className="text-slate-600 dark:text-slate-400">Immeuble Kébé, Avenue Jean Jaurès</p>
                <p className="text-slate-600 dark:text-slate-400">Dakar - Plateau, Sénégal</p>
                <p className="text-slate-500">NINEA : 006458921 2R8 • RCCM : SN-DKR-2022-B-1425</p>
                <p className="text-slate-500">contact@dakardigital.sn • +221 33 821 00 11</p>
              </div>

              <div className="space-y-1 text-xs bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Facturé à :
                </span>
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  {invoice.clientName}
                </p>
                <p className="text-slate-600 dark:text-slate-400">{invoice.clientCity}</p>
                <p className="text-slate-600 dark:text-slate-400">{invoice.clientEmail}</p>
                <p className="text-slate-600 dark:text-slate-400">{invoice.clientPhone}</p>
                {invoice.clientNinea && (
                  <p className="text-slate-500">NINEA : {invoice.clientNinea}</p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="pt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 font-semibold">Désignation</th>
                    <th className="py-2.5 font-semibold text-center">Qté</th>
                    <th className="py-2.5 font-semibold text-right">Prix Unitaire HT</th>
                    <th className="py-2.5 font-semibold text-center">TVA</th>
                    <th className="py-2.5 font-semibold text-right">Montant HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="text-slate-800 dark:text-slate-200">
                      <td className="py-3 font-medium">{item.description}</td>
                      <td className="py-3 text-center text-slate-500">{item.quantity}</td>
                      <td className="py-3 text-right font-mono text-slate-600 dark:text-slate-400">
                        {formatInvoiceAmt(item.unitPrice)}
                      </td>
                      <td className="py-3 text-center font-medium text-slate-600 dark:text-slate-400">
                        {item.taxRate}%
                      </td>
                      <td className="py-3 text-right font-mono font-semibold">
                        {formatInvoiceAmt(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <div className="w-full sm:w-72 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Sous-total HT :</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {formatInvoiceAmt(invoice.amountHT)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>TVA (18%) :</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {formatInvoiceAmt(invoice.taxAmount)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
                  <span>Total TTC :</span>
                  <span className="text-base text-blue-600 dark:text-blue-400 font-mono">
                    {formatInvoiceAmt(invoice.amountTTC)}
                  </span>
                </div>
                {invoice.amountPaid > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                    <span>Montant réglé :</span>
                    <span className="font-mono">-{formatInvoiceAmt(invoice.amountPaid)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-semibold pt-1 border-t border-dashed border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Solde restant dû :</span>
                  <span className="font-mono text-slate-900 dark:text-white">
                    {formatInvoiceAmt(invoice.balanceDue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes & Payment Details */}
            {invoice.notes && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Conditions & Notes :
                </p>
                <p className="italic">{invoice.notes}</p>
                {invoice.showExchangeRate && invoice.currency && invoice.currency !== "FCFA" && invoice.appliedRate && (
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1.5">
                    Taux de change officiel appliqué : 1 {invoice.currency} = {invoice.appliedRate.toLocaleString("fr-FR")} FCFA
                  </p>
                )}
              </div>
            )}

            {/* Pied de page institutionnel de l'entreprise */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 text-center space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <p className="font-medium text-slate-700 dark:text-slate-300">
                {[settings.companyName || CURRENT_USER.company, `(${settings.legalForm || "SARL"})`].filter(Boolean).join(" ")}
                {" • "}
                <span>NINEA : <strong className="font-mono text-slate-700 dark:text-slate-300">{settings.ninea || CURRENT_USER.ninea}</strong></span>
                {" • "}
                <span>RCCM : <strong className="font-mono text-slate-700 dark:text-slate-300">{settings.rccm || CURRENT_USER.rccm}</strong></span>
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {[settings.address || CURRENT_USER.address, settings.city || CURRENT_USER.city, "Sénégal"].filter(Boolean).join(", ")}
                {" • "}Tél : {settings.phone || CURRENT_USER.phone}
                {" • "}Email : {settings.email || CURRENT_USER.email}
                {settings.website ? ` • ${settings.website}` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <span className="text-xs text-slate-400">
            Émise conformément à la législation fiscale sénégalaise (DGID)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={() => alert(`Facture ${invoice.invoiceNumber} envoyée par email au client !`)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] rounded-xl shadow-sm shadow-blue-500/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Envoyer au client</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
