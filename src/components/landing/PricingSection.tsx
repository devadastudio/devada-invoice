"use client";

import React from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "Plan Gratuit",
      badge: "Pour démarrer",
      description: "Parfait pour tester et lancer votre activité",
      price: "0",
      featured: false,
      ctaText: "Démarrer gratuitement",
      ctaHref: "/auth/register?plan=free",
      ctaStyle:
        "border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
      features: [
        "Jusqu'à 5 factures & devis par mois",
        "1 utilisateur dirigeant",
        "Calcul automatique TVA 18%",
        "Export PDF propre avec filigrane",
      ],
    },
    {
      name: "Plan Pro",
      badge: "Indépendants & TPE",
      popularBadge: "LE PLUS POPULAIRE",
      description: "Pour les professionnels actifs voulant automatiser",
      price: "30 000",
      featured: true,
      ctaText: "Choisir le Plan Pro",
      ctaHref: "/auth/register?plan=pro",
      ctaStyle:
        "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25",
      features: [
        "Factures et devis illimités",
        "Relances automatiques WhatsApp & Email",
        "Intégration Wave & Orange Money direct",
        "Multi-devises (FCFA XOF/XAF, EUR, USD)",
        "Personnalisation sans filigrane + Logo",
        "Support prioritaire 7j/7 WhatsApp",
      ],
    },
    {
      name: "Plan Business",
      badge: "Agences & PME",
      description: "Pour les équipes et structures en forte croissance",
      price: "50 000",
      featured: false,
      ctaText: "Choisir le Plan Business",
      ctaHref: "/auth/register?plan=business",
      ctaStyle:
        "border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
      features: [
        "Utilisateurs et collaborateurs illimités",
        "Gestion fine des rôles (comptable, commercial)",
        "Tableau de bord financier & trésorerie avancé",
        "Rapprochement bancaire automatisé",
        "Export comptable direct (Excel, CSV, PDF)",
      ],
    },
  ];

  return (
    <section
      id="tarifs"
      className="py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#090D16] border-t border-slate-200/80 dark:border-slate-800 relative overflow-hidden transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-extrabold uppercase tracking-widest shadow-soft">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Tarifs Transparents
          </div>

          <h2 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Un investissement rentable dès votre{" "}
            <span className="text-blue-600 dark:text-blue-400">
              première facture
            </span>
          </h2>

          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Sans engagement, sans frais cachés. Paiement en FCFA par Mobile Money (Wave, Orange Money) ou Carte bancaire.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 ${
                p.featured
                  ? "border-2 border-blue-600 ring-2 ring-blue-600/20 shadow-pop lg:-translate-y-2 relative"
                  : "border border-slate-200/80 dark:border-slate-800 shadow-soft"
              }`}
            >
              {p.popularBadge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                  {p.popularBadge}
                </div>
              )}

              <div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-4 border border-slate-200/60 dark:border-slate-700">
                  {p.badge}
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {p.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">
                  {p.description}
                </p>

                <div className="mt-6 mb-6 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white">
                    {p.price}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono font-semibold text-xs sm:text-sm">
                    {" "}FCFA / mois
                  </span>
                </div>

                <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-6">
                  {p.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href={p.ctaHref}
                  className={`w-full block py-3.5 rounded-xl text-center font-semibold text-xs sm:text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${p.ctaStyle}`}
                >
                  <span>{p.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
