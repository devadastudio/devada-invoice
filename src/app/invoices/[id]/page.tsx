"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import {
  Invoice,
  InvoiceStatus,
  CURRENT_USER,
  MOCK_INVOICES,
  getStoredInvoices,
  saveStoredInvoices,
  getStoredSettings,
  CompanySettings,
  DEFAULT_SETTINGS,
} from "@/lib/mock-data";
import { useAuth } from "@/lib/supabase/auth-context";
import {
  fetchInvoiceById,
  fetchCompanySettings,
  updateInvoiceStatus,
  deleteInvoice,
} from "@/lib/supabase/db";
import { formatFCFA, formatDate, formatCurrency, SupportedCurrency, cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { generateAndDownloadInvoicePDF, printInvoicePDF } from "@/lib/pdf-generator";
import {
  sendInvoiceViaWhatsApp,
  WhatsAppIcon,
  getInvoiceWhatsAppInfo,
  WhatsAppShareModal,
} from "@/lib/whatsapp-utils";
import { getInvoiceTranslations, SUPPORTED_LANGUAGES } from "@/lib/i18n";
import {
  ArrowLeft,
  Printer,
  Download,
  Send,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CreditCard,
  Building2,
  Calendar,
  Share2,
  FileText,
  Mail,
  Phone,
  Check,
  ChevronDown,
} from "lucide-react";

export default function InvoiceDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const invoiceId = params?.id as string;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(() => {
    return MOCK_INVOICES.find((inv) => inv.id === invoiceId) || MOCK_INVOICES[0];
  });
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  useEffect(() => {
    const loadInvoiceDetail = async () => {
      if (user?.id && invoiceId) {
        try {
          const [dbInvoice, dbSettings] = await Promise.all([
            fetchInvoiceById(invoiceId, user.id),
            fetchCompanySettings(user.id),
          ]);
          if (dbInvoice) {
            setInvoice(dbInvoice);
          }
          if (dbSettings) {
            setSettings(dbSettings);
          }
          if (dbInvoice) return;
        } catch (err) {
          console.error("Erreur chargement facture Supabase:", err);
        }
      }

      setSettings(getStoredSettings());
      const list = getStoredInvoices();
      const found = list.find((inv) => inv.id === invoiceId) || list[0];
      if (found) {
        setInvoice(found);
      }
    };

    loadInvoiceDetail();
  }, [invoiceId, user?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-slate-500 text-sm">Chargement de la facture...</p>
          <Link href="/invoices" className="text-xs text-blue-600 font-semibold underline">
            Retour aux factures
          </Link>
        </div>
      </div>
    );
  }

  const invoiceCurrency = (invoice.currency || "FCFA") as SupportedCurrency;
  const formatInvoiceAmt = (val: number) => {
    if (invoiceCurrency === "FCFA") return formatFCFA(val);
    return formatCurrency(val, invoiceCurrency);
  };

  // Status Change Handler
  const handleChangeStatus = async (newStatus: InvoiceStatus) => {
    if (user?.id) {
      await updateInvoiceStatus(invoice.id, newStatus, invoice.amountTTC, user.id);
    }

    const list = getStoredInvoices();
    const updated = list.map((inv) =>
      inv.id === invoice.id
        ? {
            ...inv,
            status: newStatus,
            amountPaid: newStatus === "paid" ? inv.amountTTC : inv.amountPaid,
            balanceDue: newStatus === "paid" ? 0 : inv.amountTTC,
          }
        : inv
    );
    saveStoredInvoices(updated);
    setInvoice((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus,
            amountPaid: newStatus === "paid" ? prev.amountTTC : prev.amountPaid,
            balanceDue: newStatus === "paid" ? 0 : prev.amountTTC,
          }
        : null
    );
    setIsStatusDropdownOpen(false);
    showToast(`Statut mis à jour : ${newStatus.toUpperCase()}`);
  };

  // Delete handler with confirmation modal
  const handleConfirmDelete = async () => {
    if (!invoice) return;

    if (user?.id) {
      await deleteInvoice(invoice.id, user.id);
    }

    const list = getStoredInvoices();
    const updated = list.filter((inv) => inv.id !== invoice.id);
    saveStoredInvoices(updated);
    setIsDeleteModalOpen(false);
    showToast(`Facture ${invoice.invoiceNumber} supprimée.`);
    setTimeout(() => {
      router.push("/invoices");
    }, 800);
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    setIsDownloadingPdf(true);
    try {
      await generateAndDownloadInvoicePDF(invoice, settings);
      showToast(`Facture ${invoice.invoiceNumber} téléchargée en PDF !`);
    } catch (e) {
      showToast("Erreur lors de la génération du PDF");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Payée
          </span>
        );
      case "sent":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-400">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            Envoyée
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            En retard
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Brouillon
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex w-full max-w-full overflow-x-clip">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl border border-slate-700 dark:border-slate-200 animate-in slide-in-from-bottom-5 duration-200 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 md:pl-[260px] flex flex-col min-h-screen w-full max-w-full overflow-x-clip">
        <Header
          onMenuToggle={() => setMobileMenuOpen(true)}
          title={`Facture ${invoice.invoiceNumber}`}
          breadcrumb={`Factures / ${invoice.invoiceNumber}`}
          showPeriodSelector={false}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-6 max-w-5xl w-full mx-auto overflow-hidden">
          {/* Top Control Bar with Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <Link
                href="/invoices"
                className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Retour aux factures"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                    {invoice.invoiceNumber}
                  </h2>
                  {getStatusBadge(invoice.status)}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Client : <strong className="text-slate-700 dark:text-slate-300">{invoice.clientName}</strong>
                </p>
              </div>
            </div>

            {/* Buttons: Change status, Print, Delete */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Change Status Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <span>Changer statut</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => handleChangeStatus("paid")}
                      className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-medium"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Marquer Payée</span>
                    </button>
                    <button
                      onClick={() => handleChangeStatus("sent")}
                      className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 text-orange-700 dark:text-orange-400 hover:bg-orange-50 font-medium"
                    >
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      <span>Marquer Envoyée</span>
                    </button>
                    <button
                      onClick={() => handleChangeStatus("overdue")}
                      className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 text-rose-700 dark:text-rose-400 hover:bg-rose-50 font-medium"
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>Marquer En retard</span>
                    </button>
                    <button
                      onClick={() => handleChangeStatus("draft")}
                      className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 font-medium"
                    >
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      <span>Marquer Brouillon</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Modifier la facture */}
              <Link
                href={`/invoices/new?edit=${invoice.id}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
                title="Modifier cette facture"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Modifier</span>
              </Link>

              {/* Print Document Officiel */}
              <button
                type="button"
                onClick={() => printInvoicePDF(invoice, settings)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
                title="Imprimer le document officiel"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isDownloadingPdf}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50"
                title="Télécharger PDF officiel"
              >
                <Download className={`w-4 h-4 ${isDownloadingPdf ? "animate-bounce text-blue-600" : ""}`} />
              </button>

              {/* Send email */}
              <button
                type="button"
                onClick={() => showToast(`Facture envoyée par email à ${invoice.clientEmail} !`)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer au client</span>
              </button>

              {/* WhatsApp Action with PDF & Language selection */}
              {(() => {
                const waInfo = getInvoiceWhatsAppInfo(invoice);
                if (!waInfo.hasWhatsApp) return null;
                return (
                  <button
                    type="button"
                    onClick={() => setIsWhatsAppModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm shadow-emerald-500/25 transition-all"
                    title={`Envoyer la facture et le PDF par WhatsApp à ${waInfo.name}`}
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                    <span>WhatsApp</span>
                  </button>
                );
              })()}

              {/* Delete */}
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Supprimer la facture"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MAIN INVOICE DOCUMENT */}
          <div id="invoice-document-render" className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-8 text-slate-800 dark:text-slate-200">
            {/* Header: Logo & Meta */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                {settings.companyLogo ? (
                  <img
                    src={settings.companyLogo}
                    alt={settings.companyName || "Logo"}
                    className="max-h-12 max-w-[190px] object-contain mb-3"
                  />
                ) : (
                  <div className="flex items-center gap-2.5 mb-3">
                    <img
                      src="/images/devada-logo.png"
                      alt="Devada Invoice"
                      className="w-10 h-10 object-contain rounded-lg shadow-sm"
                    />
                    <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      devada<span className="text-emerald-600">invoice</span>
                    </span>
                  </div>
                )}

                <div className="mt-4">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                    {getInvoiceTranslations(invoice.language || "fr").documentTitle}
                  </h1>
                </div>
                <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  {getInvoiceTranslations(invoice.language || "fr").invoiceNumberPrefix} {invoice.invoiceNumber}
                </p>
              </div>

              <div className="text-right space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-400">{getInvoiceTranslations(invoice.language || "fr").issueDate} : </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatDate(invoice.issueDate)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">{getInvoiceTranslations(invoice.language || "fr").dueDate} : </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatDate(invoice.dueDate)}
                  </span>
                </div>
                {invoice.paymentMethod && (
                  <div>
                    <span className="text-slate-400">Mode de paiement : </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {invoice.paymentMethod}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Issuer & Client Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Émetteur :
                </span>
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  {settings.companyName || DEFAULT_SETTINGS.companyName}
                </p>
                <p className="text-slate-600 dark:text-slate-400">{settings.address || DEFAULT_SETTINGS.address}</p>
                <p className="text-slate-600 dark:text-slate-400">{settings.city || DEFAULT_SETTINGS.city}, {settings.country || "Sénégal"}</p>
                <p className="text-slate-500 font-mono text-[11px]">NINEA : {settings.ninea || DEFAULT_SETTINGS.ninea} • RCCM : {settings.rccm || DEFAULT_SETTINGS.rccm}</p>
                <p className="text-slate-500">{settings.email || DEFAULT_SETTINGS.email} • {settings.phone || DEFAULT_SETTINGS.phone}</p>
              </div>

              <div className="space-y-1 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Facturé à :
                </span>
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  {invoice.clientName}
                </p>
                {invoice.clientAddress && (
                  <p className="text-slate-600 dark:text-slate-400">{invoice.clientAddress}</p>
                )}
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
                    <th className="py-3 font-semibold">Désignation</th>
                    <th className="py-3 font-semibold text-center">Quantité</th>
                    <th className="py-3 font-semibold text-right">Prix Unitaire HT</th>
                    <th className="py-3 font-semibold text-center">Taux TVA</th>
                    <th className="py-3 font-semibold text-right">Montant HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="text-slate-800 dark:text-slate-200">
                      <td className="py-3.5 font-medium pr-3">{item.description}</td>
                      <td className="py-3.5 text-center text-slate-500">{item.quantity}</td>
                      <td className="py-3.5 text-right font-mono text-slate-600 dark:text-slate-400">
                        {formatInvoiceAmt(item.unitPrice)}
                      </td>
                      <td className="py-3.5 text-center font-medium text-slate-600 dark:text-slate-400">
                        {item.taxRate}%
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold">
                        {formatInvoiceAmt(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <div className="w-full sm:w-80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Sous-total HT :</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {formatInvoiceAmt(invoice.amountHT)}
                  </span>
                </div>

                {invoice.discountAmount && invoice.discountAmount > 0 ? (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Remise commerciale :</span>
                    <span className="font-mono">-{formatInvoiceAmt(invoice.discountAmount)}</span>
                  </div>
                ) : null}

                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>TVA Sénégal (18%) :</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {formatInvoiceAmt(invoice.taxAmount)}
                  </span>
                </div>

                <div className="flex justify-between py-2.5 border-t border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
                  <span>Total TTC :</span>
                  <span className="text-lg text-blue-600 dark:text-blue-400 font-mono">
                    {formatInvoiceAmt(invoice.amountTTC)}
                  </span>
                </div>

                {invoice.amountPaid > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                    <span>Montant réglé :</span>
                    <span className="font-mono">-{formatInvoiceAmt(invoice.amountPaid)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-1 border-t border-dashed border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>Solde restant dû :</span>
                  <span className="font-mono text-slate-900 dark:text-white">
                    {formatInvoiceAmt(invoice.balanceDue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Conditions & Signature */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-slate-500">
              <div className="space-y-1.5 max-w-md w-full">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  Conditions & Notes :
                </span>
                <div>
                  <p className="italic leading-relaxed text-slate-600 dark:text-slate-400">
                    {invoice.notes || "Règlement par virement ou Wave Business sous 15 jours."}
                  </p>
                  {invoice.showExchangeRate && invoice.currency && invoice.currency !== "FCFA" && invoice.appliedRate ? (
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1.5">
                      Taux de change officiel appliqué : 1 {invoice.currency} = {invoice.appliedRate.toLocaleString("fr-FR")} FCFA
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="text-right space-y-1 flex-shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Signature autorisée
                </span>
                {settings.signatureType === "image" && settings.signatureImageData ? (
                  <div className="pt-1">
                    <img
                      src={settings.signatureImageData}
                      alt="Signature officielle"
                      className="max-h-12 max-w-[140px] object-contain inline-block"
                    />
                  </div>
                ) : null}
                <div className="font-serif italic font-bold text-base text-slate-900 dark:text-white pt-1">
                  {settings.signatureName || CURRENT_USER.name}
                </div>
              </div>
            </div>

            {/* Pied de page institutionnel de l'entreprise */}
            <div className="pt-5 mt-5 border-t border-slate-200/80 dark:border-slate-800 text-center space-y-1 text-xs text-slate-500 dark:text-slate-400">
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
        </main>
      </div>

      {/* Confirmation Modal: Delete */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Supprimer la facture ${invoice.invoiceNumber} ?`}
        description="Cette action est irréversible. La facture sera définitivement retirée de vos registres comptables."
        confirmLabel="Supprimer définitivement"
        cancelLabel="Conserver la facture"
        variant="danger"
        icon="trash"
      >
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Client :</span>
            <span className="font-semibold text-slate-900 dark:text-white">{invoice.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Montant total TTC :</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{formatInvoiceAmt(invoice.amountTTC)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Statut :</span>
            <span className="font-semibold">{invoice.status}</span>
          </div>
        </div>
      </ConfirmModal>

      {/* WhatsApp Share Modal with language choice & template customization */}
      {isWhatsAppModalOpen && invoice && (
        <WhatsAppShareModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => setIsWhatsAppModalOpen(false)}
          invoice={invoice}
          settings={settings}
          onNotify={showToast}
        />
      )}
    </div>
  );
}
