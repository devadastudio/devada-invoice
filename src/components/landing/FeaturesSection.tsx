"use client";

import React from "react";
import { FileText, Calculator, Smartphone, Users } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      number: "01",
      icon: FileText,
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-950/60 border-blue-100 dark:border-blue-800/60",
      badgeText: "Gagnez 4h",
      badgeClass: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800",
      hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
      title: "Factures pro en 2 clics",
      description:
        "Modèles modernes et personnalisables avec votre logo d'entreprise, signature numérique scellée et mentions légales locales pré-remplies.",
      footerText: "Personnalisable à 100%",
      footerColor: "text-blue-600 dark:text-blue-400",
    },
    {
      number: "02",
      icon: Calculator,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-800/60",
      badgeText: "Zéro pénalité DGI",
      badgeClass: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
      hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
      title: "TVA 18% automatique",
      description:
        "Calcul instantané du HT, de la TVA standard UEMOA/CEMAC à 18% et du TTC net à payer. Zéro prise de tête avec l'administration fiscale.",
      footerText: "Conforme DGI & UEMOA",
      footerColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      number: "03",
      icon: Smartphone,
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-950/60 border-blue-100 dark:border-blue-800/60",
      badgeText: "Règlement 3x + vite",
      badgeClass: "text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800",
      hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
      title: "Paiements Mobile Money",
      description:
        "Vos clients cliquent sur un lien et paient instantanément via Wave, Orange Money ou virement. Les factures se marquent automatiquement comme réglées.",
      footerText: "Wave & Orange Money",
      footerColor: "text-blue-600 dark:text-blue-400",
    },
    {
      number: "04",
      icon: Users,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-800/60",
      badgeText: "Automatique",
      badgeClass: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
      hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
      title: "Mini-CRM & Relances",
      description:
        "Centralisez vos fiches clients avec historique complet des ventes. Programmez des relances automatiques et courtoises par e-mail et WhatsApp.",
      footerText: "Automatisation WhatsApp",
      footerColor: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <section
      className="py-16 sm:py-24 bg-white dark:bg-[#0D121F]"
      data-purpose="features-section"
      id="fonctionnalites"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 px-3.5 py-1 rounded-full inline-block">
            FONCTIONNALITÉS CLÉS
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tout pour gérer votre facturation en{" "}
            <span className="text-emerald-600 dark:text-emerald-400">toute sérénité</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Développé spécifiquement pour répondre aux exigences fiscales et financières des pays de la zone
            francophone (UEMOA / CEMAC).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`bg-[#F8FAFC] dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-md ${feature.hoverBorder} transition-all duration-200 flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-2xl ${feature.iconBg} ${feature.iconColor} flex items-center justify-center font-bold border group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span
                      className={`text-xs font-black font-mono border px-2 py-0.5 rounded-full ${feature.badgeClass}`}
                    >
                      {feature.badgeText}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                  <span className={feature.footerColor}>{feature.footerText}</span>
                  <span className="font-mono text-slate-400 dark:text-slate-600 text-[11px]">
                    {feature.number}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
