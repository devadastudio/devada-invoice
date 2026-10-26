"use client";

import React from "react";
import { FileText, Calculator, Smartphone, Users, Sparkles } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      number: "01",
      badge: "Gagnez 4h",
      badgeColor: "text-blue-700 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800",
      iconBg: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900",
      icon: FileText,
      title: "Factures pro en 2 clics",
      description:
        "Modèles modernes et personnalisables avec votre logo d'entreprise, signature numérique scellée et mentions légales locales pré-remplies.",
      footerText: "Personnalisable à 100%",
      accentHover: "hover:border-blue-300 dark:hover:border-blue-700",
      footerColor: "text-blue-600 dark:text-blue-400",
    },
    {
      number: "02",
      badge: "Zéro pénalité DGI",
      badgeColor: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900",
      icon: Calculator,
      title: "TVA 18% automatique",
      description:
        "Calcul instantané du HT, de la TVA standard UEMOA/CEMAC à 18% et du TTC net à payer. Zéro prise de tête avec l'administration fiscale.",
      footerText: "Conforme DGI & UEMOA",
      accentHover: "hover:border-emerald-300 dark:hover:border-emerald-700",
      footerColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      number: "03",
      badge: "Règlement 3x + vite",
      badgeColor: "text-cyan-700 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800",
      iconBg: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-900",
      icon: Smartphone,
      title: "Paiements Mobile Money",
      description:
        "Vos clients cliquent sur un lien et paient instantanément via Wave, Orange Money ou MTN. Les factures se marquent automatiquement comme réglées.",
      footerText: "Wave & Orange Money",
      accentHover: "hover:border-cyan-300 dark:hover:border-cyan-700",
      footerColor: "text-cyan-600 dark:text-cyan-400",
    },
    {
      number: "04",
      badge: "Automatique",
      badgeColor: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900",
      icon: Users,
      title: "Mini-CRM & Relances",
      description:
        "Centralisez vos fiches clients avec historique complet des ventes. Programmez des relances automatiques et courtoises par e-mail et WhatsApp.",
      footerText: "Automatisation WhatsApp",
      accentHover: "hover:border-emerald-300 dark:hover:border-emerald-700",
      footerColor: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <section
      id="fonctionnalites"
      className="py-16 sm:py-24 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-widest shadow-soft">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Fonctionnalités Clés
          </div>

          <h2 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Tout pour gérer votre facturation en{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              toute sérénité
            </span>
          </h2>

          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Développé spécifiquement pour répondre aux exigences fiscales et financières des pays de la zone francophone (UEMOA / CEMAC).
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.number}
                className={`bg-[#F8FAFC] dark:bg-slate-800/60 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-700 shadow-soft hover:shadow-md transition-all duration-200 flex flex-col justify-between group ${feat.accentHover}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border group-hover:scale-105 transition-transform ${feat.iconBg}`}
                    >
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span
                      className={`text-xs font-black font-mono border px-2.5 py-0.5 rounded-full ${feat.badgeColor}`}
                    >
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs font-bold">
                  <span className={feat.footerColor}>{feat.footerText}</span>
                  <span className="font-mono text-slate-400 dark:text-slate-500 text-[11px]">
                    {feat.number}
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
