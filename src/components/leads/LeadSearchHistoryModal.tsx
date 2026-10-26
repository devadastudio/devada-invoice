"use client";

import React from "react";
import { X, History, MapPin, Search, Trash2, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { LeadSearch } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

interface LeadSearchHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  searches: LeadSearch[];
  onSelectSearch: (search: LeadSearch) => void;
  onDeleteSearch: (searchId: string) => void;
  activeSearchId?: string | null;
}

export function LeadSearchHistoryModal({
  isOpen,
  onClose,
  searches,
  onSelectSearch,
  onDeleteSearch,
  activeSearchId,
}: LeadSearchHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <History className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Historique des recherches
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Vos extractions Google Maps précédentes ({searches.length})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Liste des recherches */}
        <div className="p-4 overflow-y-auto space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800/80">
          {searches.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Aucune recherche enregistrée pour le moment.
            </div>
          ) : (
            searches.map((s) => {
              const isActive = activeSearchId === s.id;
              return (
                <div
                  key={s.id}
                  className={`pt-2.5 first:pt-0 flex items-center justify-between gap-3 p-3 rounded-2xl transition-all ${
                    isActive
                      ? "bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800"
                      : "hover:bg-slate-50 dark:hover:bg-slate-850"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {s.query}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {s.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>{formatDate(s.createdAt)}</span>
                      <span>•</span>
                      <span className="font-mono font-medium text-slate-600 dark:text-slate-300">
                        {s.resultsCount} prospect{s.resultsCount > 1 ? "s" : ""}
                      </span>
                      <span>•</span>
                      {s.status === "succeeded" && (
                        <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Terminé
                        </span>
                      )}
                      {s.status === "running" && (
                        <span className="text-blue-600 dark:text-blue-400 inline-flex items-center gap-0.5">
                          <Loader2 className="w-3 h-3 animate-spin" /> En cours
                        </span>
                      )}
                      {s.status === "failed" && (
                        <span className="text-rose-600 dark:text-rose-400 inline-flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" /> Échec
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSearch(s);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold transition-all shadow-sm"
                    >
                      <span>Afficher</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteSearch(s.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Supprimer la recherche"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
