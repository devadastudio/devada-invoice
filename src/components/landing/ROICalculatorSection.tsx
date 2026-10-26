"use client";

import React, { useState } from "react";
import { Sparkles, Clock, Zap, ShieldCheck, Banknote, Lightbulb } from "lucide-react";

export function ROICalculatorSection() {
  const [invoiceCount, setInvoiceCount] = useState<number>(25);

  // 35 minutes saved per invoice (~0.583 hour)
  const hoursSaved = Math.round(invoiceCount * 0.58);
  // Estimated hourly value at 10,000 FCFA/h
  const cashSaved = (hoursSaved * 10000).toLocaleString("fr-FR");

  return (
    <section
      id="simulateur"
      className="py-16 sm:py-20 bg-white dark:bg-[#0D121F] border-y border-slate-200/80 dark:border-slate-800 relative overflow-hidden transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-800/60 px-3.5 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Simulateur de Gain Concret
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Combien de temps et d&apos;argent{" "}
            <span className="text-blue-600 dark:text-blue-500">allez-vous sauver</span> ?
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Ajustez votre volume de factures mensuelles pour découvrir l&apos;impact immédiat sur votre entreprise et votre trésorerie.
          </p>
        </div>

        {/* Main Interactive Card */}
        <div className="max-w-4xl mx-auto bg-[#F8FAFC] dark:bg-[#090D16] rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800/90 shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Slider Input Column (Left) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label htmlFor="roi-invoice-slider" className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Nombre de factures &amp; devis par mois :
                  </label>
                  <span className="text-xl font-black font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1 rounded-xl border border-blue-200 dark:border-blue-800/60 shadow-xs">
                    {invoiceCount}
                  </span>
                </div>

                <input
                  id="roi-invoice-slider"
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={invoiceCount}
                  onChange={(e) => setInvoiceCount(parseInt(e.target.value, 10))}
                  className="roi-slider"
                  aria-label="Nombre de factures mensuelles"
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
                {[
                  { label: "Freelance (10)", val: 10 },
                  { label: "Agence (35)", val: 35 },
                  { label: "PME (80)", val: 80 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setInvoiceCount(preset.val)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                      invoiceCount === preset.val
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Reassurance Callout */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/50 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Sur Excel, chaque facture prend en moyenne <strong>35 minutes</strong> (saisie, TVA, export, envoi &amp; relances). Avec Devada : <strong>moins de 2 minutes</strong>.
                </span>
              </div>
            </div>

            {/* Dynamic Output Cards Column (Right) */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-3.5">
              {/* Card 1 */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft group hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Temps économisé</span>
                </div>
                <div className="text-3xl font-black font-mono text-blue-600 dark:text-blue-400 mt-2.5">
                  {hoursSaved}h
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  par mois pour vos ventes
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft group hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Encaissement</span>
                </div>
                <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-2.5">
                  3x plus vite
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  via liens Mobile Money
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft group hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  <span>Erreurs TVA 18%</span>
                </div>
                <div className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-2.5">
                  0% erreur
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  100% conforme DGI
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft group hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <Banknote className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Valeur sauvée</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white mt-2.5">
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
