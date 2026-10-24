"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header, PERIOD_OPTIONS } from "@/components/layout/Header";
import {
  Invoice,
  InvoiceStatus,
  MOCK_INVOICES,
  getStoredInvoices,
  saveStoredInvoices,
  getNextInvoiceNumber,
  getStoredSettings,
} from "@/lib/mock-data";
import { useAuth } from "@/lib/supabase/auth-context";
import {
  fetchInvoices,
  updateInvoiceStatus,
  deleteInvoice,
  saveInvoice,
  fetchCompanySettings,
} from "@/lib/supabase/db";
import { isInvoiceInPeriod } from "@/lib/period-metrics";
import { formatFCFA, formatAmountWithCurrency, formatDate, cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { generateAndDownloadInvoicePDF } from "@/lib/pdf-generator";
import {
  generateInvoiceWhatsAppUrl,
  WhatsAppIcon,
  sendInvoiceViaWhatsApp,
  getInvoiceWhatsAppInfo,
  WhatsAppShareModal,
} from "@/lib/whatsapp-utils";
import {
  exportInvoicesToExcel,
  exportInvoicesToCSV,
  exportInvoicesToPDF,
} from "@/lib/export-utils";
import { usePlatformLanguage } from "@/lib/i18n";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Send,
  Edit3,
  Copy,
  Trash2,
  CreditCard,
  ArrowUpDown,
  TrendingUp,
  ChevronDown,
  Check,
} from "lucide-react";

// Saturated high-contrast avatar styles for client initials
const CLIENT_AVATARS_PALETTE = [
  { bg: "bg-blue-600", text: "text-white" },
  { bg: "bg-emerald-600", text: "text-white" },
  { bg: "bg-violet-600", text: "text-white" },
  { bg: "bg-rose-600", text: "text-white" },
  { bg: "bg-indigo-600", text: "text-white" },
  { bg: "bg-amber-600", text: "text-white" },
  { bg: "bg-teal-600", text: "text-white" },
  { bg: "bg-cyan-700", text: "text-white" },
  { bg: "bg-slate-700", text: "text-white" },
];

