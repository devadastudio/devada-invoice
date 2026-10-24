"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Bell,
  Search,
  CheckCheck,
  CreditCard,
  AlertTriangle,
  Send,
  Building2,
  ShieldCheck,
  Calendar,
  Sparkles,
} from "lucide-react";
import { AppNotification } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface AllNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onSelectNotification: (notif: AppNotification) => void;
  onMarkAllAsRead: () => void;
}

export function AllNotificationsModal({
  isOpen,
  onClose,
  notifications,
  onSelectNotification,
  onMarkAllAsRead,
}: AllNotificationsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const categories = [
    { id: "all", label: "Toutes" },
    { id: "payment", label: "Encaissements" },
    { id: "invoice_overdue", label: "Retards" },
    { id: "invoice_sent", label: "Émises" },
    { id: "client_created", label: "Clients" },
    { id: "security", label: "Système" },
  ];

  const filtered = notifications.filter((n) => {
    const matchesCategory = selectedCategory === "all" || n.category === selectedCategory;
    const actor = n.actorName || n.clientName || n.title;
    const matchesSearch =
      actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.invoiceNumber && n.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getInitials = (name?: string) => {
    if (!name) return "NT";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl my-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Historique des notifications
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Consultez l'ensemble des encaissements, avis d'échéances et alertes de gestion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Tout marquer lu</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Rechercher par client, facture ou mot-clé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="font-semibold text-sm">Aucune notification trouvée</p>
              <p className="text-xs mt-1">Essayez d'ajuster vos critères de recherche ou de filtre</p>
            </div>
          ) : (
            filtered.map((notif) => {
              const actor = notif.actorName || notif.clientName || notif.title;
              const bgClass = notif.actorBg || "bg-blue-600";

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    onSelectNotification(notif);
                    onClose();
                  }}
                  className={cn(
                    "p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer flex items-start gap-3.5 border",
                    !notif.read
                      ? "bg-blue-50/70 dark:bg-blue-950/25 border-blue-200/70 dark:border-blue-900/40 hover:bg-blue-100/60 dark:hover:bg-blue-900/40"
                      : "bg-white dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs text-white shadow-sm ring-2 ring-white dark:ring-slate-800 flex-shrink-0 mt-0.5",
                      bgClass
                    )}
                  >
                    {getInitials(actor)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {actor}
                      </p>
                      <span className="text-[11px] text-slate-400 font-medium flex-shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                    {notif.amount && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {notif.amount.toLocaleString("fr-FR")} FCFA
                      </span>
                    )}
                  </div>

                  {!notif.read && (
                    <span
                      className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0 mt-2"
                      title="Non lue"
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {notifications.length} notification{notifications.length > 1 ? "s" : ""} au total
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
