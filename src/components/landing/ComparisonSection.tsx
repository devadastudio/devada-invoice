"use client";

import React from "react";
import { X, Check, AlertTriangle, Rocket, Sparkles } from "lucide-react";

export function ComparisonSection() {
  const oldWayItems = [
    "Factures en capture d'écran ou PDF Word mal alignés qui font douter les grands comptes et retardent les validations.",
    "Calcul manuel de la TVA 18% risqué : une simple coquille dans une formule et vous risquez redressement et pénalités.",
    "En attente permanente de chèques et virements : relances gênantes au cas par cas sur WhatsApp perso.",
    "Aucune visibilité sur les impayés : vous découvrez les trous de trésorerie en fin de mois avec angoisse.",
  ];

  const modernWayItems = [
    "Factures élégantes scellées avec logo, NINEA/RCCM et mentions légales sénégalaises & UEMOA 100% officielles.",
    "TVA 18% et montants HT/TTC calculés à la milliseconde sans jamais toucher à une formule ni faire d'erreur d'arrondi.",
    "Lien Wave & Orange Money intégré : le client clique, paie sur son mobile et votre facture est marquée soldée.",
    "Tableau de bord de trésorerie en direct : vous savez au centime près où en est votre cash et qui vous doit quoi.",
  ];

  return (
    <section
      id="comparatif"
      className="py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#090D16] border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 px-3.5 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            La Différence Radicale
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Votre quotidien <span className="text-rose-500 line-through decoration-rose-400">avant</span> vs{" "}
            <span className="text-emerald-600 dark:text-emerald-400">avec Devada</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Découvrez pourquoi les entrepreneurs, PME et consultants africains ne reviennent plus jamais en arrière.
          </p>
        </div>

        {/* 2-Column Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Left: The Old Way (Word, Excel) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-rose-200/90 dark:border-rose-950/80 shadow-soft relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 font-black flex items-center justify-center text-sm shadow-xs">
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      À l&apos;ancienne
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Excel, Word, WhatsApp manuel</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200/70 dark:border-rose-900/50 px-2.5 py-1 rounded-full">
                  Perte d&apos;argent
                </span>
              </div>

              <ul className="mt-6 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {oldWayItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Perte estimée : 15 à 20 heures chaque mois</span>
            </div>
          </div>

          {/* Right: The Modern Way (Devada Invoice PRO) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 dark:border-emerald-500/80 shadow-pop relative overflow-hidden flex flex-col justify-between">
            {/* Background Glow */}
            <div className="absolute -right-12 -top-12 w-36 h-36 bg-emerald-100/60 dark:bg-emerald-900/20 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 font-black flex items-center justify-center text-sm shadow-xs">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      Avec Devada Invoice PRO
                    </h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Solution cloud tout-en-un
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Recommandé
                </span>
              </div>

              <ul className="mt-6 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium relative z-10">
                {modernWayItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 relative z-10">
              <Rocket className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Gain mesuré : Règlement en moins de 48h en moyenne</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
