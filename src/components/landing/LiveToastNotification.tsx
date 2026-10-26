"use client";

import React, { useState, useEffect } from "react";
import { Zap, X } from "lucide-react";

interface ToastItem {
  time: string;
  prefix: string;
  highlight: string;
  highlightColor: string;
  suffix: string;
}

const TOAST_ITEMS: ToastItem[] = [
  {
    time: "Il y a 3 min",
    prefix: "Une agence à Dakar a encaissé ",
    highlight: "450 000 FCFA",
    highlightColor: "text-emerald-600 dark:text-emerald-400",
    suffix: " via Wave",
  },
  {
    time: "Il y a 7 min",
    prefix: "Un studio à Abidjan vient d'émettre une facture avec ",
    highlight: "TVA 18%",
    highlightColor: "text-blue-600 dark:text-blue-400",
    suffix: " automatique",
  },
  {
    time: "Il y a 14 min",
    prefix: "Consultant à Douala a reçu ",
    highlight: "1 200 000 FCFA",
    highlightColor: "text-emerald-600 dark:text-emerald-400",
    suffix: " par Orange Money",
  },
  {
    time: "Il y a 22 min",
    prefix: "Nouveau compte ",
    highlight: "Devada PRO",
    highlightColor: "text-emerald-600 dark:text-emerald-400",
    suffix: " activé à Yaoundé 🚀",
  },
  {
    time: "Il y a 29 min",
    prefix: "Facture #DEV-2026-094 soldée à ",
    highlight: "100%",
    highlightColor: "text-cyan-600 dark:text-cyan-400",
    suffix: " en 4 minutes chrono",
  },
];

export default function LiveToastNotification() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const interval = setInterval(() => {
      // Start fade out
      setFading(true);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % TOAST_ITEMS.length);
        // Fade back in
        setFading(false);
      }, 400);
    }, 7000);

    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed || !visible) return null;

  const current = TOAST_ITEMS[index];

  return (
    <div
      className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 max-w-[calc(100vw-2rem)] sm:max-w-sm transition-all duration-400 ease-out ${
        fading ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 pr-4 border border-slate-200/90 dark:border-slate-800 shadow-toast flex items-center gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-200/80 dark:border-emerald-800/80 shrink-0">
          <Zap className="w-4 h-4 fill-emerald-500/20 text-emerald-600 dark:text-emerald-400" />
        </div>

        <div className="text-xs flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400 dark:text-slate-500 font-medium text-[10px] sm:text-[11px]">
              {current.time}
            </span>
          </div>
          <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 text-[11px] sm:text-xs leading-snug truncate">
            <span>{current.prefix}</span>
            <span className={`font-mono font-extrabold ${current.highlightColor}`}>
              {current.highlight}
            </span>
            <span>{current.suffix}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 p-1 rounded-lg transition-colors shrink-0"
          aria-label="Fermer la notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
