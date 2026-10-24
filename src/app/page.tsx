"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StatCards } from "@/components/dashboard/StatCards";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";
import { CreateInvoiceModal } from "@/components/invoices/CreateInvoiceModal";
import {
  Sparkles,
  TrendingUp,
  Receipt,
  FileCheck,
  ShieldCheck,
} from "lucide-react";
import { MetricCard, getStoredSettings } from "@/lib/mock-data";
import { formatFCFA, formatAmountWithCurrency } from "@/lib/utils";
import { usePlatformLanguage } from "@/lib/i18n";
import { PERIOD_METRICS_MAP } from "@/lib/period-metrics";

export default function DashboardPage() {
  const { lang, t } = usePlatformLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
  const [selectedPeriodId, setSelectedPeriodId] = useState("oct-2026");
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [globalCurrency, setGlobalCurrency] = useState<string>("FCFA");

  useEffect(() => {
    const loadCurrency = () => {
      const settings = getStoredSettings();
      if (settings?.currency) {
        setGlobalCurrency(settings.currency);
      }
    };
    loadCurrency();
    window.addEventListener("settings_updated", loadCurrency);
    window.addEventListener("storage", loadCurrency);
    return () => {
      window.removeEventListener("settings_updated", loadCurrency);
      window.removeEventListener("storage", loadCurrency);
    };
  }, []);

  const handlePeriodChange = (periodId: string) => {
    setSelectedPeriodId(periodId);
    setIsDataLoading(true);
    // Smooth skeleton loader transition
    setTimeout(() => {
      setIsDataLoading(false);
    }, 380);
  };

  const periodStats =
    PERIOD_METRICS_MAP[selectedPeriodId] || PERIOD_METRICS_MAP["oct-2026"];

  const dynamicMetrics: MetricCard[] = useMemo(() => {
    return [
      {
        title: t.dashboard.billedAmount,
        value: formatAmountWithCurrency(periodStats.billed, globalCurrency),
        rawAmount: periodStats.billed,
        change: "+14.2%",
        isPositive: true,
        period: "sur la période",
        description: `Total des factures de ${periodStats.periodLabel}`,
        type: "billed",
      },
      {
        title: t.dashboard.collectedAmount,
        value: formatAmountWithCurrency(periodStats.collected, globalCurrency),
        rawAmount: periodStats.collected,
        change: periodStats.rate,
        isPositive: true,
        period: "taux de recouvrement",
        description: `${periodStats.periodLabel} : règlements reçus`,
        type: "collected",
      },
      {
        title: t.dashboard.pendingAmount,
        value: formatAmountWithCurrency(periodStats.pending, globalCurrency),
        rawAmount: periodStats.pending,
        change: `${periodStats.invoicesCount} factures`,
        isPositive: false,
        period: "en cours d'échéance",
        description: "Solde restant dû à recouvrer",
        type: "pending",
      },
      {
        title: t.dashboard.overdueAmount,
        value: `${periodStats.invoicesCount} factures`,
        rawAmount: periodStats.overdue,
        change: `${periodStats.overdueCount} en retard`,
        isPositive: false,
        period: `${formatAmountWithCurrency(periodStats.overdue, globalCurrency)} à recouvrer`,
        description: "Suivi des impayés et relances",
        type: "overdue",
      },
    ];
  }, [periodStats, globalCurrency, t]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex w-full max-w-full overflow-x-clip">
      {/* Navigation Sidebar (Desktop fixed + Mobile slide-over) */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        onNewInvoice={() => setCreateInvoiceOpen(true)}
      />

      {/* Main Content Area (offset by 260px on desktop) */}
      <div className="flex-1 md:pl-[260px] flex flex-col min-h-screen w-full max-w-full overflow-x-clip">
        {/* Top Sticky Header with interactive Period Filter (NO "Nouvelle facture" CTA) */}
        <Header
          title={t.dashboard.title}
          subtitle={t.dashboard.subtitle}
          onMenuToggle={() => setMobileMenuOpen(true)}
          selectedPeriodId={selectedPeriodId}
          onPeriodChange={handlePeriodChange}
        />

        {/* Page Body */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto overflow-hidden">
          {/* Welcome & Financial Health Banner (WITHOUT the "Créer une facture" CTA button) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 shadow-sm">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold backdrop-blur-sm border border-blue-400/20">
                  <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                  <span>Sénégal • {globalCurrency} • {periodStats.periodLabel}</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
                  Résumé de votre activité en temps réel
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Votre trésorerie est saine pour la période de{" "}
                  <strong className="text-white">{periodStats.periodLabel}</strong> :{" "}
                  <span className="font-bold text-emerald-400 font-mono">
                    {formatAmountWithCurrency(periodStats.collected, globalCurrency)}
                  </span>{" "}
                  déjà encaissés avec un taux de recouvrement de{" "}
                  <strong className="text-white">{periodStats.rate}</strong>.
                </p>
              </div>
            </div>

            {/* Subtle decorative background pattern */}
            <div className="absolute -right-8 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* 4 Primary KPI Stat Cards with Skeleton Loading */}
          <section aria-label="Statistiques clés" className="w-full">
            <StatCards metrics={dynamicMetrics} isLoading={isDataLoading} />
          </section>

          {/* Revenue and Collection Chart + Top Clients (With Skeleton Loading) */}
          <section aria-label="Évolution financière" className="w-full">
            <RevenueChart
              selectedPeriodId={selectedPeriodId}
              isLoading={isDataLoading}
              globalCurrency={globalCurrency}
            />
          </section>

          {/* Recent Invoices Table with Pagination & Live Updates */}
          <section aria-label="Dernières factures" className="w-full">
            <RecentInvoices selectedPeriodId={selectedPeriodId} />
          </section>
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200/60 dark:border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 dark:text-slate-500">
          <p>
            Devada Invoice SaaS © 2026 — Plateforme de facturation et gestion financière pour entrepreneurs africains.
          </p>
        </footer>
      </div>

      {/* Quick Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={createInvoiceOpen}
        onClose={() => setCreateInvoiceOpen(false)}
      />
    </div>
  );
}
