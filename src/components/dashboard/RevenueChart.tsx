"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  BarChart2,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Smartphone,
  Building,
  CheckCircle2,
} from "lucide-react";
import { TOP_CLIENTS, getStoredSettings, Invoice } from "@/lib/mock-data";
import {
  formatFCFA,
  formatAmountWithCurrency,
  convertCurrency,
  SupportedCurrency,
} from "@/lib/utils";
import { SkeletonChart } from "@/components/ui/Skeleton";
import { getChartBreakdownForPeriod, PeriodMetricData } from "@/lib/period-metrics";

// Distinct high-contrast colors for client avatars
const CLIENT_AVATARS = [
  { bg: "bg-blue-600", text: "text-white" },
  { bg: "bg-violet-600", text: "text-white" },
  { bg: "bg-emerald-600", text: "text-white" },
  { bg: "bg-amber-600", text: "text-white" },
];

interface RevenueChartProps {
  selectedPeriodId?: string;
  isLoading?: boolean;
  globalCurrency?: string;
  invoices?: Invoice[];
  periodStats?: PeriodMetricData;
}

export function RevenueChart({
  selectedPeriodId = "oct-2026",
  isLoading = false,
  globalCurrency = "FCFA",
  invoices,
  periodStats,
}: RevenueChartProps) {
  const [activeCurrency, setActiveCurrency] = useState<string>(() => {
    return globalCurrency || getStoredSettings().currency || "FCFA";
  });

  useEffect(() => {
    if (globalCurrency) {
      setActiveCurrency(globalCurrency);
    }
  }, [globalCurrency]);

  useEffect(() => {
    const load = () => {
      const s = getStoredSettings();
      if (s?.currency) {
        setActiveCurrency(s.currency);
      }
    };
    window.addEventListener("settings_updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("settings_updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  // Chart breakdown data according to selected period
  const chartData = useMemo(() => {
    return getChartBreakdownForPeriod(selectedPeriodId, periodStats);
  }, [selectedPeriodId, periodStats]);

  // Dynamic Top Clients from real invoices
  const dynamicTopClients = useMemo(() => {
    if (invoices && invoices.length > 0) {
      const clientMap = new Map<
        string,
        { id: string; name: string; city: string; totalBilled: number; invoicesCount: number }
      >();
      for (const inv of invoices) {
        const name = inv.clientName?.trim() || "Client";
        const existing = clientMap.get(name) || {
          id: name,
          name,
          city: inv.clientCity || "Dakar",
          totalBilled: 0,
          invoicesCount: 0,
        };
        existing.totalBilled += Number(inv.amountTTC) || 0;
        existing.invoicesCount += 1;
        clientMap.set(name, existing);
      }
      return Array.from(clientMap.values())
        .sort((a, b) => b.totalBilled - a.totalBilled)
        .slice(0, 4);
    }
    return TOP_CLIENTS;
  }, [invoices]);

  // Selected bar item ID within the period (or null for whole period total)
  const [selectedBarId, setSelectedBarId] = useState<string | null>(null);

  // Reset selected bar when period filter changes
  useEffect(() => {
    setSelectedBarId(null);
  }, [selectedPeriodId]);

  if (isLoading) {
    return <SkeletonChart />;
  }

  const activeBar = selectedBarId
    ? chartData.bars.find((b) => b.id === selectedBarId) || null
    : null;

  // Active display values: either specific clicked bar or the whole period totals
  const displayTitle = activeBar
    ? activeBar.label
    : `${chartData.periodLabel} (Total période)`;
  const displayBilled = activeBar ? activeBar.billed : chartData.totals.billed;
  const displayCollected = activeBar ? activeBar.collected : chartData.totals.collected;
  const displayPending = activeBar ? activeBar.pending : chartData.totals.pending;

  const maxVal = chartData.yCeiling;

  const isEur = activeCurrency.includes("EUR") || activeCurrency === "€";
  const isUsd = activeCurrency.includes("USD") || activeCurrency === "$";
  const targetCurr: SupportedCurrency = isEur ? "EUR" : isUsd ? "USD" : "FCFA";

  const convertedMaxVal = activeCurrency === "FCFA"
    ? maxVal
    : convertCurrency(maxVal, "FCFA", targetCurr);

  // Dynamic Y-axis labels
  const formatYAxis = (val: number) => {
    if (val >= 1000000) {
      const m = val / 1000000;
      return Number.isInteger(m) ? `${m}M` : `${m.toFixed(1)}M`;
    }
    if (val >= 1000) {
      const k = val / 1000;
      return Number.isInteger(k) ? `${k}k` : `${k.toFixed(1)}k`;
    }
    return Math.round(val).toString();
  };

  const yLabels = [
    formatYAxis(convertedMaxVal),
    formatYAxis(convertedMaxVal * 0.75),
    formatYAxis(convertedMaxVal * 0.5),
    formatYAxis(convertedMaxVal * 0.25),
    "0",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-full">
      {/* Main Bar Chart: Facturation vs Encaissement */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-soft flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Facturation & Encaissements
              </h3>
              {/* Dynamic Period Badge updating automatically with the header period dropdown */}
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 shadow-xs">
                {chartData.periodLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Comparaison entre montants facturés et règlements encaissés (en {activeCurrency}).
            </p>
          </div>

          {/* Clean Legend without duplicated amounts */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5" title="Montants facturés">
              <span className="w-3 h-3 rounded-md bg-blue-600 flex-shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">Facturé</span>
            </div>
            <div className="flex items-center gap-1.5" title="Montants encaissés">
              <span className="w-3 h-3 rounded-md bg-emerald-500 flex-shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">Encaissé</span>
            </div>
          </div>
        </div>

        {/* Selected Period / Bar Summary Banner */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-5 flex flex-wrap items-center justify-between gap-3 text-xs border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span className="font-bold text-slate-900 dark:text-white">
              {displayTitle}
            </span>
            {activeBar && (
              <button
                onClick={() => setSelectedBarId(null)}
                className="text-[10px] text-blue-600 dark:text-blue-400 underline font-semibold ml-1 hover:text-blue-800"
              >
                (Voir total période)
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
                Facturé
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                {formatAmountWithCurrency(displayBilled, activeCurrency)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
                Encaissé
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {formatAmountWithCurrency(displayCollected, activeCurrency)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
                Solde dû
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                {formatAmountWithCurrency(displayPending, activeCurrency)}
              </span>
            </div>
          </div>
        </div>

        {/* Chart Layout: Left Y-Axis Column + Right Grid & Bars */}
        <div className="flex h-64 gap-2 sm:gap-4 pt-2">
          {/* Dedicated Left Y-Axis */}
          <div className="w-12 sm:w-16 flex flex-col justify-between text-right text-[10px] sm:text-[11px] font-mono font-medium text-slate-400 select-none pb-7 pr-1">
            {yLabels.map((yl, idx) => (
              <span key={`y-${idx}`}>{yl}</span>
            ))}
          </div>

          {/* Right Main Chart Container */}
          <div className="flex-1 relative flex flex-col justify-between">
            {/* Horizontal Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7">
              <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full" />
              <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full" />
              <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full" />
              <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full" />
              <div className="border-b border-slate-200 dark:border-slate-800 w-full" />
            </div>

            {/* Dynamic Bar Groups adapted to period count */}
            <div
              className={`relative z-10 grid gap-2 sm:gap-4 h-full items-end pb-7 ${
                chartData.bars.length === 3
                  ? "grid-cols-3"
                  : chartData.bars.length === 4
                  ? "grid-cols-4"
                  : "grid-cols-6"
              }`}
            >
              {chartData.bars.map((item) => {
                const billedHeight = Math.min(
                  100,
                  Math.max(10, Math.round((item.billed / maxVal) * 100))
                );
                const collectedHeight = Math.min(
                  100,
                  Math.max(8, Math.round((item.collected / maxVal) * 100))
                );
                const isSelected = selectedBarId === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() =>
                      setSelectedBarId(selectedBarId === item.id ? null : item.id)
                    }
                    className="flex flex-col items-center h-full justify-end cursor-pointer group"
                    title={`${item.label} : ${formatAmountWithCurrency(item.billed, activeCurrency)} facturés, ${formatAmountWithCurrency(item.collected, activeCurrency)} encaissés`}
                  >
                    <div className="flex items-end gap-1 sm:gap-2.5 w-full justify-center h-full pb-1">
                      {/* Billed bar */}
                      <div
                        style={{ height: `${billedHeight}%` }}
                        className={`w-3 sm:w-5 md:w-6 rounded-t-md transition-all duration-300 relative group-hover:brightness-110 ${
                          isSelected
                            ? "bg-blue-600 shadow-lg shadow-blue-500/35 ring-2 ring-blue-400"
                            : "bg-blue-500/90 dark:bg-blue-600/80"
                        }`}
                      >
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-mono py-1 px-2 rounded-lg whitespace-nowrap pointer-events-none transition-opacity z-30 shadow-xl border border-slate-700">
                          {formatAmountWithCurrency(item.billed, activeCurrency)}
                        </div>
                      </div>

                      {/* Collected bar */}
                      <div
                        style={{ height: `${collectedHeight}%` }}
                        className={`w-3 sm:w-5 md:w-6 rounded-t-md transition-all duration-300 relative group-hover:brightness-110 ${
                          isSelected
                            ? "bg-emerald-500 shadow-lg shadow-emerald-500/35 ring-2 ring-emerald-300"
                            : "bg-emerald-400/90 dark:bg-emerald-500/80"
                        }`}
                      >
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-mono py-1 px-2 rounded-lg whitespace-nowrap pointer-events-none transition-opacity z-30 shadow-xl border border-slate-700">
                          {formatAmountWithCurrency(item.collected, activeCurrency)}
                        </div>
                      </div>
                    </div>

                    {/* Bar Label below the axis */}
                    <span
                      className={`text-[11px] sm:text-xs font-medium mt-2 transition-colors truncate max-w-full text-center ${
                        isSelected
                          ? "text-blue-600 dark:text-blue-400 font-bold"
                          : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                      }`}
                    >
                      {item.shortLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info updating with period */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            Taux de recouvrement {chartData.periodLabel} :{" "}
            <strong className="text-slate-800 dark:text-slate-200 font-bold font-mono">
              {chartData.rate}
            </strong>
          </span>
          <span className="hidden sm:inline text-[11px] text-slate-400">
            Cliquez sur une barre pour inspecter les montants détaillés
          </span>
        </div>
      </div>

      {/* Side Card: Top Clients (High Contrast Avatars) & Payment Gateways */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-soft flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Top Clients par C.A.
            </h3>
            <Link
              href="/clients"
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Voir tous les clients
            </Link>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Vos clients les plus fidèles sur l&apos;exercice en cours ({chartData.periodLabel}).
          </p>

          <div className="space-y-3.5">
            {dynamicTopClients.map((client, index) => {
              const avatarStyle = CLIENT_AVATARS[index % CLIENT_AVATARS.length];
              return (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Ultra high-contrast client badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-sm flex-shrink-0 ring-1 ring-black/5 dark:ring-white/10 ${avatarStyle.bg} ${avatarStyle.text}`}
                    >
                      {client.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {client.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {client.invoicesCount} factures • {client.city}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {formatAmountWithCurrency(client.totalBilled, activeCurrency)}
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Réglé à 100%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Payment Gateways summary */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Moyens de paiement actifs
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold text-[11px] border border-sky-200/70 dark:border-sky-800">
              Wave 🌊
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-semibold text-[11px] border border-orange-200/70 dark:border-orange-800">
              Orange Money 🍊
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] border border-emerald-200/70 dark:border-emerald-800">
              Virement 🏦
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
