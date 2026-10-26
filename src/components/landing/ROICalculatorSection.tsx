"use client";

import React, { useState } from "react";
import { Lightbulb, Clock, Zap, ShieldCheck, DollarSign } from "lucide-react";

export function ROICalculatorSection() {
  const [invoiceCount, setInvoiceCount] = useState<number>(25);

  // 35 minutes saved per invoice on average (~0.58 hours)
  const hoursSaved = Math.round(invoiceCount * 0.58);
  // Estimated hourly value 10,000 FCFA/hour
  const cashSaved = (hoursSaved * 10000).toLocaleString("fr-FR");

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoiceCount(parseInt(e.target.value, 10));
  };

  const setPreset = (val: number) => {
    setInvoiceCount(val);
  };

  return (
    <section
      className="py-16 sm:py-20 bg-white dark:bg-[#0D121F] border-y border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden"
      data-purpose="roi-calculator"
      id="simulateur"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 px-3.5 py-1 rounded-full inline-block">
            SIMULATEUR DE GAIN CONCRET
          </span>
          <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Combien de temps et d&apos;argent{" "}
            <span className="text-blue-600 dark:text-blue-400">allez-vous sauver</span> ?
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Ajustez votre volume de factures mensuelles pour découvrir l&apos;impact immédiat sur votre entreprise.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-[#F8FAFC] dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Slider Input Column */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label htmlFor="invoice-slider" className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Factures &amp; devis par mois :
                  </label>
                  <span className="text-xl font-black font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm">
                    {invoiceCount}
                  </span>
                </div>

                <input
                  type="range"
                  id="invoice-slider"
                  min="5"
                  max="150"
                  step="5"
                  value={invoiceCount}
                  onChange={handleSliderChange}
                  className="roi-slider cursor-pointer accent-blue-600"
                  aria-label="Volume de factures mensuelles"
                />

                <div className="flex justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-2">
                  <span>5 factures</span>
                  <span>50 factures</span>
                  <span>150+ factures</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Exemples :</span>
                <button
                  type="button"
                  onClick={() => setPreset(10)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                    invoiceCount === 10
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  Freelance (10)
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(35)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                    invoiceCount === 35
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  Agence (35)
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(80)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                    invoiceCount === 80
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  PME (80)
                </button>
              </div>

              {/* Explanatory callout */}
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/70 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
                <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Sur Excel, chaque facture prend en moyenne <strong>35 minutes</strong> (saisie, calcul TVA,
                  export PDF, envoi et relances). Avec Devada : <strong>moins de 2 minutes</strong>.
                </span>
              </div>
            </div>

            {/* Dynamic Output Cards Column */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-3.5">
              <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-soft">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Temps économisé
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-blue-600 dark:text-blue-400 mt-2">
                  {hoursSaved}h
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">par mois pour vos ventes</div>
              </div>

              <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-soft">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Encaissement
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-2">
                  3x plus vite
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">grâce aux liens Mobile Money</div>
              </div>

              <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-soft">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Erreurs TVA 18%
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white mt-2">
                  0% erreur
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  100% conforme DGI
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-soft">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                  Valeur sauvée
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
                  {cashSaved} F
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  en productivité récupérée
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
