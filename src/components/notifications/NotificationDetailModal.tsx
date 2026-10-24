"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  X,
  CreditCard,
  AlertTriangle,
  Send,
  Building2,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { AppNotification } from "@/lib/mock-data";
import { formatFCFA, cn } from "@/lib/utils";

interface NotificationDetailModalProps {
  notification: AppNotification | null;
  onClose: () => void;
  onNavigate?: () => void;
}

export function NotificationDetailModal({
  notification,
  onClose,
  onNavigate,
}: NotificationDetailModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (notification) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [notification, onClose]);

  if (!notification || !mounted) return null;

  const getCategoryConfig = (category: AppNotification["category"]) => {
    switch (category) {
      case "payment":
        return {
          icon: CreditCard,
          badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
          iconBg: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
          label: "Paiement Encaissé",
        };
      case "invoice_overdue":
        return {
          icon: AlertTriangle,
          badgeBg: "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
          iconBg: "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400",
          label: "Avis d'Échéance Dépassée",
        };
      case "invoice_sent":
        return {
          icon: Send,
          badgeBg: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
          iconBg: "bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400",
          label: "Facture Émise",
        };
      case "client_created":
        return {
          icon: Building2,
          badgeBg: "bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800",
          iconBg: "bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400",
          label: "Annuaire Client",
        };
      case "security":
      default:
        return {
          icon: ShieldCheck,
          badgeBg: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
          iconBg: "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400",
          label: "Sécurité & Système",
        };
    }
  };

  const config = getCategoryConfig(notification.category);
  const IconComponent = config.icon;

  const handleActionClick = () => {
    if (notification.invoiceId) {
      onClose();
      if (onNavigate) onNavigate();
      router.push(`/invoices/${notification.invoiceId}`);
    } else if (notification.category === "client_created") {
      onClose();
      if (onNavigate) onNavigate();
      router.push("/clients");
    } else {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 relative overflow-hidden animate-in zoom-in-95 duration-200 space-y-5"
      >
        {/* Top Bar: Category Pill & Close Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${config.badgeBg}`}
            >
              <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{config.label}</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {notification.timestamp}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
            {notification.title}
          </h3>
        </div>

        {/* Message */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {notification.message}
        </p>

        {/* Highlighted Attributes (Clean, airy pills instead of bulky card) */}
        {(notification.invoiceNumber || notification.clientName || notification.amount) && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
            {notification.amount && (
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px]">Montant :</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {formatFCFA(notification.amount)}
                </span>
              </div>
            )}

            {notification.invoiceNumber && (
              <div className="px-3 py-1.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 flex items-center gap-1.5 text-xs">
                <span className="text-blue-500 text-[11px]">N°</span>
                <span className="font-mono font-bold text-blue-700 dark:text-blue-300">
                  {notification.invoiceNumber}
                </span>
              </div>
            )}

            {notification.clientName && (
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px]">Client :</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                  {notification.clientName}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Fermer
          </button>

          {(notification.invoiceId || notification.category === "client_created") && (
            <button
              onClick={handleActionClick}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/25 flex items-center gap-1.5"
            >
              <span>
                {notification.invoiceId ? "Consulter la facture" : "Voir le répertoire client"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
