"use client";

import React from "react";
import { Sparkles, Check, UserPlus, FileText, Send } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      stepNum: 1,
      time: "⏱ 30 secondes",
      timeColor: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      iconBg: "bg-blue-600 text-white shadow-blue-500/25",
      icon: UserPlus,
      title: "Inscris-toi en 30s",
      description:
        "Crée ton compte sans aucune carte bancaire. Ajoute le nom de ton entreprise, ton logo et tes coordonnées officielles.",
      feature: "Nom d'entreprise + Logo",
    },
    {
      number: "02",
      stepNum: 2,
      time: "⏱ 45 secondes",
      timeColor: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      iconBg: "bg-emerald-600 text-white shadow-emerald-500/25",
      icon: FileText,
      title: "Crée ta facture",
      description:
        "Sélectionne ton client, saisis tes prestations en FCFA. Le calcul de la TVA 18% et le total TTC se font automatiquement en direct.",
      feature: "Calcul TVA 18% automatique",
    },
    {
      number: "03",
      stepNum: 3,
      time: "⚡ Instantané",
      timeColor: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700",
      iconBg: "bg-slate-900 dark:bg-slate-700 text-white shadow-slate-900/20",
      icon: Send,
      title: "Envoie & encaisse",
      description:
        "Partage le PDF soigné ou le lien de paiement direct via WhatsApp ou e-mail. Reçois ton règlement instantanément sur ton compte.",
      feature: "Wave, Orange Money & Virement",
    },
  ];

  return (
    <section
      id="comment-ca-marche"
      className="py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#090D16] border-y border-slate-200/80 dark:border-slate-800 relative overflow-hidden transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-extrabold uppercase tracking-widest shadow-soft">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Processus en 3 Étapes
          </div>

          <h2 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Opérationnel en moins de{" "}
            <span className="text-blue-600 dark:text-blue-400">3 minutes</span>
          </h2>

          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Aucune compétence technique ou comptable complexe requise pour débuter.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.number}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft text-center relative overflow-hidden group hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-xs font-mono font-bold border px-2.5 py-0.5 rounded-full ${st.timeColor}`}
                    >
                      {st.time}
                    </span>
                    <span className="text-4xl font-black font-mono text-slate-200 dark:text-slate-800 select-none">
                      {st.number}
                    </span>
                  </div>

                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl mx-auto mb-6 shadow-md group-hover:scale-105 transition-transform ${st.iconBg}`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {st.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {st.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                  <span>{st.feature}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
