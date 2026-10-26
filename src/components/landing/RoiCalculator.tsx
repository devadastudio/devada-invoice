"use client";

import React, { useState } from "react";
import { Clock, Zap, ShieldCheck, Banknote, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatFCFA } from "@/lib/utils";

export default function RoiCalculator() {
  const [invoiceCount, setInvoiceCount] = useState<number>(25);

  // 35 min saved per invoice (~0.58 hour)
  const hoursSaved = Math.round(invoiceCount * 0.58);
  // Estimated hourly value = 10 000 FCFA
  const cashSaved = hoursSaved * 10000;

  const presets = [
    { label: "Freelance", count: 10 },
    { label: "Agence", count: 35 },
    { label: "PME", count: 80 },
  ];

  return (
    <section
      id="simulateur"
      className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 relative overflow-hidden transition-colors"
    >
      {/* Decorative subtle background accents */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-50/60 dark:bg-blue-950/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 -ml-20" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 -mr-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-extrabold uppercase tracking-widest shadow-soft">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Simulateur de Gain Concret
          </div>

          <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Combien de temps et d&apos;argent{" "}
            <span className="text-blue-600 dark:text-blue-400">allez-vous sauver</span> ?
          </h2>

          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Ajustez votre volume de factures mensuelles pour découvrir l&apos;impact économique immédiat sur votre entreprise.
          </p>
        </div>

        {/* Calculator Box */}
        <div className="max-w-4xl mx-auto bg-[#F8FAFC] dark:bg-slate-800/70 rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-200/90 dark:border-slate-700 shadow-soft backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input Slider Column */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label
                    htmlFor="invoice-slider"
                    className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200"
                  >
                    Factures &amp; devis par mois :
                  </label>
                  <span className="text-lg sm:text-xl font-black font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm">
                    {invoiceCount}
                  </span>
                </div>

                {/* Range Slider without inline style */}
                <input
                  id="invoice-slider"
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={invoiceCount}
                  onChange={(e) => setInvoiceCount(parseInt(e.target.value, 10))}
                  className="roi-slider w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  aria-label="Nombre de factures mensuelles"
                />

                <div className="flex justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-2">
                  <span>5 factures</span>
                  <span>50 factures</span>
                  <span>150+ factures</span>
                </div>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Profils types :
                </span>
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setInvoiceCount(preset.count)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                      invoiceCount === preset.count
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400"
                    }`}
                  >
                    {preset.label} ({preset.count})
                  </button>
                ))}
              </div>

              {/* Informative Callout */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5">💡</span>
                <p className="leading-relaxed">
                  Sur Excel, chaque facture prend en moyenne <strong>35 minutes</strong> (saisie manuelle, calcul TVA, export, envoi &amp; relances). Avec Devada : <strong>moins de 2 minutes</strong>.
                </p>
              </div>
            </div>

            {/* Output Cards Column */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-3.5">
              {/* Card 1: Time saved */}
              <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Temps économisé
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">
                  {hoursSaved}h
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  par mois pour vos ventes
                </div>
              </div>

              {/* Card 2: Payment speed */}
              <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Encaissement
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  3x plus vite
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  via Wave &amp; OM directs
                </div>
              </div>

              {/* Card 3: Tax compliance */}
              <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Erreurs TVA 18%
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">
                  0% erreur
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  100% conforme DGI
                </div>
              </div>

              {/* Card 4: Value recovered */}
              <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                  <Banknote className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Valeur sauvée
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                  {formatFCFA(cashSaved)}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  productivité récupérée
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center sm:text-left">
              Prêt à récupérer <span className="font-bold text-slate-900 dark:text-white">{hoursSaved} heures</span> ce mois-ci ?
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-sm shadow-blue-500/25 transition-all"
            >
              <span>Tester gratuitement 14 jours</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
