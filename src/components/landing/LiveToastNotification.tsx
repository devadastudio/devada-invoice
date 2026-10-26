"use client";

import React, { useState, useEffect } from "react";
import { Zap, X } from "lucide-react";

interface ToastItem {
  time: string;
  msg: React.ReactNode;
}

export function LiveToastNotification() {
  const toastItems: ToastItem[] = [
    {
      time: "Il y a 3 min",
      msg: (
        <>
          Une agence à Dakar a encaissé{" "}
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            450 000 FCFA
          </span>{" "}
          via Wave
        </>
      ),
    },
    {
      time: "Il y a 7 min",
      msg: (
        <>
          Un studio à Abidjan vient d&apos;émettre une facture avec{" "}
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
            TVA 18%
          </span>
        </>
      ),
    },
    {
      time: "Il y a 14 min",
      msg: (
        <>
          Consultant à Douala a reçu{" "}
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            1 200 000 FCFA
          </span>{" "}
          par Orange Money
        </>
      ),
    },
    {
      time: "Il y a 22 min",
      msg: <>Nouveau compte PRO activé à Yaoundé 🚀</>,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      // Start fade out
      setIsFading(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % toastItems.length);
        // Fade in
        setIsFading(false);
      }, 500);
    }, 7000);

    return () => clearInterval(interval);
  }, [isVisible, toastItems.length]);

  if (!isVisible) return null;

  const currentToast = toastItems[currentIndex];

  return (
    <div
      className={`fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-40 max-w-sm sm:max-w-md transition-all duration-500 transform ${
        isFading ? "translate-y-4 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 pr-4 sm:pr-5 border border-slate-200/90 dark:border-slate-800 shadow-toast flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-200/80 dark:border-emerald-800/60 shrink-0">
          <Zap className="w-4 h-4" />
        </div>

        <div className="text-xs flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-slate-400 dark:text-slate-500 font-medium text-[11px]">
              {currentToast.time}
            </span>
          </div>
          <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
            {currentToast.msg}
          </p>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
          title="Fermer la notification"
          aria-label="Fermer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
