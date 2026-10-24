"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { SuccessModal, SuccessModalDetail } from "@/components/ui/SuccessModal";
import {
  Client,
  MOCK_CLIENTS,
  getStoredClients,
  saveStoredClients,
  getStoredSettings,
} from "@/lib/mock-data";
import { useAuth } from "@/lib/supabase/auth-context";
import {
  fetchClients,
  saveClient,
  deleteClient,
  fetchInvoices,
  seedDemoDataIfEmpty,
} from "@/lib/supabase/db";
import { formatFCFA, formatAmountWithCurrency, formatDate, cn } from "@/lib/utils";
import {
  exportClientsToExcel,
  exportClientsToCSV,
  exportClientsToPDF,
} from "@/lib/export-utils";
import { usePlatformLanguage } from "@/lib/i18n";
import {
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  Users,
  Receipt,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  MessageCircle,
  Calendar,
  Copy,
  Check,
} from "lucide-react";

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-rose-600",
  "bg-indigo-600",
  "bg-amber-600",
  "bg-teal-600",
  "bg-cyan-700",
];

type SortField = "name" | "createdAt" | "invoicesCount" | "totalBilled" | "balanceDue" | "status";
type SortDirection = "asc" | "desc";
type FilterMemo = "all" | "active" | "inactive" | "due";

const CLIENTS_PER_PAGE = 6;