export default function InvoicesListPage() {
  const { user } = useAuth();
  const { lang, t } = usePlatformLanguage();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("all-time");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Contextual action popup state
  const [actionMenuInvoiceId, setActionMenuInvoiceId] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Modals state for confirmation
  const [deleteInvoiceTarget, setDeleteInvoiceTarget] = useState<Invoice | null>(null);
  const [reminderInvoiceTarget, setReminderInvoiceTarget] = useState<Invoice | null>(null);
  const [statusDropdownInvoiceId, setStatusDropdownInvoiceId] = useState<string | null>(null);
  const [whatsAppInvoice, setWhatsAppInvoice] = useState<Invoice | null>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [statusChangeTarget, setStatusChangeTarget] = useState<{
    invoice: Invoice;
    newStatus: InvoiceStatus;
  } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [globalCurrency, setGlobalCurrency] = useState<string>("FCFA");
  const [copiedInvoiceId, setCopiedInvoiceId] = useState<string | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load invoices on mount and listen to updates
  useEffect(() => {
    const load = async () => {
      if (user?.id) {
        try {
          const dbInvoices = await fetchInvoices(user.id);
          setInvoices(dbInvoices || []);
          saveStoredInvoices(dbInvoices || []);
          const dbSettings = await fetchCompanySettings(user.id);
          if (dbSettings?.currency) {
            setGlobalCurrency(dbSettings.currency);
          }
          return;
        } catch (e) {
          console.error("Erreur chargement Supabase:", e);
        }
      }
      setInvoices([]);
      const settings = getStoredSettings();
      if (settings?.currency) {
        setGlobalCurrency(settings.currency);
      }
    };
    load();
    window.addEventListener("invoices_updated", load);
    window.addEventListener("settings_updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("invoices_updated", load);
      window.removeEventListener("settings_updated", load);
      window.removeEventListener("storage", load);
    };
  }, [user?.id]);

  // Reset page when filter, search or period changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm, sortBy, sortOrder, selectedPeriodId]);

  // Close action popup and status dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(target)
      ) {
        setActionMenuInvoiceId(null);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(target)
      ) {
        setStatusDropdownInvoiceId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleCopyInvoiceNumber = (e: React.MouseEvent, num: string, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(num);
    }
    setCopiedInvoiceId(id);
    showToast(`Numéro ${num} copié !`);
    setTimeout(() => {
      setCopiedInvoiceId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  // Actions handlers
  const handleConfirmStatusChange = async () => {
    if (!statusChangeTarget) return;
    const { invoice, newStatus } = statusChangeTarget;

    if (user?.id) {
      await updateInvoiceStatus(invoice.id, newStatus, invoice.amountTTC, user.id);
    }

    const updated = invoices.map((inv) => {
      if (inv.id !== invoice.id) return inv;
      let amountPaid = inv.amountPaid;
      let balanceDue = inv.balanceDue;
      if (newStatus === "paid") {
        amountPaid = inv.amountTTC;
        balanceDue = 0;
      } else if (inv.status === "paid") {
        amountPaid = 0;
        balanceDue = inv.amountTTC;
      }
      return {
        ...inv,
        status: newStatus,
        amountPaid,
        balanceDue,
      };
    });
    setInvoices(updated);
    saveStoredInvoices(updated);

    const labels: Record<InvoiceStatus, string> = {
      paid: "Payée",
      sent: "Envoyée",
      overdue: "En retard",
      draft: "Brouillon",
    };
    showToast(`Statut de ${invoice.invoiceNumber} changé en "${labels[newStatus]}" !`);
    setStatusChangeTarget(null);
  };

  const handleMarkAsPaid = async (invoice: Invoice) => {
    if (user?.id) {
      await updateInvoiceStatus(invoice.id, "paid", invoice.amountTTC, user.id);
    }

    const updated = invoices.map((inv) =>
      inv.id === invoice.id
        ? {
            ...inv,
            status: "paid" as InvoiceStatus,
            amountPaid: inv.amountTTC,
            balanceDue: 0,
          }
        : inv
    );
    setInvoices(updated);
    saveStoredInvoices(updated);
    setActionMenuInvoiceId(null);
    showToast(`Paiement de ${formatAmountWithCurrency(invoice.amountTTC, globalCurrency)} enregistré pour ${invoice.invoiceNumber}`);
  };

  const handleDuplicate = async (invoice: Invoice) => {
    const nextSeqNumber = getNextInvoiceNumber();
    const today = new Date().toISOString().split("T")[0];
    const newInvoice: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      invoiceNumber: nextSeqNumber,
      issueDate: today,
      dueDate: today,
      status: "draft",
      amountPaid: 0,
      balanceDue: invoice.amountTTC,
    };

    if (user?.id) {
      const res = await saveInvoice(newInvoice, user.id);
      if (res.success && res.id) {
        newInvoice.id = res.id;
      }
    }

    const updated = [newInvoice, ...invoices];
    setInvoices(updated);
    saveStoredInvoices(updated);
    setActionMenuInvoiceId(null);
    showToast(`Facture dupliquée avec succès : ${newInvoice.invoiceNumber} (Brouillon)`);
  };

  const handleConfirmDelete = async () => {
    if (!deleteInvoiceTarget) return;

    if (user?.id) {
      await deleteInvoice(deleteInvoiceTarget.id, user.id);
    }

    const updated = invoices.filter((inv) => inv.id !== deleteInvoiceTarget.id);
    setInvoices(updated);
    saveStoredInvoices(updated);
    showToast(`Facture ${deleteInvoiceTarget.invoiceNumber} supprimée définitivement.`);
    setDeleteInvoiceTarget(null);
    setActionMenuInvoiceId(null);
  };

  const handleConfirmReminder = () => {
    if (!reminderInvoiceTarget) return;
    showToast(`Notification de relance transmise avec succès à ${reminderInvoiceTarget.clientName} (${reminderInvoiceTarget.clientEmail}) !`);
    setReminderInvoiceTarget(null);
    setActionMenuInvoiceId(null);
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    setDownloadingId(invoice.id);
    try {
      const settings = getStoredSettings();
      await generateAndDownloadInvoicePDF(invoice, settings);
      showToast(`Facture ${invoice.invoiceNumber} téléchargée en PDF !`);
    } catch (e) {
      showToast(`Erreur lors du téléchargement de la facture.`);
    } finally {
      setDownloadingId(null);
    }
  };

  // 1. Filter by selected period first
  const periodInvoices = useMemo(() => {
    return invoices.filter((inv) => isInvoiceInPeriod(inv.issueDate, selectedPeriodId));
  }, [invoices, selectedPeriodId]);

  const currentPeriodOption = useMemo(() => {
    return PERIOD_OPTIONS.find((p) => p.id === selectedPeriodId);
  }, [selectedPeriodId]);

  // 2. Filter by status and search among periodInvoices
  const filteredInvoices = useMemo(() => {
    return periodInvoices
      .filter((inv) => {
        const matchesStatus =
          statusFilter === "all" ? true : inv.status === statusFilter;
        const matchesSearch =
          inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.clientCity.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          return sortOrder === "desc"
            ? new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
            : new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
        } else {
          return sortOrder === "desc"
            ? (b.amountTTC || 0) - (a.amountTTC || 0)
            : (a.amountTTC || 0) - (b.amountTTC || 0);
        }
      });
  }, [periodInvoices, statusFilter, searchTerm, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredInvoices.length / pageSize) || 1;
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Payée
          </span>
        );
      case "sent":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200/80 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            Envoyée
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            En retard
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Brouillon
          </span>
        );
    }
  };

  const renderInteractiveStatusBadge = (invoice: Invoice) => {
    const isOpen = statusDropdownInvoiceId === invoice.id;
    return (
      <div
        className="relative inline-block text-left"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setStatusDropdownInvoiceId(isOpen ? null : invoice.id);
          }}
          className="group inline-flex items-center gap-1 focus:outline-none transition-transform active:scale-95"
          title="Cliquer pour changer le statut"
        >
          {getStatusBadge(invoice.status)}
          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>

        {isOpen && (
          <div
            ref={statusDropdownRef}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute left-0 sm:left-auto sm:right-0 mt-1.5 w-44 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-3 py-1 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Changer statut
            </div>
            {(["paid", "sent", "overdue", "draft"] as InvoiceStatus[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setStatusDropdownInvoiceId(null);
                  if (st !== invoice.status) {
                    setStatusChangeTarget({ invoice, newStatus: st });
                  }
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors",
                  invoice.status === st
                    ? "bg-slate-50 dark:bg-slate-800/80 font-bold text-slate-900 dark:text-white"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      st === "paid" && "bg-emerald-500",
                      st === "sent" && "bg-orange-500",
                      st === "overdue" && "bg-rose-500",
                      st === "draft" && "bg-slate-400"
                    )}
                  />
                  <span>
                    {st === "paid"
                      ? "Payée"
                      : st === "sent"
                      ? "Envoyée"
                      : st === "overdue"
                      ? "En retard"
                      : "Brouillon"}
                  </span>
                </div>
                {invoice.status === st && (
                  <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Counts for status tabs based on selected period
  const counts = useMemo(
    () => ({
      all: periodInvoices.length,
      paid: periodInvoices.filter((i) => i.status === "paid").length,
      sent: periodInvoices.filter((i) => i.status === "sent").length,
      overdue: periodInvoices.filter((i) => i.status === "overdue").length,
      draft: periodInvoices.filter((i) => i.status === "draft").length,
    }),
    [periodInvoices]
  );

  // Summary Metrics based on selected period
  const totalBilled = useMemo(
    () => periodInvoices.reduce((sum, inv) => sum + (inv.amountTTC || 0), 0),
    [periodInvoices]
  );
  const totalCollected = useMemo(
    () => periodInvoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0),
    [periodInvoices]
  );
  const totalPending = useMemo(
    () => periodInvoices.reduce((sum, inv) => sum + (inv.balanceDue || 0), 0),
    [periodInvoices]
  );

  // Export handler for Header
  const handleExport = (format: "excel" | "csv" | "pdf") => {
    const targetData = filteredInvoices.length > 0 ? filteredInvoices : periodInvoices;
    if (format === "excel") {
      exportInvoicesToExcel(targetData);
      setToastMessage(`Export Excel (${targetData.length} factures) téléchargé avec succès !`);
    } else if (format === "csv") {
      exportInvoicesToCSV(targetData);
      setToastMessage(`Export CSV (${targetData.length} factures) téléchargé avec succès !`);
    } else if (format === "pdf") {
      exportInvoicesToPDF(targetData);
      setToastMessage(`Rapport PDF (${targetData.length} factures) généré avec succès !`);
    }
    setTimeout(() => setToastMessage(null), 3500);
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
          title={t.invoices.title}
          subtitle={t.invoices.subtitle}
          breadcrumb={`${t.nav.invoices} / ${currentPeriodOption?.label || t.invoices.filterAll}`}
          showPeriodSelector={true}
          selectedPeriodId={selectedPeriodId}
          onPeriodChange={(id) => setSelectedPeriodId(id)}
          showExportButton={true}
          onExport={handleExport}
          exportLabel="Exporter factures"
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto overflow-hidden">
          {/* Quick Metrics Bar with dynamic period update */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
              <div className="flex items-center justify-between mb-1 gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                  Total Facturé ({periodInvoices.length} {periodInvoices.length > 1 ? "factures" : "facture"})
                </span>
                {selectedPeriodId !== "all-time" && (
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-900/40 whitespace-nowrap">
                    {currentPeriodOption?.label}
                  </span>
                )}
              </div>
              <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {formatAmountWithCurrency(totalBilled, globalCurrency)}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                Total Encaissé
              </span>
              <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {formatAmountWithCurrency(totalCollected, globalCurrency)}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
                Solde Restant Dû
              </span>
              <p className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {formatAmountWithCurrency(totalPending, globalCurrency)}
              </p>
            </div>
          </div>

          {/* Main Invoices Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-soft overflow-hidden w-full max-w-full">
            {/* Header with Search and New Invoice CTA */}
            <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Toutes les factures
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Gérez vos émissions, suivez les échéances et déclenchez les règlements.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Link
                    href="/invoices/new"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-sm shadow-blue-500/25 transition-all whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Créer une facture</span>
                  </Link>
                </div>
              </div>

              {/* Search Bar & Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
                {/* Search Input */}
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par numéro, nom client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Trier par :</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (sortBy === "date") {
                        setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                      } else {
                        setSortBy("date");
                        setSortOrder("desc");
                      }
                    }}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors",
                      sortBy === "date"
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 border-blue-200 dark:border-blue-800"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600"
                    )}
                  >
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (sortBy === "amount") {
                        setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                      } else {
                        setSortBy("amount");
                        setSortOrder("desc");
                      }
                    }}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors",
                      sortBy === "amount"
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 border-blue-200 dark:border-blue-800"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600"
                    )}
                  >
                    <span>Montant</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 no-scrollbar w-full">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0",
                    statusFilter === "all"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  Toutes ({counts.all})
                </button>
                <button
                  onClick={() => setStatusFilter("paid")}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0",
                    statusFilter === "paid"
                      ? "bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-500/20"
                      : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100"
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Payées ({counts.paid})
                </button>
                <button
                  onClick={() => setStatusFilter("sent")}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0",
                    statusFilter === "sent"
                  ? "bg-orange-500 text-white font-semibold shadow-sm shadow-orange-500/20"
                  : "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 hover:bg-orange-100"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              Envoyées ({counts.sent})
            </button>
            <button
              onClick={() => setStatusFilter("overdue")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0",
                statusFilter === "overdue"
                  ? "bg-rose-600 text-white font-semibold shadow-sm shadow-rose-500/20"
                  : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 hover:bg-rose-100"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              En retard ({counts.overdue})
            </button>
            <button
              onClick={() => setStatusFilter("draft")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0",
                statusFilter === "draft"
                  ? "bg-slate-700 text-white font-semibold shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Brouillons ({counts.draft})
            </button>
          </div>
        </div>

        {/* --- MOBILE VIEW: Vertical Cards (Zero horizontal scroll) --- */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredInvoices.length === 0 ? (
            <div className="py-12 text-center text-slate-400 p-4">
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="font-medium text-slate-600 dark:text-slate-300 text-sm">
                Aucune facture trouvée
              </p>
            </div>
          ) : (
            paginatedInvoices.map((invoice, index) => {
              const avatarStyle = CLIENT_AVATARS_PALETTE[index % CLIENT_AVATARS_PALETTE.length];
              const isMenuOpen = actionMenuInvoiceId === invoice.id;

              return (
                <div
                  key={`mobile-${invoice.id}`}
                  onClick={() => router.push(`/invoices/${invoice.id}`)}
                  className="p-4 space-y-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                        {invoice.invoiceNumber}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyInvoiceNumber(e, invoice.invoiceNumber, invoice.id)}
                        className={cn(
                          "p-1 rounded-md transition-colors",
                          copiedInvoiceId === invoice.id
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                            : "text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                        title="Copier le numéro"
                      >
                        {copiedInvoiceId === invoice.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    {renderInteractiveStatusBadge(invoice)}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-sm flex-shrink-0 ring-1 ring-black/10 dark:ring-white/10 ${avatarStyle.bg} ${avatarStyle.text}`}
                    >
                      {invoice.clientName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {invoice.clientName}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {invoice.clientCity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Montant TTC
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                        {formatAmountWithCurrency(invoice.amountTTC, globalCurrency)}
                      </span>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      <div className="mr-1">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Échéance
                        </span>
                        <span
                          className={cn(
                            "font-medium",
                            invoice.status === "overdue"
                              ? "text-rose-600 dark:text-rose-400 font-bold"
                              : "text-slate-600 dark:text-slate-400"
                          )}
                        >
                          {formatDate(invoice.dueDate)}
                        </span>
                      </div>

                      {/* View Details Link */}
                      <Link
                        href={`/invoices/${invoice.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                        title="Détail"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* Edit Invoice Link */}
                      <Link
                        href={`/invoices/new?edit=${invoice.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:text-blue-600"
                        title="Modifier"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>

                      {/* WhatsApp Quick Action if number available */}
                      {(() => {
                        const waInfo = getInvoiceWhatsAppInfo(invoice);
                        if (!waInfo.hasWhatsApp) return null;
                        return (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setWhatsAppInvoice(invoice);
                            }}
                            className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
                            title={`Envoyer la facture et le PDF par WhatsApp à ${waInfo.name}`}
                          >
                            <WhatsAppIcon className="w-4 h-4" />
                          </button>
                        );
                      })()}

                      {/* 3 dots pop-up */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionMenuInvoiceId(isMenuOpen ? null : invoice.id);
                          }}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <div
                            ref={actionMenuRef}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 bottom-full mb-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-40 text-left"
                          >
                            <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                              {invoice.invoiceNumber}
                            </div>
                            <Link
                              href={`/invoices/${invoice.id}`}
                              className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
                              <span>Consulter la fiche</span>
                            </Link>
                            <Link
                              href={`/invoices/new?edit=${invoice.id}`}
                              className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                              <span>Modifier la facture</span>
                            </Link>
                            {/* WhatsApp Item */}
                            {(() => {
                              const waInfo = getInvoiceWhatsAppInfo(invoice);
                              if (!waInfo.hasWhatsApp) return null;
                              return (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActionMenuInvoiceId(null);
                                    setWhatsAppInvoice(invoice);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-medium"
                                >
                                  <WhatsAppIcon className="w-3.5 h-3.5" />
                                  <span>Envoyer par WhatsApp (avec PDF)</span>
                                </button>
                              );
                            })()}
                            {invoice.status !== "paid" && (
                              <button
                                onClick={() => handleMarkAsPaid(invoice)}
                                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-emerald-600 hover:bg-emerald-50"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Enregistrer paiement</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleDownloadPDF(invoice)}
                              disabled={downloadingId === invoice.id}
                              className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-emerald-600 hover:bg-emerald-50"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{downloadingId === invoice.id ? "Génération PDF..." : "Télécharger PDF"}</span>
                            </button>
                            <button
                              onClick={() => handleDuplicate(invoice)}
                              className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-700 hover:bg-slate-50"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Dupliquer</span>
                            </button>
                            <button
                              onClick={() => {
                                setReminderInvoiceTarget(invoice);
                                setActionMenuInvoiceId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-700 hover:bg-slate-50"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Envoyer relance</span>
                            </button>
                            <button
                              onClick={() => {
                                setDeleteInvoiceTarget(invoice);
                                setActionMenuInvoiceId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50 border-t border-slate-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Supprimer</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* --- DESKTOP VIEW: Classical Full Table --- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-5 sm:px-6">Numéro</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Émission</th>
                <th className="py-3 px-4">Échéance</th>
                <th className="py-3 px-4 text-right">Montant TTC</th>
                <th className="py-3 px-4 text-center">Statut</th>
                <th className="py-3 px-5 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="font-medium text-slate-600 dark:text-slate-300 text-sm">
                      Aucune facture trouvée
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((invoice, index) => {
                  const avatarStyle = CLIENT_AVATARS_PALETTE[index % CLIENT_AVATARS_PALETTE.length];
                  const isMenuOpen = actionMenuInvoiceId === invoice.id;

                  return (
                    <tr
                      key={invoice.id}
                      onClick={() => router.push(`/invoices/${invoice.id}`)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-5 sm:px-6 font-mono font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span className="text-blue-600 dark:text-blue-400 group-hover:underline">
                            {invoice.invoiceNumber}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyInvoiceNumber(e, invoice.invoiceNumber, invoice.id)}
                            className={cn(
                              "p-1 rounded-md transition-all",
                              copiedInvoiceId === invoice.id
                                ? "opacity-100 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                                : "opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                            title="Copier le numéro"
                          >
                            {copiedInvoiceId === invoice.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-[10px] shadow-sm flex-shrink-0 ring-1 ring-black/10 dark:ring-white/10 ${avatarStyle.bg} ${avatarStyle.text}`}
                          >
                            {invoice.clientName.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">
                              {invoice.clientName}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {invoice.clientCity}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(invoice.issueDate)}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "font-medium",
                            invoice.status === "overdue"
                              ? "text-rose-600 dark:text-rose-400 font-semibold"
                              : "text-slate-600 dark:text-slate-400"
                          )}
                        >
                          {formatDate(invoice.dueDate)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {formatAmountWithCurrency(invoice.amountTTC, globalCurrency)}
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {renderInteractiveStatusBadge(invoice)}
                      </td>

                      <td
                        className="py-3.5 px-5 sm:px-6 text-right whitespace-nowrap relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/invoices/${invoice.id}`}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            title="Consulter"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/invoices/new?edit=${invoice.id}`}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDownloadPDF(invoice)}
                            disabled={downloadingId === invoice.id}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
                            title="Télécharger PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          {/* WhatsApp action button if client has WhatsApp */}
                          {(() => {
                            const waInfo = getInvoiceWhatsAppInfo(invoice);
                            if (!waInfo.hasWhatsApp) {
                              return (
                                <span
                                  className="p-1.5 text-slate-300 dark:text-slate-600 cursor-not-allowed rounded-xl"
                                  title="Pas de numéro WhatsApp disponible pour ce client"
                                >
                                  <WhatsAppIcon className="w-4 h-4 opacity-35" />
                                </span>
                              );
                            }
                            return (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setWhatsAppInvoice(invoice);
                                }}
                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-colors"
                                title={`Envoyer la facture et le PDF par WhatsApp à ${waInfo.name}`}
                              >
                                <WhatsAppIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              </button>
                            );
                          })()}

                          {/* 3-dots Menu */}
                          <div className="relative inline-block text-left">
                            <button
                              onClick={() => setActionMenuInvoiceId(isMenuOpen ? null : invoice.id)}
                              className={cn(
                                "p-1.5 rounded-xl transition-colors",
                                isMenuOpen
                                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                              )}
                              title="Options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                              <div
                                ref={actionMenuRef}
                                className="absolute right-0 top-full mt-1.5 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-40 text-left animate-in fade-in zoom-in-95 duration-150"
                              >
                                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                                  {invoice.invoiceNumber}
                                </div>

                                <Link
                                  href={`/invoices/${invoice.id}`}
                                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70"
                                >
                                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Voir les détails</span>
                                </Link>

                                <Link
                                  href={`/invoices/new?edit=${invoice.id}`}
                                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Modifier la facture</span>
                                </Link>

                                {/* WhatsApp Item */}
                                {(() => {
                                  const waInfo = getInvoiceWhatsAppInfo(invoice);
                                  if (!waInfo.hasWhatsApp) return null;
                                  return (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActionMenuInvoiceId(null);
                                        setWhatsAppInvoice(invoice);
                                      }}
                                      className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-medium"
                                    >
                                      <WhatsAppIcon className="w-3.5 h-3.5" />
                                      <span>Envoyer par WhatsApp (avec PDF)</span>
                                    </button>
                                  );
                                })()}

                                {invoice.status !== "paid" && (
                                  <button
                                    onClick={() => handleMarkAsPaid(invoice)}
                                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 font-medium"
                                  >
                                    <CreditCard className="w-3.5 h-3.5" />
                                    <span>Enregistrer paiement</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDuplicate(invoice)}
                                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                                >
                                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Dupliquer</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setReminderInvoiceTarget(invoice);
                                    setActionMenuInvoiceId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                                >
                                  <Send className="w-3.5 h-3.5 text-blue-500" />
                                  <span>Envoyer relance</span>
                                </button>

                                <button
                                  onClick={() => handleDownloadPDF(invoice)}
                                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                                >
                                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Télécharger PDF officiel</span>
                                </button>

                                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                                <button
                                  onClick={() => {
                                    setDeleteInvoiceTarget(invoice);
                                    setActionMenuInvoiceId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 font-medium"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Supprimer la facture</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Pagination */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredInvoices.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            itemName="factures"
          />
        </div>
      </div>
    </main>
  </div>

  {/* Confirmation Modal: Suppression */}
  <ConfirmModal
    isOpen={!!deleteInvoiceTarget}
    onClose={() => setDeleteInvoiceTarget(null)}
    onConfirm={handleConfirmDelete}
    title={`Supprimer la facture ${deleteInvoiceTarget?.invoiceNumber} ?`}
    description="Cette action est irréversible. La facture sera définitivement retirée de vos registres comptables."
    confirmLabel="Supprimer définitivement"
    cancelLabel="Conserver la facture"
    variant="danger"
    icon="trash"
  >
    {deleteInvoiceTarget && (
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-400">Client :</span>
          <span className="font-semibold text-slate-900 dark:text-white">{deleteInvoiceTarget.clientName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Montant total TTC :</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">{formatAmountWithCurrency(deleteInvoiceTarget.amountTTC, globalCurrency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Date d'émission :</span>
          <span className="font-semibold">{formatDate(deleteInvoiceTarget.issueDate)}</span>
        </div>
      </div>
    )}
  </ConfirmModal>

  {/* Confirmation Modal: Envoi de Relance */}
  <ConfirmModal
    isOpen={!!reminderInvoiceTarget}
    onClose={() => setReminderInvoiceTarget(null)}
    onConfirm={handleConfirmReminder}
    title={`Envoyer une relance pour ${reminderInvoiceTarget?.invoiceNumber} ?`}
    description="Un avis d'échéance formel sera transmis au client pour lui notifier le solde restant dû."
    confirmLabel="Confirmer et envoyer la relance"
    cancelLabel="Annuler"
    variant="primary"
    icon="send"
  >
    {reminderInvoiceTarget && (
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-400">Client destinataire :</span>
          <span className="font-semibold text-slate-900 dark:text-white">{reminderInvoiceTarget.clientName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Email de contact :</span>
          <span className="font-mono text-blue-600 dark:text-blue-400">{reminderInvoiceTarget.clientEmail}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Solde exigible :</span>
          <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{formatAmountWithCurrency(reminderInvoiceTarget.balanceDue || reminderInvoiceTarget.amountTTC, globalCurrency)}</span>
        </div>
      </div>
    )}
  </ConfirmModal>

  {/* Confirmation Modal: Changement de Statut Interactif */}
  <ConfirmModal
    isOpen={!!statusChangeTarget}
    onClose={() => setStatusChangeTarget(null)}
    onConfirm={handleConfirmStatusChange}
    title={`Changer le statut de la facture ${statusChangeTarget?.invoice.invoiceNumber} ?`}
    description={`Le statut passera à "${
      statusChangeTarget?.newStatus === "paid"
        ? "Payée"
        : statusChangeTarget?.newStatus === "sent"
        ? "Envoyée"
        : statusChangeTarget?.newStatus === "overdue"
        ? "En retard"
        : "Brouillon"
    }". Les montants encaissés et soldes dus seront automatiquement ajustés.`}
    confirmLabel="Confirmer le changement"
    cancelLabel="Annuler"
    variant={statusChangeTarget?.newStatus === "paid" ? "primary" : "warning"}
    icon={statusChangeTarget?.newStatus === "paid" ? "check" : "warning"}
  >
    {statusChangeTarget && (
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-400">Client :</span>
          <span className="font-semibold text-slate-900 dark:text-white">{statusChangeTarget.invoice.clientName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Montant total TTC :</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">{formatAmountWithCurrency(statusChangeTarget.invoice.amountTTC, globalCurrency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Nouveau statut :</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {statusChangeTarget.newStatus === "paid"
              ? "Payée (solde dû ramené à 0 FCFA)"
              : statusChangeTarget.newStatus === "sent"
              ? "Envoyée"
              : statusChangeTarget.newStatus === "overdue"
              ? "En retard"
              : "Brouillon"}
          </span>
        </div>
      </div>
    )}
  </ConfirmModal>

  {/* WhatsApp Share Modal with language selection */}
  {whatsAppInvoice && (
    <WhatsAppShareModal
      isOpen={!!whatsAppInvoice}
      onClose={() => setWhatsAppInvoice(null)}
      invoice={whatsAppInvoice}
      settings={getStoredSettings()}
      onNotify={showToast}
    />
  )}
</div>
  );
}
