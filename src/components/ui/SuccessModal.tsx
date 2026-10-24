"use client";

import React, { useEffect } from "react";
import { CheckCircle2, X, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SuccessModalDetail {
  label: string;
  value: string;
  isMono?: boolean;
  isHighlight?: boolean;
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  badgeText?: string;
  details?: SuccessModalDetail[];
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  closeLabel?: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  badgeText = "Opération réussie",
  details,
  primaryAction,
  secondaryAction,
  closeLabel = "Fermer",
}: SuccessModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 relative overflow-hidden animate-in zoom-in-95 fade-in duration-200"
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Icon with Glow */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 items-center justify-center text-[9px] text-white font-bold">✓</span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200/80 dark:border-emerald-800 mb-2">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>{badgeText}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Details Card */}
        {details && details.length > 0 && (
          <div className="mt-5 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
            {details.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2">
                <span className="text-slate-400 font-medium">{item.label} :</span>
                <span
                  className={cn(
                    "font-semibold text-slate-900 dark:text-white truncate max-w-[220px]",
                    item.isMono && "font-mono font-bold",
                    item.isHighlight && "text-emerald-600 dark:text-emerald-400"
                  )}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          {primaryAction && (
            <button
              onClick={() => {
                primaryAction.onClick();
                onClose();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/25 flex items-center justify-center gap-1.5"
            >
              <span>{primaryAction.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {secondaryAction && (
            <button
              onClick={() => {
                secondaryAction.onClick();
                onClose();
              }}
              className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}

          <button
            onClick={onClose}
            className={cn(
              "py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors",
              primaryAction
                ? "border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                : "w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-sm"
            )}
          >
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
