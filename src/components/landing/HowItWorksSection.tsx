"use client";

import React from "react";
import { Check } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      badge: "⏱ 30 secondes",
      badgeClass:
        "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      numBg: "bg-blue-600 text-white shadow-blue-500/20",
      title: "Inscris-toi en 30s",
      description:
        "Crée ton compte sans aucune carte bancaire. Ajoute le nom de ton entreprise, ton logo et tes coordonnées officielles.",
      feature: "Nom d'entreprise + Logo",
    },
    {
      step: "02",
      badge: "⏱ 45 secondes",
      badgeClass:
        "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      numBg: "bg-emerald-600 text-white shadow-emerald-500/20",
      title: "Crée ta facture",
      description:
        "Sélectionne ton client, saisis tes prestations en FCFA. Le calcul de la TVA 18% et le total TTC se font automatiquement en direct.",
      feature: "Calcul TVA 18% automatique",
    },
    {
      step: "03",
      badge: "⚡ Instantané",
      badgeClass:
        "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700",
      numBg: "bg-slate-900 dark:bg-slate-700 text-white shadow-slate-900/20",
      title: "Envoie & encaisse",
      description:
        "Partage le PDF soigné ou le lien de paiement direct via WhatsApp ou e-mail. Reçois ton règlement instantanément sur ton compte.",
      feature: "Wave, Orange Money & Virement",
    },
  ];

  return (
    <section
      className="py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#090D16] border-y border-slate-200/80 dark:border-slate-800/80"
      data-purpose="how-it-works"
      id="comment-ca-marche"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 px-3.5 py-1 rounded-full inline-block">
            PROCESSUS EN 3 ÉTAPES
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Opérationnel en moins de <span className="text-blue-600 dark:text-blue-400">3 minutes</span>
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-base max-w-xl mx-auto">
            Aucune compétence comptable requise pour débuter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft text-center relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span
                    className={`text-xs font-mono font-bold border px-2.5 py-1 rounded-full ${item.badgeClass}`}
                  >
                    {item.badge}
                  </span>
                  <span className="text-3xl sm:text-4xl font-black font-mono text-slate-200 dark:text-slate-800 select-none">
                    {item.step}
                  </span>
                </div>

                <div
                  className={`w-14 sm:w-16 h-14 sm:h-16 rounded-2xl ${item.numBg} flex items-center justify-center font-bold text-xl mx-auto mb-6 shadow-md group-hover:scale-105 transition-transform`}
                >
                  {idx + 1}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{item.feature}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
