"use client";

import React, { useState, useEffect } from "react";
import { Zap, X } from "lucide-react";

interface ToastItem {
  time: string;
  headline: string;
  amount?: string;
  channel?: string;
  isSpecial?: boolean;
}

const TOAST_ITEMS: ToastItem[] = [
  {
    time: "Il y a 3 min",
    headline: "Une agence à Dakar a encaissé",
    amount: "450 000 FCFA",
    channel: "via Wave",
  },
  {
    time: "Il y a 7 min",
    headline: "Un studio à Abidjan vient d'émettre une facture avec",
    amount: "TVA 18%",
  },
  {
    time: "Il y a 14 min",
    headline: "Consultant à Douala a reçu",
    amount: "1 200 000 FCFA",
    channel: "par Orange Money",
  },
  {
    time: "Il y a 22 min",
    headline: "Nouveau compte PRO activé à Yaoundé 🚀",
    isSpecial: true,
  },
];

export function LiveToastNotification() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % TOAST_ITEMS.length);
        setIsFading(false);
      }, 400);
    }, 7000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const current = TOAST_ITEMS[currentIndex];

  return (
    <div
      className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 transition-all duration-300 max-w-[92vw] sm:max-w-md ${
        isFading ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"
      }`}
      id="live-toast"
    >
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 pr-4 border border-slate-200/90 dark:border-slate-800 shadow-toast flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-200/80 dark:border-emerald-800 shrink-0">
          <Zap className="w-4 h-4 fill-current" />
        </div>

        <div className="text-xs flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-slate-400 dark:text-slate-500 font-medium text-[11px]">
              {current.time}
            </span>
          </div>

          <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
            {current.headline}{" "}
            {current.amount && (
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {current.amount}
              </span>
            )}{" "}
            {current.channel && (
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                {current.channel}
              </span>
            )}
          </p>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Fermer la notification"
          aria-label="Fermer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