export default function ClientsPage() {
  const { user } = useAuth();
  const { lang, t } = usePlatformLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMemo, setActiveMemo] = useState<FilterMemo>("all");

  // Sorting State
  const [sortField, setSortField] = useState<SortField>("totalBilled");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form Fields (including acquisitionDate, emailPec and whatsapp)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    emailPec: "",
    phone: "",
    whatsapp: "",
    city: "",
    address: "",
    ninea: "",
    status: "active" as "active" | "inactive",
    acquisitionDate: new Date().toISOString().split("T")[0],
  });

  // Copied item key state for feedback animation
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteTargetClient, setDeleteTargetClient] = useState<Client | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`${label} copié dans le presse-papier !`);
    setTimeout(() => {
      setCopiedKey(null);
    }, 1800);
  };

  const [successModalData, setSuccessModalData] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    details: SuccessModalDetail[];
  }>({
    isOpen: false,
    title: "",
    message: "",
    details: [],
  });

  const [globalCurrency, setGlobalCurrency] = useState<string>("FCFA");

  const loadClientsData = async () => {
    if (user?.id) {
      try {
        const [dbClients, invoices] = await Promise.all([
          fetchClients(user.id),
          fetchInvoices(user.id),
        ]);

        const enriched = (dbClients || []).map((c) => {
          const clientInvs = (invoices || []).filter(
            (inv) =>
              inv.clientName?.toLowerCase().trim() === c.name?.toLowerCase().trim() ||
              (inv as any).clientId === c.id
          );
          const totalBilled = clientInvs.reduce(
            (sum, inv) => sum + (inv.amountTTC || 0),
            0
          );
          const balanceDue = clientInvs.reduce(
            (sum, inv) => sum + (inv.balanceDue || 0),
            0
          );
          return {
            ...c,
            totalBilled,
            balanceDue,
            invoicesCount: clientInvs.length,
          };
        });
        setClients(enriched);
        saveStoredClients(enriched);
        return;
      } catch (err) {
        console.error("Erreur chargement clients Supabase:", err);
      }
    }
    // Si déconnecté ou 0 clients
    setClients([]);
  };

  useEffect(() => {
    loadClientsData();
    const loadSettings = () => {
      const settings = getStoredSettings();
      if (settings?.currency) {
        setGlobalCurrency(settings.currency);
      }
    };
    loadSettings();
    const handleClientsUpdated = () => {
      loadClientsData();
    };
    window.addEventListener("clients_updated", handleClientsUpdated);
    window.addEventListener("invoices_updated", handleClientsUpdated);
    window.addEventListener("settings_updated", loadSettings);
    window.addEventListener("storage", loadSettings);
    return () => {
      window.removeEventListener("clients_updated", handleClientsUpdated);
      window.removeEventListener("invoices_updated", handleClientsUpdated);
      window.removeEventListener("settings_updated", loadSettings);
      window.removeEventListener("storage", loadSettings);
    };
  }, [user?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open modal for new client
  const handleOpenAdd = () => {
    setEditingClient(null);
    setFormData({
      name: "",
      email: "",
      emailPec: "",
      phone: "",
      whatsapp: "",
      city: "",
      address: "",
      ninea: "",
      status: "active",
      acquisitionDate: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      emailPec: client.emailPec || "",
      phone: client.phone,
      whatsapp: client.whatsapp || "",
      city: client.city,
      address: client.address,
      ninea: client.ninea || "",
      status: client.status || "active",
      acquisitionDate: client.acquisitionDate || client.createdAt || new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  // Delete client trigger
  const handleDelete = (client: Client) => {
    setDeleteTargetClient(client);
  };

  // Confirmed Delete client
  const handleConfirmDeleteClient = async () => {
    if (!deleteTargetClient) return;

    if (user?.id) {
      await deleteClient(deleteTargetClient.id, user.id);
    }

    const updated = clients.filter((c) => c.id !== deleteTargetClient.id);
    setClients(updated);
    saveStoredClients(updated);
    showToast(`Client ${deleteTargetClient.name} supprimé avec succès.`);
    setDeleteTargetClient(null);
  };

  // Save Client (Add or Edit)
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Veuillez renseigner au minimum la raison sociale et l'email du client.");
      return;
    }

    if (editingClient) {
      // Update
      const updatedClientData: Partial<Client> = {
        id: editingClient.id,
        name: formData.name,
        email: formData.email,
        emailPec: formData.emailPec.trim() || undefined,
        phone: formData.phone,
        whatsapp: formData.whatsapp.trim() || undefined,
        city: formData.city,
        address: formData.address,
        ninea: formData.ninea.trim() || undefined,
        status: formData.status,
      };

      if (user?.id) {
        await saveClient(updatedClientData, user.id);
      }

      const updated = clients.map((c) =>
        c.id === editingClient.id
          ? {
              ...c,
              ...updatedClientData,
              createdAt: formData.acquisitionDate || c.createdAt,
              acquisitionDate: formData.acquisitionDate || c.acquisitionDate,
            }
          : c
      );
      setClients(updated);
      saveStoredClients(updated);
      setSuccessModalData({
        isOpen: true,
        title: "Client modifié avec succès !",
        message: `Les informations de "${formData.name}" ont été mises à jour avec succès.`,
        details: [
          { label: "Raison Sociale", value: formData.name },
          { label: "Email professionnel", value: formData.email },
          { label: "Téléphone", value: formData.phone || "Non renseigné" },
          { label: "Date d'acquisition", value: formatDate(formData.acquisitionDate) },
          { label: "Ville", value: formData.city },
          { label: "Statut", value: formData.status === "active" ? "Actif" : "Inactif", isHighlight: true },
        ],
      });
      showToast(`Fiche client de ${formData.name} mise à jour avec succès !`);
    } else {
      // Create new
      const newClientPayload: Partial<Client> = {
        name: formData.name,
        email: formData.email,
        emailPec: formData.emailPec.trim() || undefined,
        phone: formData.phone,
        whatsapp: formData.whatsapp.trim() || undefined,
        city: formData.city,
        address: formData.address,
        ninea: formData.ninea.trim() || undefined,
        avatarBg: AVATAR_COLORS[clients.length % AVATAR_COLORS.length],
        status: formData.status,
      };

      let newId = `client-${Date.now()}`;
      if (user?.id) {
        const res = await saveClient(newClientPayload, user.id);
        if (res.success && res.id) {
          newId = res.id;
        }
      }

      const newClient: Client = {
        id: newId,
        name: formData.name,
        email: formData.email,
        emailPec: formData.emailPec.trim() || undefined,
        phone: formData.phone,
        whatsapp: formData.whatsapp.trim() || undefined,
        city: formData.city,
        address: formData.address,
        ninea: formData.ninea.trim() || undefined,
        totalBilled: 0,
        balanceDue: 0,
        invoicesCount: 0,
        avatarBg: newClientPayload.avatarBg || "bg-blue-600",
        status: formData.status,
        createdAt: formData.acquisitionDate || new Date().toISOString().split("T")[0],
        acquisitionDate: formData.acquisitionDate || new Date().toISOString().split("T")[0],
      };
      const updated = [newClient, ...clients];
      setClients(updated);
      saveStoredClients(updated);
      setSuccessModalData({
        isOpen: true,
        title: "Client créé avec succès !",
        message: `L'entreprise "${formData.name}" a été ajoutée à votre répertoire client.`,
        details: [
          { label: "Raison Sociale", value: formData.name },
          { label: "Email professionnel", value: formData.email },
          { label: "Date d'acquisition", value: formatDate(formData.acquisitionDate) },
          { label: "Téléphone", value: formData.phone || "Non renseigné" },
          { label: "Ville", value: formData.city },
          { label: "NINEA", value: formData.ninea || "Non renseigné" },
        ],
      });
      showToast(`Nouveau client ${formData.name} ajouté au répertoire !`);
    }

    setIsModalOpen(false);
  };

  // Memo counts for quick tabs
  const counts = useMemo(() => {
    return {
      all: clients.length,
      active: clients.filter((c) => c.status !== "inactive").length,
      inactive: clients.filter((c) => c.status === "inactive").length,
      due: clients.filter((c) => (c.balanceDue || 0) > 0).length,
    };
  }, [clients]);

  // Filtering by search & active memo
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      // Memo filter
      if (activeMemo === "active" && c.status === "inactive") return false;
      if (activeMemo === "inactive" && c.status !== "inactive") return false;
      if (activeMemo === "due" && (c.balanceDue || 0) <= 0) return false;

      // Text search
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        (c.emailPec && c.emailPec.toLowerCase().includes(term)) ||
        c.city.toLowerCase().includes(term) ||
        (c.ninea && c.ninea.toLowerCase().includes(term)) ||
        (c.phone && c.phone.includes(term))
      );
    });
  }, [clients, activeMemo, searchTerm]);

  // Sorting
  const sortedClients = useMemo(() => {
    const list = [...filteredClients];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") {
        cmp = a.name.localeCompare(b.name, "fr", { sensitivity: "base" });
      } else if (sortField === "createdAt") {
        const dateA = a.acquisitionDate || a.createdAt || "";
        const dateB = b.acquisitionDate || b.createdAt || "";
        cmp = dateA.localeCompare(dateB);
      } else if (sortField === "invoicesCount") {
        cmp = (a.invoicesCount || 0) - (b.invoicesCount || 0);
      } else if (sortField === "totalBilled") {
        cmp = (a.totalBilled || 0) - (b.totalBilled || 0);
      } else if (sortField === "balanceDue") {
        cmp = (a.balanceDue || 0) - (b.balanceDue || 0);
      } else if (sortField === "status") {
        const statusA = a.status || "active";
        const statusB = b.status || "active";
        cmp = statusA.localeCompare(statusB);
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return list;
  }, [filteredClients, sortField, sortDirection]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedClients.length / CLIENTS_PER_PAGE));
  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * CLIENTS_PER_PAGE;
    return sortedClients.slice(start, start + CLIENTS_PER_PAGE);
  }, [sortedClients, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeMemo, searchTerm, sortField, sortDirection]);

  // Handle sort column click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      // Defaults: text & dates ascending, numbers descending
      setSortDirection(field === "name" || field === "status" || field === "createdAt" ? "asc" : "desc");
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
    );
  };

  // Totals
  const totalBilledAll = clients.reduce((sum, c) => sum + (c.totalBilled || 0), 0);
  const totalDueAll = clients.reduce((sum, c) => sum + (c.balanceDue || 0), 0);

  // Export handler for Header
  const handleExport = (format: "excel" | "csv" | "pdf") => {
    const targetData = sortedClients.length > 0 ? sortedClients : clients;
    if (format === "excel") {
      exportClientsToExcel(targetData);
      setToastMessage(`Export Excel (${targetData.length} clients) téléchargé avec succès !`);
    } else if (format === "csv") {
      exportClientsToCSV(targetData);
      setToastMessage(`Export CSV (${targetData.length} clients) téléchargé avec succès !`);
    } else if (format === "pdf") {
      exportClientsToPDF(targetData);
      setToastMessage(`Rapport PDF (${targetData.length} clients) généré avec succès !`);
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

      {/* Main Content Area */}
      <div className="flex-1 md:pl-[260px] flex flex-col min-h-screen w-full max-w-full overflow-x-clip">
        <Header
          onMenuToggle={() => setMobileMenuOpen(true)}
          title={t.clients.title}
          subtitle={t.clients.subtitle}
          breadcrumb={`${t.nav.clients} / ${t.clients.title}`}
          showPeriodSelector={false}
          showExportButton={true}
          onExport={handleExport}
          exportLabel="Exporter clients"
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto overflow-hidden">
          {/* Top Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Clients Répertoriés
              </span>
              <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {clients.length} entreprises
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                Volume d&apos;affaires facturé
              </span>
              <p className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                {formatAmountWithCurrency(totalBilledAll, globalCurrency)}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
                Créances en cours
              </span>
              <p className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {formatAmountWithCurrency(totalDueAll, globalCurrency)}
              </p>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-soft overflow-hidden w-full max-w-full">
            {/* Header with Search and Add Client CTA */}
            <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Gestion des clients ({filteredClients.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Consultez les coordonnées, NINEA, WhatsApp pro et notifications légales PEC.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher nom, email, PEC..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-sm shadow-blue-500/25 transition-all whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau client</span>
                </button>
              </div>
            </div>

            {/* Status Memos / Tabs matching user requirement */}
            <div className="px-4 sm:px-6 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: "all", label: "Tous les clients", count: counts.all },
                { id: "active", label: "Clients actifs", count: counts.active },
                { id: "inactive", label: "Clients inactifs", count: counts.inactive },
                { id: "due", label: "Avec solde dû", count: counts.due },
              ].map((memo) => (
                <button
                  key={memo.id}
                  type="button"
                  onClick={() => setActiveMemo(memo.id as FilterMemo)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                    activeMemo === memo.id
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/80 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <span>{memo.label}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                      activeMemo === memo.id
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                        : "bg-slate-200/70 dark:bg-slate-800 text-slate-500"
                    )}
                  >
                    {memo.count}
                  </span>
                </button>
              ))}
            </div>

            {/* --- RESPONSIVE CARDS VIEW (Mobile & Tablet: Zero horizontal scroll) --- */}
            <div className="block lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedClients.length === 0 ? (
                <div className="py-12 text-center text-slate-400 p-4">
                  <Users className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p className="font-medium text-slate-600 dark:text-slate-300 text-sm">
                    Aucun client ne correspond aux critères
                  </p>
                </div>
              ) : (
                paginatedClients.map((client) => {
                  return (
                    <div
                      key={`mobile-${client.id}`}
                      className="p-4 space-y-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Top: Avatar, Name & Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-sm flex-shrink-0 text-white ring-1 ring-black/10 dark:ring-white/10 ${client.avatarBg}`}
                          >
                            {client.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white">
                              {client.name}
                            </p>
                            <p className="text-xs text-slate-400">{client.city}</p>
                          </div>
                        </div>

                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1",
                            client.status === "inactive"
                              ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          )}
                        >
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              client.status === "inactive" ? "bg-slate-400" : "bg-emerald-500"
                            )}
                          />
                          {client.status === "inactive" ? "Inactif" : "Actif"}
                        </span>
                      </div>

                      {/* Details: Email, PEC, Téléphone & NINEA with Copy Buttons */}
                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl">
                        {/* Email with copy button */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{client.email}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(client.email, `m-email-${client.id}`, "Email");
                            }}
                            className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors flex-shrink-0"
                            title="Copier l'adresse email"
                          >
                            {copiedKey === `m-email-${client.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {client.emailPec && (
                          <div className="flex items-center justify-between gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
                            <div className="flex items-center gap-2 min-w-0">
                              <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">PEC : {client.emailPec}</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(client.emailPec!, `m-pec-${client.id}`, "Email PEC");
                              }}
                              className="p-1 text-indigo-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors flex-shrink-0"
                              title="Copier l'email certifié PEC"
                            >
                              {copiedKey === `m-pec-${client.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}

                        {/* Phone with copy button & WhatsApp */}
                        <div className="flex items-center justify-between text-slate-500 gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{client.phone}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(client.phone, `m-phone-${client.id}`, "Téléphone");
                              }}
                              className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors flex-shrink-0"
                              title="Copier le numéro de téléphone"
                            >
                              {copiedKey === `m-phone-${client.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          {client.whatsapp && (
                            <a
                              href={`https://wa.me/${client.whatsapp.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold hover:bg-emerald-100 transition-colors flex-shrink-0"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-600" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </div>

                        {/* NINEA with copy button */}
                        {client.ninea && (
                          <div className="flex items-center justify-between text-slate-500 text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <span>NINEA :</span>
                              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                {client.ninea}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(client.ninea!, `m-ninea-${client.id}`, "NINEA");
                              }}
                              className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors flex-shrink-0"
                              title="Copier le numéro NINEA"
                            >
                              {copiedKey === `m-ninea-${client.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5 border-t border-slate-200/50 dark:border-slate-700/50">
                          <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          <span>Acquis le : <strong className="font-semibold text-slate-700 dark:text-slate-200">{formatDate(client.acquisitionDate || client.createdAt)}</strong></span>
                        </div>
                      </div>

                      {/* Bottom Financials & Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                            Facturé ({client.invoicesCount} factures)
                          </span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {formatAmountWithCurrency(client.totalBilled, globalCurrency)}
                          </span>
                        </div>

                        {client.balanceDue > 0 && (
                          <div className="text-right">
                            <span className="text-[10px] text-amber-600 uppercase font-semibold block">
                              Créance due
                            </span>
                            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                              {formatAmountWithCurrency(client.balanceDue, globalCurrency)}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(client)}
                            className="p-1.5 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100"
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(client)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <Link
                            href="/invoices/new"
                            className="p-1.5 rounded-xl bg-blue-50 text-blue-600 font-semibold"
                            title="Facturer"
                          >
                            <Receipt className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* --- DESKTOP VIEW: Structured Table (Optimized for zero horizontal scroll) --- */}
            <div className="hidden lg:block w-full overflow-hidden">
              <table className="w-full text-left text-xs table-fixed">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold select-none">
                    {/* Raison Sociale Sortable */}
                    <th
                      onClick={() => handleSort("name")}
                      className="py-3 px-3 cursor-pointer hover:text-blue-600 group transition-colors w-[20%]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Raison Sociale</span>
                        {renderSortIcon("name")}
                      </div>
                    </th>

                    <th className="py-3 px-3 w-[21%]">Coordonnées</th>

                    {/* Date d'Acquisition Sortable */}
                    <th
                      onClick={() => handleSort("createdAt")}
                      className="py-3 px-2 text-center cursor-pointer hover:text-blue-600 group transition-colors w-[11%]"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span>Acquisition</span>
                        {renderSortIcon("createdAt")}
                      </div>
                    </th>

                    {/* Factures Sortable */}
                    <th
                      onClick={() => handleSort("invoicesCount")}
                      className="py-3 px-2 text-center cursor-pointer hover:text-blue-600 group transition-colors w-[6%]"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Fact.</span>
                        {renderSortIcon("invoicesCount")}
                      </div>
                    </th>

                    {/* Total Facturé Sortable */}
                    <th
                      onClick={() => handleSort("totalBilled")}
                      className="py-3 px-3 text-right cursor-pointer hover:text-blue-600 group transition-colors w-[12%]"
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>Total Facturé</span>
                        {renderSortIcon("totalBilled")}
                      </div>
                    </th>

                    {/* Créances Dues Sortable */}
                    <th
                      onClick={() => handleSort("balanceDue")}
                      className="py-3 px-3 text-right cursor-pointer hover:text-blue-600 group transition-colors w-[11%]"
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>Créance</span>
                        {renderSortIcon("balanceDue")}
                      </div>
                    </th>

                    {/* Statut Sortable */}
                    <th
                      onClick={() => handleSort("status")}
                      className="py-3 px-2 text-center cursor-pointer hover:text-blue-600 group transition-colors w-[10%]"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Statut</span>
                        {renderSortIcon("status")}
                      </div>
                    </th>

                    <th className="py-3 px-3 text-right w-[9%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedClients.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-medium text-slate-600 text-sm">
                          Aucun client ne correspond à votre filtre.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedClients.map((client) => (
                      <tr
                        key={client.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        <td className="py-3.5 px-3">
                          <div className="flex items-start gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-sm flex-shrink-0 text-white ring-1 ring-black/10 dark:ring-white/10 mt-0.5 ${client.avatarBg}`}
                            >
                              {client.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              {/* Ligne 1: Nom */}
                              <p className="font-bold text-slate-900 dark:text-white truncate text-xs" title={client.name}>
                                {client.name}
                              </p>
                              {/* Ligne 2: Localité */}
                              <p className="text-[11px] text-slate-400 truncate">
                                {client.city}
                              </p>
                              {/* Ligne 3: NINEA */}
                              {client.ninea ? (
                                <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                                  <span className="font-medium text-slate-400">NINEA :</span>
                                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{client.ninea}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopy(client.ninea!, `d-ninea-${client.id}`, "NINEA");
                                    }}
                                    className="p-0.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
                                    title="Copier le NINEA"
                                  >
                                    {copiedKey === `d-ninea-${client.id}` ? (
                                      <Check className="w-3 h-3 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3 h-3 opacity-60 hover:opacity-100" />
                                    )}
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium truncate max-w-[140px] xl:max-w-[180px]">{client.email}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(client.email, `d-email-${client.id}`, "Email");
                              }}
                              className="p-0.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors flex-shrink-0"
                              title="Copier l'adresse email"
                            >
                              {copiedKey === `d-email-${client.id}` ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3 opacity-60 hover:opacity-100" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-2 pt-0.5">
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] text-slate-400">{client.phone}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(client.phone, `d-phone-${client.id}`, "Téléphone");
                                }}
                                className="p-0.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors flex-shrink-0"
                                title="Copier le numéro de téléphone"
                              >
                                {copiedKey === `d-phone-${client.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3 opacity-60 hover:opacity-100" />
                                )}
                              </button>
                            </div>

                            {client.whatsapp && (
                              <a
                                href={`https://wa.me/${client.whatsapp.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                                title="Ouvrir discussion WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            )}
                          </div>

                          {client.emailPec && (
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 pt-0.5">
                              <ShieldCheck className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate max-w-[130px] xl:max-w-[170px]">PEC : {client.emailPec}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(client.emailPec!, `d-pec-${client.id}`, "Email PEC");
                                }}
                                className="p-0.5 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded transition-colors flex-shrink-0"
                                title="Copier l'email PEC"
                              >
                                {copiedKey === `d-pec-${client.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3 opacity-60 hover:opacity-100" />
                                )}
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Date d'Acquisition */}
                        <td className="py-3.5 px-2 text-center text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          <p className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                            {formatDate(client.acquisitionDate || client.createdAt)}
                          </p>
                        </td>

                        <td className="py-3.5 px-2 text-center font-bold text-slate-700 dark:text-slate-300">
                          {client.invoicesCount}
                        </td>

                        <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {formatAmountWithCurrency(client.totalBilled, globalCurrency)}
                        </td>

                        <td className="py-3.5 px-3 text-right font-mono font-bold whitespace-nowrap">
                          {client.balanceDue > 0 ? (
                            <span className="text-amber-600 dark:text-amber-400">
                              {formatAmountWithCurrency(client.balanceDue, globalCurrency)}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">{formatAmountWithCurrency(0, globalCurrency)}</span>
                          )}
                        </td>

                        <td className="py-3.5 px-2 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
                              client.status === "inactive"
                                ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                client.status === "inactive" ? "bg-slate-400" : "bg-emerald-500"
                              )}
                            />
                            {client.status === "inactive" ? "Inactif" : "Actif"}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href="/invoices/new"
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                              title="Facturer ce client"
                            >
                              <Receipt className="w-4 h-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleOpenEdit(client)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                              title="Modifier"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(client)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination with numbered intervals */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={sortedClients.length}
                pageSize={CLIENTS_PER_PAGE}
                itemName="clients"
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modal: Ajouter / Modifier un client */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingClient ? "Modifier le client" : "Ajouter un nouveau client"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveClient} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom du client ou Raison Sociale *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Teranga Solutions SARL, Sunu Logistique..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email de facturation *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="compta@entreprise.sn"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Email PEC (Optionnel)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="notifications-legales@pec.sn"
                    value={formData.emailPec}
                    onChange={(e) => setFormData({ ...formData, emailPec: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900/60 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Pour l&apos;envoi d&apos;avis formels et notifications juridiques
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Téléphone principal (+221)
                  </label>
                  <input
                    type="text"
                    placeholder="+221 77 000 00 00"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Numéro WhatsApp (Optionnel)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="+221 77 845 22 10"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Ville et Date d'acquisition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ville / Commune
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Dakar - Plateau, Thiès..."
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Date d&apos;acquisition *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.acquisitionDate}
                    onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    NINEA (Optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="005489123 2G3"
                    value={formData.ninea}
                    onChange={(e) => setFormData({ ...formData, ninea: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Statut du client
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as "active" | "inactive" })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="active">Actif (autorisé à facturer)</option>
                    <option value="inactive">Inactif (archivé / suspendu)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Adresse physique
                </label>
                <input
                  type="text"
                  placeholder="Rue, Immeuble, Étage..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Statut du client
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as "active" | "inactive" })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="active">Actif (autorisé à facturer)</option>
                  <option value="inactive">Inactif (archivé / suspendu)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-xl shadow-sm shadow-blue-500/25 transition-all"
                >
                  {editingClient ? "Enregistrer les modifications" : "Créer le client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Client */}
      <ConfirmModal
        isOpen={!!deleteTargetClient}
        onClose={() => setDeleteTargetClient(null)}
        onConfirm={handleConfirmDeleteClient}
        title={`Supprimer le client ${deleteTargetClient?.name || ""} ?`}
        description="Cette action retirera ce client de votre répertoire. Ses factures et documents historiques seront toutefois conservés."
        confirmLabel="Supprimer définitivement"
        cancelLabel="Conserver le client"
        variant="danger"
        icon="trash"
      >
        {deleteTargetClient && (
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Raison sociale :</span>
              <span className="font-semibold text-slate-900 dark:text-white">{deleteTargetClient.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Email professionnel :</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{deleteTargetClient.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Solde restant dû :</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{formatFCFA(deleteTargetClient.balanceDue || 0)}</span>
            </div>
          </div>
        )}
      </ConfirmModal>

      {/* Success Modal: Client Créé / Modifié */}
      <SuccessModal
        isOpen={successModalData.isOpen}
        onClose={() => setSuccessModalData((prev) => ({ ...prev, isOpen: false }))}
        title={successModalData.title}
        message={successModalData.message}
        badgeText="Répertoire Client Mis à Jour"
        details={successModalData.details}
        closeLabel="Fermer"
      />
    </div>
  );
}
