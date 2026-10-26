"use client";

import React from "react";
import { Sparkles, Clock, Check, Zap } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      badge: "⏱ 30 secondes",
      badgeStyle:
        "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      iconBg: "bg-blue-600 text-white shadow-blue-500/20",
      stepNum: "1",
      title: "Inscris-toi en 30s",
      description:
        "Crée ton compte sans aucune carte bancaire. Ajoute le nom de ton entreprise, ton logo et tes coordonnées officielles.",
      feature: "Nom d'entreprise + Logo",
    },
    {
      number: "02",
      badge: "⏱ 45 secondes",
      badgeStyle:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      iconBg: "bg-emerald-600 text-white shadow-emerald-500/20",
      stepNum: "2",
      title: "Crée ta facture",
      description:
        "Sélectionne ton client, saisis tes prestations en FCFA. Le calcul de la TVA 18% et le total TTC se font automatiquement en direct.",
      feature: "Calcul TVA 18% automatique",
    },
    {
      number: "03",
      badge: "⚡ Instantané",
      badgeStyle:
        "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700",
      iconBg: "bg-slate-900 dark:bg-slate-800 text-white shadow-slate-900/20",
      stepNum: "3",
      title: "Envoie & encaisse",
      description:
        "Partage le PDF soigné ou le lien de paiement direct via WhatsApp ou e-mail. Reçois ton règlement instantanément sur ton compte.",
      feature: "Wave, Orange Money & Virement",
    },
  ];

  return (
    <section
      id="comment-ca-marche"
      className="py-16 sm:py-20 bg-[#F8FAFC] dark:bg-[#090D16] border-y border-slate-200/80 dark:border-slate-800 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/60 px-3.5 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Processus en 3 Étapes
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Opérationnel en moins de <span className="text-blue-600 dark:text-blue-500">3 minutes</span>
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Aucune compétence comptable ni configuration complexe requise pour débuter.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((st) => (
            <div
              key={st.number}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft text-center relative overflow-hidden group hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`text-xs font-mono font-bold border px-2.5 py-0.5 rounded-full ${st.badgeStyle}`}
                  >
                    {st.badge}
                  </span>
                  <span className="text-4xl font-black font-mono text-slate-200 dark:text-slate-800 select-none">
                    {st.number}
                  </span>
                </div>

                <div
                  className={`w-16 h-16 rounded-2xl ${st.iconBg} flex items-center justify-center font-extrabold text-2xl mx-auto mb-6 shadow-md group-hover:scale-105 transition-transform`}
                >
                  {st.stepNum}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {st.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {st.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{st.feature}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
