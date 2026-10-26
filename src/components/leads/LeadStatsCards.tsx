"use client";

import React from "react";
import { Target, Phone, Globe, UserCheck } from "lucide-react";
import { Lead } from "@/lib/mock-data";

interface LeadStatsCardsProps {
  leads: Lead[];
  isLoading?: boolean;
}

export function LeadStatsCards({ leads, isLoading = false }: LeadStatsCardsProps) {
  const totalLeads = leads.length;
  const withPhone = leads.filter((l) => Boolean(l.phone)).length;
  const withoutWebsite = leads.filter((l) => !l.website).length;
  const converted = leads.filter((l) => l.status === "converted").length;

  const stats = [
    {
      title: "Prospects qualifiés",
      value: totalLeads,
      subtext: "Scrapés sur Google Maps",
      icon: Target,
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-950/60 border-blue-200/60 dark:border-blue-800/60",
    },
    {
      title: "Avec Téléphone / WhatsApp",
      value: withPhone,
      subtext: totalLeads > 0 ? `${Math.round((withPhone / totalLeads) * 100)}% contactables direct` : "Numéros sénégalais",
      icon: Phone,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/60",
    },
    {
      title: "Sans site web vitrine",
      value: withoutWebsite,
      subtext: "Opportunité digitale immédiate",
      icon: Globe,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200/60 dark:border-amber-800/60",
    },
    {
      title: "Clients convertis",
      value: converted,
      subtext: "Transférés dans le carnet clients",
      icon: UserCheck,
      iconColor: "text-violet-600 dark:text-violet-400",
      iconBg: "bg-violet-50 dark:bg-violet-950/60 border-violet-200/60 dark:border-violet-800/60",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft animate-pulse"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 mb-3" />
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
            <div className="h-3 w-28 bg-slate-100 dark:bg-slate-800/60 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border shadow-xs ${stat.iconBg} ${stat.iconColor}`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5 truncate">
                {stat.title}
              </div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                {stat.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
