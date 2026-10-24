"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  Download,
  Calendar,
  ChevronDown,
  Check,
  Layers,
  History,
  FileSpreadsheet,
  FileText,
  FileCode,
} from "lucide-react";
import {
  CURRENT_USER,
  AppNotification,
  getStoredNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { NotificationsPopover } from "@/components/notifications/NotificationsPopover";
import { AllNotificationsModal } from "@/components/notifications/AllNotificationsModal";
import { NotificationDetailModal } from "@/components/notifications/NotificationDetailModal";
import { getStoredLanguage, getPlatformTranslations, AppLanguage } from "@/lib/i18n";

export interface PeriodOption {
  id: string;
  label: string;
  subtext: string;
  group?: "global" | "semestre" | "trimestre" | "mois" | "past";
}

export const PERIOD_OPTIONS: PeriodOption[] = [
  // Global & Année courante
  { id: "all-time", label: "Depuis le début", subtext: "Cumul total de facturation depuis l'inscription", group: "global" },
  { id: "year-2026", label: "Année 2026 complète", subtext: "Exercice fiscal en cours", group: "global" },

  // Semestres 2026
  { id: "s2-2026", label: "2ème Semestre (S2 2026)", subtext: "Juillet - Décembre 2026", group: "semestre" },
  { id: "s1-2026", label: "1er Semestre (S1 2026)", subtext: "Janvier - Juin 2026", group: "semestre" },

  // Trimestres 2026
  { id: "t4-2026", label: "Trimestre 4 (T4 2026)", subtext: "Octobre - Décembre", group: "trimestre" },
  { id: "t3-2026", label: "Trimestre 3 (T3 2026)", subtext: "Juillet - Septembre", group: "trimestre" },
  { id: "t2-2026", label: "Trimestre 2 (T2 2026)", subtext: "Avril - Juin", group: "trimestre" },
  { id: "t1-2026", label: "Trimestre 1 (T1 2026)", subtext: "Janvier - Mars", group: "trimestre" },

  // Mois par mois 2026
  { id: "oct-2026", label: "Octobre 2026", subtext: "Mois en cours", group: "mois" },
  { id: "sep-2026", label: "Septembre 2026", subtext: "8 100 000 FCFA facturés", group: "mois" },
  { id: "aou-2026", label: "Août 2026", subtext: "6 900 000 FCFA facturés", group: "mois" },
  { id: "jui-2026", label: "Juillet 2026", subtext: "7 850 000 FCFA facturés", group: "mois" },
  { id: "jun-2026", label: "Juin 2026", subtext: "6 400 000 FCFA facturés", group: "mois" },
  { id: "mai-2026", label: "Mai 2026", subtext: "5 950 000 FCFA facturés", group: "mois" },
  { id: "avr-2026", label: "Avril 2026", subtext: "7 200 000 FCFA facturés", group: "mois" },
  { id: "mar-2026", label: "Mars 2026", subtext: "6 800 000 FCFA facturés", group: "mois" },
  { id: "fev-2026", label: "Février 2026", subtext: "5 400 000 FCFA facturés", group: "mois" },
  { id: "jan-2026", label: "Janvier 2026", subtext: "6 100 000 FCFA facturés", group: "mois" },

  // Années passées
  { id: "year-2025", label: "Année 2025", subtext: "Exercice fiscal clos (62 400 000 FCFA)", group: "past" },
  { id: "year-2024", label: "Année 2024", subtext: "Exercice fiscal clos (48 200 000 FCFA)", group: "past" },
];

interface HeaderProps {
  onMenuToggle: () => void;
  title?: string;
  subtitle?: string;
  breadcrumb?: string;
  showPeriodSelector?: boolean;
  showActions?: boolean;
  selectedPeriodId?: string;
  onPeriodChange?: (periodId: string) => void;
  onNewInvoice?: () => void;
  showExportButton?: boolean;
  onExport?: (format: "excel" | "csv" | "pdf") => void;
  exportLabel?: string;
}

export function Header({
  onMenuToggle,
  title,
  subtitle,
  breadcrumb = "Tableau de bord / Vue d'ensemble",
  showPeriodSelector = true,
  showActions = true,
  selectedPeriodId = "oct-2026",
  onPeriodChange,
  showExportButton = false,
  onExport,
  exportLabel,
}: HeaderProps) {
  const [currentLang, setCurrentLang] = useState<AppLanguage>("fr");
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Export dropdown state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Notification state
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAllNotificationsOpen, setIsAllNotificationsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);

  useEffect(() => {
    setCurrentLang(getStoredLanguage());
    const handleLang = () => setCurrentLang(getStoredLanguage());
    window.addEventListener("language_updated", handleLang);
    window.addEventListener("settings_updated", handleLang);
    return () => {
      window.removeEventListener("language_updated", handleLang);
      window.removeEventListener("settings_updated", handleLang);
    };
  }, []);

  const t = getPlatformTranslations(currentLang);
  const effectiveExportLabel = exportLabel || t.header.exportButton;

  useEffect(() => {
    const load = () => {
      setNotifications(getStoredNotifications());
    };
    load();
    window.addEventListener("notifications_updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("notifications_updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const handleSelectNotification = (notif: AppNotification) => {
    const updated = markNotificationAsRead(notif.id);
    setNotifications(updated);
    setSelectedNotification(notif);
    setIsNotificationsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    const updated = markAllNotificationsAsRead();
    setNotifications(updated);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const selectedPeriod =
    PERIOD_OPTIONS.find((opt) => opt.id === selectedPeriodId) || PERIOD_OPTIONS[0];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPeriodOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    }
    if (isPeriodOpen || isExportOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPeriodOpen, isExportOpen]);

  const breadcrumbParts = breadcrumb.split("/").map((s) => s.trim());

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#090D16]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-3.5 sm:px-6 lg:px-8 py-3 transition-colors shadow-sm">
      <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-full">
        {/* Left: Mobile hamburger & Breadcrumbs */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 truncate">
              {breadcrumbParts.map((part, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span>/</span>}
                  <span
                    className={
                      idx === breadcrumbParts.length - 1
                        ? "text-slate-700 dark:text-slate-200 font-medium truncate"
                        : "truncate"
                    }
                  >
                    {part}
                  </span>
                </React.Fragment>
              ))}
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
              {title || `Bonjour, ${CURRENT_USER.name.split(" ")[0]} 👋`}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Interactive Period selector dropdown */}
          {showActions && showPeriodSelector && (
            <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsPeriodOpen(!isPeriodOpen)}
                  className={cn(
                    "flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm",
                    isPeriodOpen
                      ? "bg-white dark:bg-slate-800 border-blue-500 ring-2 ring-blue-500/20 text-blue-600 dark:text-blue-400"
                      : "bg-slate-100/90 dark:bg-slate-800/80 border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
                  )}
                  aria-expanded={isPeriodOpen}
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="hidden xs:inline-block sm:inline-block max-w-[130px] sm:max-w-none truncate">
                    {selectedPeriod.label}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 text-slate-400 transition-transform duration-200",
                      isPeriodOpen && "rotate-180 text-blue-600"
                    )}
                  />
                </button>

                {/* Dropdown Menu Popover */}
                {isPeriodOpen && (
                  <div className="fixed inset-x-3.5 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full mt-2 w-auto sm:w-80 max-h-[75vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-y-auto">
                    <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Filtrer par période
                      </p>
                      <span className="text-[10px] text-blue-600 font-semibold">Exercice OHADA</span>
                    </div>

                    <div className="py-1 max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                      {/* Section 1: Global / Cumul */}
                      <div className="py-1">
                        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                          Cumul & Vue globale
                        </div>
                        {PERIOD_OPTIONS.filter((o) => o.group === "global").map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              if (onPeriodChange) onPeriodChange(option.id);
                              setIsPeriodOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors",
                              selectedPeriod.id === option.id
                                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                            )}
                          >
                            <div>
                              <p className="font-semibold">{option.label}</p>
                              <p className="text-[10px] text-slate-400">{option.subtext}</p>
                            </div>
                            {selectedPeriod.id === option.id && (
                              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Section 2: Semestres & Trimestres */}
                      <div className="py-1">
                        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                          Semestres & Trimestres 2026
                        </div>
                        {PERIOD_OPTIONS.filter((o) => o.group === "semestre" || o.group === "trimestre").map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              if (onPeriodChange) onPeriodChange(option.id);
                              setIsPeriodOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between transition-colors",
                              selectedPeriod.id === option.id
                                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                            )}
                          >
                            <div>
                              <p className="font-medium">{option.label}</p>
                              <p className="text-[10px] text-slate-400">{option.subtext}</p>
                            </div>
                            {selectedPeriod.id === option.id && (
                              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Section 3: Mois par mois 2026 */}
                      <div className="py-1">
                        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                          Mois par mois (2026)
                        </div>
                        {PERIOD_OPTIONS.filter((o) => o.group === "mois").map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              if (onPeriodChange) onPeriodChange(option.id);
                              setIsPeriodOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between transition-colors",
                              selectedPeriod.id === option.id
                                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                            )}
                          >
                            <div>
                              <p className="font-medium">{option.label}</p>
                              <p className="text-[10px] text-slate-400">{option.subtext}</p>
                            </div>
                            {selectedPeriod.id === option.id && (
                              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Section 4: Années passées */}
                      <div className="py-1">
                        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                          Années antérieures
                        </div>
                        {PERIOD_OPTIONS.filter((o) => o.group === "past").map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              if (onPeriodChange) onPeriodChange(option.id);
                              setIsPeriodOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between transition-colors",
                              selectedPeriod.id === option.id
                                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                            )}
                          >
                            <div>
                              <p className="font-medium">{option.label}</p>
                              <p className="text-[10px] text-slate-400">{option.subtext}</p>
                            </div>
                            {selectedPeriod.id === option.id && (
                              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* Export dropdown button: Only visible on Invoices and Clients pages */}
          {showExportButton && onExport && (
            <div className="relative" ref={exportRef}>
              <button
                type="button"
                onClick={() => setIsExportOpen(!isExportOpen)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm",
                  isExportOpen
                    ? "bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                )}
                aria-expanded={isExportOpen}
              >
                <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="hidden sm:inline">{effectiveExportLabel}</span>
                <ChevronDown
                  className={cn(
                    "w-3 h-3 text-slate-400 transition-transform duration-200",
                    isExportOpen && "rotate-180 text-blue-600"
                  )}
                />
              </button>

              {/* Export Formats Dropdown */}
              {isExportOpen && (
                <div className="fixed inset-x-3.5 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full mt-2 w-auto sm:w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">
                    Choisir le format d&apos;export
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsExportOpen(false);
                      onExport("excel");
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      XLS
                    </div>
                    <div>
                      <p className="font-bold">Format Excel</p>
                      <p className="text-[10px] text-slate-400">Classeur avec colonnes séparées</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsExportOpen(false);
                      onExport("csv");
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      CSV
                    </div>
                    <div>
                      <p className="font-bold">Format CSV (.csv)</p>
                      <p className="text-[10px] text-slate-400">Données brutes délimitées standard</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsExportOpen(false);
                      onExport("pdf");
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-700 dark:text-slate-200 hover:text-rose-700 dark:hover:text-rose-400 transition-colors border-t border-slate-100 dark:border-slate-800"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      PDF
                    </div>
                    <div>
                      <p className="font-bold">Rapport PDF (.pdf)</p>
                      <p className="text-[10px] text-slate-400">Document officiel récapitulatif</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Notifications button with unread counter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={cn(
                "p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative",
                isNotificationsOpen && "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
              )}
              aria-label="Notifications"
              title={`${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-4 px-1 bg-rose-500 text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#090D16] shadow-sm animate-in zoom-in-75 duration-150">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover Card anchored right underneath */}
            <NotificationsPopover
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
              notifications={notifications}
              onSelectNotification={handleSelectNotification}
              onMarkAllAsRead={handleMarkAllAsRead}
              onViewAllNotifications={() => {
                setIsNotificationsOpen(false);
                setIsAllNotificationsOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* Complete All Notifications History Modal */}
      <AllNotificationsModal
        isOpen={isAllNotificationsOpen}
        onClose={() => setIsAllNotificationsOpen(false)}
        notifications={notifications}
        onSelectNotification={handleSelectNotification}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* Notification Detail Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
        onNavigate={() => {
          setSelectedNotification(null);
          setIsNotificationsOpen(false);
          setIsAllNotificationsOpen(false);
        }}
      />
    </header>
  );
}
