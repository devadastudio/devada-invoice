"use client";

import React from "react";
import { LeadStatus } from "@/lib/mock-data";

export type LeadFilterType = "all" | LeadStatus;

interface LeadFilterTabsProps {
  currentFilter: LeadFilterType;
  onFilterChange: (filter: LeadFilterType) => void;
  counts: {
    all: number;
    new: number;
    contacted: number;
    replied: number;
    converted: number;
    ignored: number;
  };
}

export function LeadFilterTabs({
  currentFilter,
  onFilterChange,
  counts,
}: LeadFilterTabsProps) {
  const tabs: { id: LeadFilterType; label: string; count: number }[] = [
    { id: "all", label: "Tous", count: counts.all },
    { id: "new", label: "Nouveaux", count: counts.new },
    { id: "contacted", label: "Contactés", count: counts.contacted },
    { id: "replied", label: "Ont répondu", count: counts.replied },
    { id: "converted", label: "Convertis", count: counts.converted },
    { id: "ignored", label: "Ignorés", count: counts.ignored },
  ];

  return (
    <div className="w-full max-w-full overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2">
        {tabs.map((tab) => {
          const isActive = currentFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
