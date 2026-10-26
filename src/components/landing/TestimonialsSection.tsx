"use client";

import React from "react";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Amadou Diallo",
      role: "Fondateur de Sahel Tech Studio • Dakar, Sénégal",
      initials: "AD",
      avatarBg: "bg-blue-600",
      proofPill: "+3,2M FCFA recouvrés",
      proofClass:
        "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800",
      quote:
        "« Avant, je perdais au moins 2 jours entiers par mois à bricoler sur Excel et rattraper des erreurs de calcul. Avec Devada Invoice, mes devis et factures en FCFA partent en 2 minutes et mes clients me paient deux fois plus vite via Mobile Money. »",
    },
    {
      name: "Marie-Josée Kouassi",
      role: "Directrice d'Ébène Communication • Abidjan, Côte d'Ivoire",
      initials: "MK",
      avatarBg: "bg-emerald-600",
      proofPill: "100% conforme audit DGI",
      proofClass:
        "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200/80 dark:border-blue-800",
      quote:
        "« Le calcul automatique de la TVA 18% m'a sauvée lors de notre dernier audit et déclaration fiscale trimestrielle. Toutes les mentions légales ivoiriennes sont impeccables. C'est l'outil indispensable pour toute PME en Afrique de l'Ouest. »",
    },
    {
      name: "Christian Mballa",
      role: "Consultant Indépendant • Douala, Cameroun",
      initials: "CM",
      avatarBg: "bg-slate-800 dark:bg-slate-700",
      proofPill: "Clôture divisée par 3",
      proofClass:
        "text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200/80 dark:border-purple-800",
      quote:
        "« Mes clients d'Europe et d'Afrique Centrale sont impressionnés par la netteté de mes factures. Le suivi en temps réel des encaissements sur mon smartphone me donne une visibilité totale sur mon cash-flow. »",
    },
  ];

  return (
    <section
      className="py-16 sm:py-24 bg-white dark:bg-[#0D121F]"
      data-purpose="testimonials-section"
      id="temoignages"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 px-3.5 py-1 rounded-full inline-block">
            ILS NOUS FONT CONFIANCE
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ce que les entrepreneurs disent de{" "}
            <span className="text-slate-900 dark:text-white">devada </span>
            <span className="text-emerald-600 dark:text-emerald-400">invoice</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Des centaines d&apos;agences, freelances et PME ont modernisé leur gestion financière en Afrique de
            l&apos;Ouest et Centrale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#F8FAFC] dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col justify-between hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-amber-400" />
                    ))}
                  </div>
                  <span
                    className={`text-[11px] font-bold font-mono border px-2.5 py-0.5 rounded-full ${t.proofClass}`}
                  >
                    {t.proofPill}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  {t.quote}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-3.5">
                <div
                  className={`w-11 sm:w-12 h-11 sm:h-12 rounded-full ${t.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-sm ring-1 ring-black/10 dark:ring-white/10 shrink-0`}
                >
                  {t.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
