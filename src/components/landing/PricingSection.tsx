"use client";

import React from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, Zap } from "lucide-react";

export function PricingSection() {
  const plans = [
    {
      id: "free",
      name: "Plan Gratuit",
      category: "Pour démarrer",
      description: "Parfait pour tester et lancer votre activité en toute simplicité",
      price: "0",
      featured: false,
      ctaLabel: "Démarrer gratuitement",
      ctaHref: "/auth/register",
      features: [
        "Jusqu'à 5 factures & devis par mois",
        "1 utilisateur dirigeant",
        "Calcul automatique TVA 18%",
        "Export PDF propre avec filigrane",
      ],
    },
    {
      id: "pro",
      name: "Plan Pro",
      category: "Indépendants & TPE",
      description: "Pour les professionnels actifs voulant automatiser et se faire payer vite",
      price: "30 000",
      featured: true,
      popularBadge: "LE PLUS POPULAIRE",
      ctaLabel: "Choisir le Plan Pro",
      ctaHref: "/auth/register",
      features: [
        "Factures et devis illimités",
        "Relances automatiques WhatsApp & Email",
        "Intégration Wave & Orange Money direct",
        "Multi-devises (FCFA XOF/XAF, EUR, USD)",
        "Personnalisation sans filigrane + Logo officiel",
        "Support prioritaire 7j/7 WhatsApp",
      ],
    },
    {
      id: "business",
      name: "Plan Business",
      category: "Agences & PME",
      description: "Pour les équipes et structures en forte croissance",
      price: "50 000",
      featured: false,
      ctaLabel: "Contacter l'équipe",
      ctaHref: "/help",
      features: [
        "Utilisateurs et collaborateurs illimités",
        "Gestion fine des rôles (comptable, commercial)",
        "Tableau de bord financier & trésorerie avancé",
        "Rapprochement bancaire automatisé",
        "API & Export direct vers votre logiciel comptable",
      ],
    },
  ];

  return (
    <section
      id="tarifs"
      className="py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#090D16] border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/60 px-3.5 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Tarifs Transparents
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Un investissement rentable dès votre{" "}
            <span className="text-blue-600 dark:text-blue-500">première facture</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Sans engagement, sans frais cachés. Règlement en FCFA par Mobile Money (Wave, Orange Money) ou Carte bancaire.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 ${
                plan.featured
                  ? "bg-white dark:bg-slate-900 border-2 border-blue-600 ring-2 ring-blue-600/20 shadow-pop relative transform lg:-translate-y-2 z-10"
                  : "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft"
              }`}
            >
              {/* Popular Badge for Plan Pro */}
              {plan.popularBadge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                  {plan.popularBadge}
                </div>
              )}

              <div>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                    plan.featured
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {plan.category}
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {plan.description}
                </p>

                {/* Price Display in FCFA */}
                <div className="mt-6 mb-6">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono font-semibold text-sm">
                    {" "}
                    FCFA / mois
                  </span>
                </div>

                {/* Feature List */}
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-6">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4">
                <Link
                  href={plan.ctaHref}
                  className={`w-full block py-3.5 rounded-xl text-center font-bold text-sm transition-all active:scale-[0.98] ${
                    plan.featured
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25"
                      : "border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {plan.ctaLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
