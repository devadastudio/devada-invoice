"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CreateInvoiceModal } from "@/components/invoices/CreateInvoiceModal";
import { useAuth } from "@/lib/supabase/auth-context";
import {
  fetchLeads,
  fetchLeadSearches,
  fetchCompanySettings,
  updateLeadStatus,
  deleteLead,
  deleteLeadSearch,
  convertLeadToClient,
} from "@/lib/supabase/db";
import { Lead, LeadSearch, LeadStatus, CompanySettings } from "@/lib/mock-data";
import { exportLeadsToCSV } from "@/lib/export-utils";
import { usePlatformLanguage } from "@/lib/i18n";
import { LeadStatsCards } from "@/components/leads/LeadStatsCards";
import { LeadSearchForm } from "@/components/leads/LeadSearchForm";
import { LeadFilterTabs, LeadFilterType } from "@/components/leads/LeadFilterTabs";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { LeadMobileCards } from "@/components/leads/LeadMobileCards";
import { LeadMessageModal } from "@/components/leads/LeadMessageModal";
import { LeadSearchHistoryModal } from "@/components/leads/LeadSearchHistoryModal";
import { BatchActionsBar } from "@/components/leads/BatchActionsBar";
import {
  Target,
  Search,
  Download,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react";
import { generateWhatsAppLink, sanitizeWhatsAppNumber } from "@/lib/utils";

export default function LeadsPage() {
  const { user } = useAuth();
  const { t } = usePlatformLanguage();

  // Navigation & modals
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);

  // Data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searches, setSearches] = useState<LeadSearch[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Active search / polling
  const [runningSearchId, setRunningSearchId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatusText, setSearchStatusText] = useState<string>("");

  // Filters & selection
  const [currentFilter, setCurrentFilter] = useState<LeadFilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeSearchIdFilter, setActiveSearchIdFilter] = useState<string | null>(null);

  // Modals
  const [selectedLeadForMessage, setSelectedLeadForMessage] = useState<Lead | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type?: "success" | "info" | "error";
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  const showToast = useCallback(
    (
      text: string,
      type: "success" | "info" | "error" = "success",
      actionLabel?: string,
      onAction?: () => void
    ) => {
      setToastMessage({ text, type, actionLabel, onAction });
      setTimeout(() => {
        setToastMessage((prev) => (prev?.text === text ? null : prev));
      }, 5000);
    },
    []
  );

  // 1. Charger les données au montage
  const loadData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const [leadsData, searchesData, settingsData] = await Promise.all([
        fetchLeads(user.id),
        fetchLeadSearches(user.id),
        fetchCompanySettings(user.id),
      ]);

      setLeads(leadsData);
      setSearches(searchesData);
      setSettings(settingsData);

      // Vérifier si une recherche était en cours
      const pendingSearch = searchesData.find((s) => s.status === "running");
      if (pendingSearch) {
        setRunningSearchId(pendingSearch.id);
        setIsSearching(true);
        setSearchStatusText(`Scraping en cours : ${pendingSearch.query} (${pendingSearch.city})...`);
      }
    } catch (err) {
      console.error("Erreur chargement leads:", err);
      showToast("Erreur lors du chargement des prospects", "error");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 2. Polling du statut de la recherche toutes les 4s
  useEffect(() => {
    if (!runningSearchId) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/leads/search/${runningSearchId}`);
        if (!res.ok) return;

        const data = await res.json();
        if (!isMounted) return;

        if (data.status === "SUCCEEDED" || data.status === "succeeded") {
          setIsSearching(false);
          setRunningSearchId(null);
          setSearchStatusText("");
          showToast(`Extraction terminée ! ${data.importedCount || 0} nouveaux prospects importés.`);

          // Recharger les données fraîches
          if (user?.id) {
            const [updatedLeads, updatedSearches] = await Promise.all([
              fetchLeads(user.id),
              fetchLeadSearches(user.id),
            ]);
            setLeads(updatedLeads);
            setSearches(updatedSearches);
          }
        } else if (data.status === "FAILED" || data.status === "failed") {
          setIsSearching(false);
          setRunningSearchId(null);
          setSearchStatusText("");
          showToast(data.error || "La recherche a échoué chez Apify.", "error");

          if (user?.id) {
            const updatedSearches = await fetchLeadSearches(user.id);
            setSearches(updatedSearches);
          }
        } else {
          setSearchStatusText("Scraping Google Maps en cours via Apify... (~30s à 1min)");
        }
      } catch (err) {
        console.error("Erreur polling recherche:", err);
      }
    }, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [runningSearchId, user?.id, showToast]);

  // 3. Déclencher une nouvelle recherche
  const handleStartSearch = async (params: {
    query: string;
    city: string;
    senderSector?: string;
    prospectingPitch?: string;
    maxResults: number;
  }) => {
    setIsSearching(true);
    setSearchStatusText(`Lancement de l'extraction Google Maps pour « ${params.query} » à ${params.city}...`);

    try {
      const res = await fetch("/api/leads/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors du lancement de la recherche");
      }

      if (data.reused) {
        showToast("Recherche identique récente réutilisée (< 7 jours). Données actualisées !", "info");
        setIsSearching(false);
        setSearchStatusText("");
        if (user?.id) {
          const freshLeads = await fetchLeads(user.id);
          setLeads(freshLeads);
        }
        return;
      }

      if (data.searchId) {
        setRunningSearchId(data.searchId);
        showToast("Scraping lancé en arrière-plan avec succès.", "info");
        // Rafraîchir la liste des recherches
        if (user?.id) {
          const updatedSearches = await fetchLeadSearches(user.id);
          setSearches(updatedSearches);
        }
      }
    } catch (err: any) {
      console.error("Erreur lancement recherche:", err);
      setIsSearching(false);
      setSearchStatusText("");
      showToast(err.message || "Erreur de connexion", "error");
    }
  };

  // 4. Filtrage dynamique des leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Filtre de recherche historique
      if (activeSearchIdFilter && lead.searchId !== activeSearchIdFilter) {
        return false;
      }

      // Filtre statut onglet
      if (currentFilter !== "all" && lead.status !== currentFilter) {
        return false;
      }

      // Filtre texte recherche
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = lead.name.toLowerCase().includes(q);
        const matchesCat = lead.category?.toLowerCase().includes(q);
        const matchesPhone = lead.phone?.toLowerCase().includes(q);
        const matchesCity = lead.city?.toLowerCase().includes(q) || lead.address?.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesPhone && !matchesCity) {
          return false;
        }
      }

      return true;
    });
  }, [leads, activeSearchIdFilter, currentFilter, searchTerm]);

  // Compteurs pour les onglets
  const counts = useMemo(() => {
    const base = activeSearchIdFilter
      ? leads.filter((l) => l.searchId === activeSearchIdFilter)
      : leads;

    return {
      all: base.length,
      new: base.filter((l) => l.status === "new").length,
      contacted: base.filter((l) => l.status === "contacted").length,
      replied: base.filter((l) => l.status === "replied").length,
      converted: base.filter((l) => l.status === "converted").length,
      ignored: base.filter((l) => l.status === "ignored").length,
    };
  }, [leads, activeSearchIdFilter]);

  // 5. Gestion de la sélection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredLeads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLeads.map((l) => l.id));
    }
  };

  // 6. Actions sur les leads
  const handleOpenMessageModal = (lead: Lead) => {
    setSelectedLeadForMessage(lead);
    setIsMessageModalOpen(true);
  };

  const handleOpenWhatsApp = (lead: Lead) => {
    if (!lead.phone) return;
    const sanitized = sanitizeWhatsAppNumber(lead.phone);
    if (!sanitized) return;

    // Récupérer le dernier message généré si existant
    const lastMsg = lead.messages && lead.messages.length > 0 ? lead.messages[0].content : "";
    const url = generateWhatsAppLink(sanitized, lastMsg);
    window.open(url, "_blank");

    // Passer en "contacted"
    handleStatusChange(lead.id, "contacted");
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    const success = await updateLeadStatus(leadId, newStatus);
    if (!success) {
      showToast("Erreur lors de la mise à jour du statut", "error");
      loadData();
    }
  };

  const handleToggleIgnore = (lead: Lead) => {
    const newStatus: LeadStatus = lead.status === "ignored" ? "new" : "ignored";
    handleStatusChange(lead.id, newStatus);
    showToast(
      newStatus === "ignored"
        ? `« ${lead.name} » déplacé dans les ignorés.`
        : `« ${lead.name} » rétabli.`
    );
  };

  const handleDeleteLead = async (lead: Lead) => {
    if (!confirm(`Supprimer définitivement le prospect « ${lead.name} » ?`)) return;

    setLeads((prev) => prev.filter((l) => l.id !== lead.id));
    setSelectedIds((prev) => prev.filter((id) => id !== lead.id));

    const success = await deleteLead(lead.id);
    if (success) {
      showToast(`Prospect « ${lead.name} » supprimé.`);
    } else {
      showToast("Erreur lors de la suppression", "error");
      loadData();
    }
  };

  const handleConvertToClient = async (lead: Lead) => {
    if (!user?.id) return;
    const { client, error } = await convertLeadToClient(lead, user.id);
    if (client) {
      // Mettre à jour le statut en converted
      setLeads((prev) =>
        prev.map((l) =>
          l.id === lead.id
            ? { ...l, status: "converted", convertedClientId: client.id }
            : l
        )
      );
      showToast(
        `Client « ${client.name} » créé avec succès !`,
        "success",
        "Créer une facture",
        () => setCreateInvoiceOpen(true)
      );
    } else {
      showToast(error || "Impossible de convertir ce prospect en client", "error");
    }
  };

  // 7. Actions groupées
  const handleBatchGenerate = async () => {
    if (selectedIds.length === 0) return;
    const batch = selectedIds.slice(0, 10);
    setIsBatchGenerating(true);

    try {
      const res = await fetch("/api/leads/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadIds: batch,
          channel: "whatsapp",
          tone: "professional",
          senderSector: settings?.businessSector,
          prospectingPitch: settings?.prospectingPitch,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de génération");

      showToast(`${data.resultsCount || batch.length} messages générés avec succès !`);
      if (user?.id) {
        const freshLeads = await fetchLeads(user.id);
        setLeads(freshLeads);
      }
    } catch (err: any) {
      console.error("Erreur batch generate:", err);
      showToast(err.message || "Erreur de génération par lot", "error");
    } finally {
      setIsBatchGenerating(false);
    }
  };

  const handleExportCSV = () => {
    const leadsToExport =
      selectedIds.length > 0
        ? leads.filter((l) => selectedIds.includes(l.id))
        : filteredLeads;

    if (leadsToExport.length === 0) {
      showToast("Aucun prospect à exporter", "info");
      return;
    }

    const city = leadsToExport[0]?.city || "Senegal";
    exportLeadsToCSV(leadsToExport, city);
    showToast(`${leadsToExport.length} prospects exportés en CSV avec succès.`);
  };

  // 8. Gestion de l'historique
  const handleDeleteSearch = async (searchId: string) => {
    setSearches((prev) => prev.filter((s) => s.id !== searchId));
    if (activeSearchIdFilter === searchId) {
      setActiveSearchIdFilter(null);
    }
    const success = await deleteLeadSearch(searchId);
    if (success) {
      showToast("Recherche et prospects associés supprimés.");
      if (user?.id) {
        const freshLeads = await fetchLeads(user.id);
        setLeads(freshLeads);
      }
    }
  };

  const activeSearch = searches.find((s) => s.id === activeSearchIdFilter);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex w-full max-w-full overflow-x-clip">
      {/* Sidebar Universelle */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        onNewInvoice={() => setCreateInvoiceOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 md:pl-[260px] flex flex-col min-h-screen w-full max-w-full overflow-x-clip">
        {/* Header Standardisé */}
        <Header
          title={t.leads.title}
          subtitle={t.leads.subtitle}
          onMenuToggle={() => setMobileMenuOpen(true)}
        />

        {/* Corps de la page */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto overflow-hidden">
          {/* Bandeau d'état de recherche active / Scraping en cours */}
          {isSearching && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md flex items-center justify-between gap-3 animate-pulse">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-bold">
                    {searchStatusText || "Extraction Google Maps en cours..."}
                  </p>
                  <p className="text-[11px] text-blue-100">
                    Les résultats s'afficheront automatiquement dès la fin du crawl. Vous pouvez continuer d'utiliser l'application.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Formulaire de Recherche */}
          <LeadSearchForm
            onSearch={handleStartSearch}
            isSearching={isSearching}
            defaultSenderSector={settings?.businessSector || ""}
            defaultPitch={settings?.prospectingPitch || ""}
            onOpenHistory={() => setIsHistoryOpen(true)}
            searchesCount={searches.length}
          />

          {/* KPI Cards */}
          <LeadStatsCards leads={leads} isLoading={isLoading} />

          {/* Filtre actif de recherche historique */}
          {activeSearch && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 dark:text-blue-300">
                <Target className="w-4 h-4 text-blue-600" />
                <span>
                  Vue filtrée sur la recherche : « {activeSearch.query} » ({activeSearch.city})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveSearchIdFilter(null)}
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                <span>Afficher tout</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Conteneur principal de la liste des leads */}
          <div className="space-y-4">
            {/* Barre de contrôle : Recherche textuelle + Export CSV */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filtrer nom, catégorie, tél, ville..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-soft"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={leads.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all disabled:opacity-50 shadow-soft"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Exporter CSV</span>
                </button>
              </div>
            </div>

            {/* Onglets de Statut */}
            <LeadFilterTabs
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
              counts={counts}
            />

            {/* Vue Desktop : Tableau */}
            <LeadsTable
              leads={filteredLeads}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              onGenerateMessage={handleOpenMessageModal}
              onOpenWhatsApp={handleOpenWhatsApp}
              onConvertToClient={handleConvertToClient}
              onToggleIgnore={handleToggleIgnore}
              onDelete={handleDeleteLead}
              isLoading={isLoading}
            />

            {/* Vue Mobile : Cartes verticales sans aucun scroll horizontal */}
            <LeadMobileCards
              leads={filteredLeads}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onGenerateMessage={handleOpenMessageModal}
              onOpenWhatsApp={handleOpenWhatsApp}
              onConvertToClient={handleConvertToClient}
              onToggleIgnore={handleToggleIgnore}
              onDelete={handleDeleteLead}
              isLoading={isLoading}
            />
          </div>
        </main>

        {/* Footer Universel */}
        <footer className="border-t border-slate-200/60 dark:border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 dark:text-slate-500">
          <p>
            Devada Invoice SaaS © 2026 — Plateforme de facturation et gestion financière pour entrepreneurs africains.
          </p>
        </footer>
      </div>

      {/* Barre d'actions groupées flottante */}
      <BatchActionsBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBatchGenerate={handleBatchGenerate}
        onExportCSV={handleExportCSV}
        isGenerating={isBatchGenerating}
      />

      {/* Modale de message IA individuel */}
      <LeadMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => {
          setIsMessageModalOpen(false);
          setSelectedLeadForMessage(null);
        }}
        lead={selectedLeadForMessage}
        senderSector={settings?.businessSector}
        prospectingPitch={settings?.prospectingPitch}
        onLeadContacted={(leadId) => handleStatusChange(leadId, "contacted")}
        onSaveMessageSuccess={(leadId, content) => {
          setLeads((prev) =>
            prev.map((l) =>
              l.id === leadId
                ? {
                    ...l,
                    messages: [
                      {
                        id: `temp-${Date.now()}`,
                        userId: user?.id || "",
                        leadId,
                        channel: "whatsapp",
                        tone: "professional",
                        content,
                        createdAt: new Date().toISOString(),
                      },
                      ...(l.messages || []),
                    ],
                  }
                : l
            )
          );
        }}
      />

      {/* Modale d'historique des recherches */}
      <LeadSearchHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        searches={searches}
        onSelectSearch={(s) => setActiveSearchIdFilter(s.id)}
        onDeleteSearch={handleDeleteSearch}
        activeSearchId={activeSearchIdFilter}
      />

      {/* Modale de Création Rapide de Facture */}
      <CreateInvoiceModal
        isOpen={createInvoiceOpen}
        onClose={() => setCreateInvoiceOpen(false)}
      />

      {/* Toast Notification Flottante */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 shadow-2xl border border-slate-700/60 dark:border-slate-200 text-xs font-semibold animate-in slide-in-from-bottom-5 fade-in duration-200 max-w-sm">
          {toastMessage.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-rose-400 dark:text-rose-600 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          )}
          <span className="flex-1">{toastMessage.text}</span>
          {toastMessage.actionLabel && toastMessage.onAction && (
            <button
              type="button"
              onClick={() => {
                toastMessage.onAction?.();
                setToastMessage(null);
              }}
              className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500 text-[11px] font-bold transition-colors"
            >
              {toastMessage.actionLabel}
            </button>
          )}
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 text-slate-400 hover:text-white dark:hover:text-slate-900 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
