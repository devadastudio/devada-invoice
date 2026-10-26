"use client";

import React from "react";
import { LeadStatus } from "@/lib/mock-data";

interface LeadStatusBadgeProps {
  status: LeadStatus;
  className?: string;
  onClick?: () => void;
}

export function LeadStatusBadge({ status, className = "", onClick }: LeadStatusBadgeProps) {
  const configs: Record<
    LeadStatus,
    { label: string; bg: string; dot: string }
  > = {
    new: {
      label: "Nouveau",
      bg: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",
      dot: "bg-blue-500",
    },
    contacted: {
      label: "Contacté",
      bg: "bg-orange-50 text-orange-700 border-orange-200/80 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60",
      dot: "bg-orange-500",
    },
    replied: {
      label: "A répondu",
      bg: "bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800/60",
      dot: "bg-violet-500",
    },
    converted: {
      label: "Converti",
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
      dot: "bg-emerald-500",
    },
    ignored: {
      label: "Ignoré",
      bg: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
      dot: "bg-slate-400",
    },
  };

  const config = configs[status] || configs.new;

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all ${
        config.bg
      } ${onClick ? "cursor-pointer hover:opacity-85" : ""} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
