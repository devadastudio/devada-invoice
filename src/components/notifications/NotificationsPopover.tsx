"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Check,
  CheckCheck,
  CreditCard,
  AlertTriangle,
  Send,
  Building2,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { AppNotification } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onSelectNotification: (notif: AppNotification) => void;
  onMarkAllAsRead: () => void;
  onViewAllNotifications?: () => void;
}

export function NotificationsPopover({
  isOpen,
  onClose,
  notifications,
  onSelectNotification,
  onMarkAllAsRead,
  onViewAllNotifications,
}: NotificationsPopoverProps) {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    return true;
  });

  const getInitials = (name?: string) => {
    if (!name) return "NT";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getCategoryIcon = (category: AppNotification["category"]) => {
    switch (category) {
      case "payment":
        return <CreditCard className="w-3.5 h-3.5" />;
      case "invoice_overdue":
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case "invoice_sent":
        return <Send className="w-3.5 h-3.5" />;
      case "client_created":
        return <Building2 className="w-3.5 h-3.5" />;
      case "security":
      default:
        return <ShieldCheck className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      ref={popoverRef}
      className="absolute -right-2 sm:right-0 top-full mt-2 w-[calc(100vw-24px)] xs:w-[350px] sm:w-[380px] max-w-[390px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right text-slate-900 dark:text-white overflow-hidden box-border"
    >
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Notifications
        </h2>
        {unreadCount > 0 && (
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-900/50">
            {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Segmented Tab Pill Controller matching reference screenshot */}
      <div className="mt-3.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={cn(
            "flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all text-center",
            activeTab === "all"
              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          )}
        >
          Toutes
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("unread")}
          className={cn(
            "flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
            activeTab === "unread"
              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          )}
        >
          <span>Non lues</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 min-w-[18px] text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Scrollable Notifications List */}
      <div className="mt-3.5 max-h-[340px] overflow-y-auto space-y-1.5 pr-0.5 scrollbar-thin">
        {filteredNotifications.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="font-medium">Aucune notification {activeTab === "unread" ? "non lue" : ""}</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const actor = notif.actorName || notif.clientName || notif.title;
            const bgClass = notif.actorBg || "bg-blue-600";

            return (
              <div
                key={notif.id}
                onClick={() => {
                  onClose();
                  onSelectNotification(notif);
                }}
                className={cn(
                  "p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 group relative",
                  !notif.read
                    ? "bg-blue-50/70 dark:bg-blue-950/25 border border-blue-100/70 dark:border-blue-900/40 hover:bg-blue-100/60 dark:hover:bg-blue-900/40"
                    : "bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent"
                )}
              >
                {/* Round Avatar Icon */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs text-white shadow-sm ring-2 ring-white dark:ring-slate-800 flex-shrink-0 mt-0.5",
                    bgClass
                  )}
                >
                  {getInitials(actor)}
                </div>

                {/* Content: Actor in bold + description text + timestamp */}
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug line-clamp-2">
                    <strong className="font-bold text-slate-900 dark:text-white mr-1">
                      {actor}
                    </strong>
                    <span>{notif.message}</span>
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block font-medium">
                    {notif.timestamp}
                  </span>
                </div>

                {/* Unread indicator dot */}
                {!notif.read && (
                  <span
                    className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0 mt-2 ring-2 ring-white dark:ring-slate-900"
                    title="Non lue"
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Popover Bottom Actions: Grid with 2 columns to strictly avoid button overflow */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 w-full">
        <button
          type="button"
          onClick={onMarkAllAsRead}
          className="w-full min-w-0 py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 active:scale-[0.98] text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
        >
          <Check className="w-3.5 h-3.5 flex-shrink-0 text-slate-500 dark:text-slate-400" />
          <span className="truncate">Tout marquer lu</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            if (onViewAllNotifications) {
              onViewAllNotifications();
            } else {
              setActiveTab("all");
            }
          }}
          className="w-full min-w-0 py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all shadow-sm shadow-blue-500/25"
        >
          <span className="truncate">Voir tout</span>
        </button>
      </div>
    </div>
  );
}
