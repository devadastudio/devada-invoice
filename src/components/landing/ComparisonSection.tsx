"use client";

import React from "react";
import { X, Check, AlertTriangle, Rocket, Sparkles } from "lucide-react";

export default function ComparisonSection() {
  const oldWayPoints = [
    "Factures en capture d'écran ou PDF Word mal alignés qui font douter les grands comptes.",
    "Calcul manuel de la TVA 18% risqué : une coquille et vous risquez redressement et pénalités fiscales.",
    "En attente de chèques et virements : relances gênantes au cas par cas sur WhatsApp personnel.",
    "Aucune visibilité sur les impayés : vous découvrez les trous de trésorerie en fin de mois.",
  ];

  const modernWayPoints = [
    "Factures élégantes scellées avec logo, NINEA/RCCM et mentions légales 100% officielles.",
    "TVA 18% et montants HT/TTC calculés à la milliseconde sans jamais toucher à une formule Excel.",
    "Lien Wave & Orange Money intégré : le client clique, paie et votre facture est marquée soldée.",
    "Tableau de bord de trésorerie en direct : vous savez au centime près où en est votre cash.",
  ];

  return (
    <section
      id="comparatif"
      className="py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#090D16] border-b border-slate-200/80 dark:border-slate-800 relative overflow-hidden transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-widest shadow-soft">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            La Différence Radicale
          </div>

          <h2 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Votre quotidien{" "}
            <span className="text-rose-500 line-through decoration-rose-400 decoration-3">
              avant
            </span>{" "}
            vs{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              avec Devada
            </span>
          </h2>

          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Pourquoi les entrepreneurs et dirigeants africains ne reviennent plus jamais en arrière.
          </p>
        </div>

        {/* 2 Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto items-stretch">
          {/* Card 1: Old Way */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-rose-200/80 dark:border-rose-900/40 shadow-soft flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-black flex items-center justify-center text-sm shadow-sm">
                    <X className="w-4 h-4 stroke-[3]" />
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    À l&apos;ancienne (Excel, Word)
                  </h3>
                </div>
                <span className="text-[11px] font-bold uppercase text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-800/60 px-2.5 py-0.5 rounded-full">
                  Perte d&apos;argent
                </span>
              </div>

              <ul className="mt-6 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {oldWayPoints.map((text, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Perte estimée : 15 à 20 heures perdues chaque mois</span>
            </div>
          </div>

          {/* Card 2: Modern Way */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-pop flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-36 h-36 bg-emerald-100/50 dark:bg-emerald-950/40 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-black flex items-center justify-center text-sm shadow-sm">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                    Avec Devada Invoice PRO
                  </h3>
                </div>
                <span className="text-[11px] font-extrabold uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-sm">
                  Recommandé
                </span>
              </div>

              <ul className="mt-6 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                {modernWayPoints.map((text, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="leading-relaxed">{text}</span>
                  </li>
                ))}
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
