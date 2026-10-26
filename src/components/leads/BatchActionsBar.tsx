"use client";

import React from "react";
import { Sparkles, Download, X, Loader2 } from "lucide-react";

interface BatchActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBatchGenerate: () => void;
  onExportCSV: () => void;
  isGenerating?: boolean;
}

export function BatchActionsBar({
  selectedCount,
  onClearSelection,
  onBatchGenerate,
  onExportCSV,
  isGenerating = false,
}: BatchActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] sm:w-auto max-w-xl animate-in slide-in-from-bottom-6 fade-in duration-200">
      <div className="bg-slate-900/95 dark:bg-slate-800/95 text-white backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/80 px-4 py-3 flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
        {/* Count Pill */}
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center">
            {selectedCount}
          </span>
          <span className="text-xs font-semibold whitespace-nowrap">
            sélectionné{selectedCount > 1 ? "s" : ""}
          </span>
        </div>

        <div className="h-4 w-px bg-slate-700 hidden sm:block" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Batch Generate */}
          <button
            type="button"
            onClick={onBatchGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all disabled:opacity-50"
            title="Générer des messages pour les prospects sélectionnés"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Génération...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Générer ({selectedCount > 10 ? 10 : selectedCount})</span>
              </>
            )}
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
            title="Exporter la sélection en CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exporter CSV</span>
          </button>

          {/* Clear */}
          <button
            type="button"
            onClick={onClearSelection}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Désélectionner tout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
