"use client";

import React from "react";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Wallet,
  Sparkles,
} from "lucide-react";
import { DASHBOARD_METRICS, MetricCard } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { SkeletonCard } from "@/components/ui/Skeleton";

interface StatCardsProps {
  metrics?: MetricCard[];
  isLoading?: boolean;
}

export function StatCards({ metrics = DASHBOARD_METRICS, isLoading = false }: StatCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const getCardIcon = (type: MetricCard["type"]) => {
    switch (type) {
      case "billed":
        return {
          icon: Receipt,
          iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
          accentBorder: "group-hover:border-blue-400/50",
          badgeBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",
        };
      case "collected":
        return {
          icon: CheckCircle2,
          iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
          accentBorder: "group-hover:border-emerald-400/50",
          badgeBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",
        };
      case "pending":
        return {
          icon: Clock,
          iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
          accentBorder: "group-hover:border-amber-400/50",
          badgeBg: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
        };
      case "overdue":
        return {
          icon: AlertTriangle,
          iconBg: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
          accentBorder: "group-hover:border-rose-400/50",
          badgeBg: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400",
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const { icon: Icon, iconBg, accentBorder, badgeBg } = getCardIcon(metric.type);

        return (
          <div
            key={metric.title}
            className={cn(
              "group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft hover:shadow-md transition-all duration-200",
              accentBorder
            )}
          >
            {/* Top row: Title and Icon */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {metric.title}
              </span>
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                  iconBg
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Main Value */}
            <div className="space-y-1 mb-3">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {metric.value}
              </h3>
            </div>

            {/* Bottom row: Trend badge & Contextual note */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-xs",
                    badgeBg
                  )}
                >
                  {metric.isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : metric.type === "overdue" ? (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  {metric.change}
                </span>
                <span className="text-slate-500 dark:text-slate-400 truncate text-[11px]">
                  {metric.period}
                </span>
              </div>
            </div>

            {/* Progress indication for visual delight */}
            {metric.type === "collected" && (
              <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: "61.9%" }}
                />
              </div>
            )}
            {metric.type === "pending" && (
              <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: "38.1%" }}
                />
              </div>
            )}
            {metric.type === "billed" && (
              <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: "85%" }}
                />
              </div>
            )}
            {metric.type === "overdue" && (
              <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: "8.3%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
