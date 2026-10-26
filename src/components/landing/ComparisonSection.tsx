"use client";

import React from "react";
import { X, Check, AlertTriangle, Rocket } from "lucide-react";

export function ComparisonSection() {
  return (
    <section
      className="py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#090D16] border-b border-slate-200/80 dark:border-slate-800/80"
      data-purpose="comparison-section"
      id="comparatif"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 px-3.5 py-1 rounded-full inline-block">
            LA DIFFÉRENCE RADICALE
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Votre quotidien <span className="text-rose-500 line-through">avant</span> vs{" "}
            <span className="text-emerald-600 dark:text-emerald-400">avec Devada</span>
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-base max-w-xl mx-auto">
            Pourquoi les entrepreneurs africains ne reviennent jamais en arrière.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Old Way (Excel/Word) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-rose-200/80 dark:border-rose-900/40 shadow-soft relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-black flex items-center justify-center text-sm">
                    <X className="w-4 h-4 stroke-[3]" />
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    À l&apos;ancienne (Excel, Word)
                  </h3>
                </div>
                <span className="text-xs font-bold uppercase text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-md border border-rose-200/60 dark:border-rose-800/60">
                  Perte de temps
                </span>
              </div>

              <ul className="mt-6 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5 shrink-0">✕</span>
                  <span>Factures en capture d&apos;écran ou PDF Word mal alignés qui font douter les grands comptes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5 shrink-0">✕</span>
                  <span>Calcul manuel de la TVA 18% risqué : une coquille et vous risquez redressement et pénalités.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5 shrink-0">✕</span>
                  <span>En attente de chèques et virements : relances gênantes au cas par cas sur WhatsApp perso.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5 shrink-0">✕</span>
                  <span>Aucune visibilité sur les impayés : vous découvrez les trous de trésorerie en fin de mois.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Perte estimée : 15 à 20 heures chaque mois</span>
            </div>
          </div>

          {/* Modern Way (Devada Invoice PRO) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-pop relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-black flex items-center justify-center text-sm">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                    Avec Devada Invoice PRO
                  </h3>
                </div>
                <span className="text-xs font-extrabold uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Recommandé
                </span>
              </div>

              <ul className="mt-6 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 shrink-0">✓</span>
                  <span>Factures élégantes scellées avec logo, NINEA/RCCM et mentions légales 100% officielles.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 shrink-0">✓</span>
                  <span>TVA 18% et montants HT/TTC calculés à la milliseconde sans jamais toucher à une formule.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 shrink-0">✓</span>
                  <span>Lien Wave &amp; Orange Money intégré : le client clique, paie et votre facture est marquée soldée.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 shrink-0">✓</span>
                  <span>Tableau de bord de trésorerie en direct : vous savez au centime près où en est votre cash.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <Rocket className="w-4 h-4 shrink-0" />
              <span>Gain mesuré : Règlement en moins de 48h en moyenne</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
