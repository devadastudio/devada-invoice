"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Bell,
  CheckCheck,
  CreditCard,
  AlertTriangle,
  Send,
  Building2,
  ShieldCheck,
  Clock,
  Filter,
} from "lucide-react";
import { AppNotification } from "@/lib/mock-data";
import { formatFCFA, cn } from "@/lib/utils";

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onSelectNotification: (notif: AppNotification) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationsDrawer({
  isOpen,
  onClose,
  notifications,
  onSelectNotification,
  onMarkAllAsRead,
}: NotificationsDrawerProps) {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  // Close on Escape key
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

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    return true;
  });

  const getCategoryConfig = (category: AppNotification["category"]) => {
    switch (category) {
      case "payment":
        return {
          icon: CreditCard,
          iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800",
        };
      case "invoice_overdue":
        return {
          icon: AlertTriangle,
          iconBg: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800",
        };
      case "invoice_sent":
        return {
          icon: Send,
          iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800",
        };
      case "client_created":
        return {
          icon: Building2,
          iconBg: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 border border-violet-200/60 dark:border-violet-800",
        };
      case "security":
      default:
        return {
          icon: ShieldCheck,
          iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800",
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm sm:max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-250 ease-out"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800 text-[10px] font-bold">
                    {unreadCount} {unreadCount > 1 ? "nouvelles" : "nouvelle"}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Avis d&apos;encaissements et alertes d&apos;échéances
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="p-1.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors flex items-center gap-1 font-semibold"
                title="Tout marquer comme lu"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Tout lire</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Fermer le volet des notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 sm:px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
              activeTab === "all"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/80 dark:border-slate-700"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            Toutes ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
              activeTab === "unread"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/80 dark:border-slate-700"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Non lues ({unreadCount})
          </button>
        </div>

        {/* Notification Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400 p-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 opacity-40" />
              </div>
              <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                {activeTab === "unread"
                  ? "Aucune notification non lue"
                  : "Aucune notification"}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Vous êtes à jour dans vos alertes et notifications.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const { icon: IconComp, iconBg } = getCategoryConfig(notif.category);
              return (
                <div
                  key={notif.id}
                  onClick={() => onSelectNotification(notif)}
                  className={cn(
                    "p-4 transition-all cursor-pointer group flex items-start gap-3 relative text-left",
                    !notif.read
                      ? "bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/30"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )}
                >
                  {/* Category Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${iconBg}`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <p
                        className={cn(
                          "text-xs truncate font-bold text-slate-900 dark:text-white",
                          !notif.read && "text-blue-900 dark:text-blue-300"
                        )}
                      >
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap flex-shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Metadata tags */}
                    {(notif.invoiceNumber || notif.amount) && (
                      <div className="flex items-center gap-2 mt-2">
                        {notif.invoiceNumber && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                            {notif.invoiceNumber}
                          </span>
                        )}
                        {notif.amount && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                            {formatFCFA(notif.amount)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Unread Blue Dot */}
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0 mt-2 shadow-sm shadow-blue-500/50" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
          <p className="text-[10px] text-slate-400">
            Devada Invoice SaaS — Centre de notification en temps réel
          </p>
        </div>
      </div>
    </div>
  );
}
