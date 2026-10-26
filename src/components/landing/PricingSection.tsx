"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export function PricingSection() {
  return (
    <section
      className="py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#090D16] border-t border-slate-200/80 dark:border-slate-800/80"
      data-purpose="pricing-section"
      id="tarifs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 px-3.5 py-1 rounded-full inline-block">
            TARIFS TRANSPARENTS
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Un investissement rentable dès votre{" "}
            <span className="text-blue-600 dark:text-blue-400">première facture</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Sans engagement, sans frais cachés. Paiement en FCFA par Mobile Money (Wave, Orange Money) ou Carte
            bancaire.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Plan 1: Gratuit */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col justify-between">
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-4">
                Pour démarrer
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Plan Gratuit</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Parfait pour tester et lancer votre activité
              </p>

              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white">0</span>
                <span className="text-slate-500 dark:text-slate-400 font-mono font-semibold text-sm">
                  {" "}
                  FCFA / mois
                </span>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Jusqu&apos;à 5 factures &amp; devis par mois</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>1 utilisateur</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Calcul automatique TVA 18%</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Export PDF propre avec filigrane</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/auth/register"
                className="w-full block py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-center font-semibold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
              >
                Démarrer gratuitement
              </Link>
            </div>
          </div>

          {/* Plan 2: Pro (FEATURED) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-blue-600 ring-2 ring-blue-600/20 shadow-pop flex flex-col justify-between relative transform lg:-translate-y-2">
            {/* Popular Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
              LE PLUS POPULAIRE
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 mb-4 border border-blue-200/60 dark:border-blue-800/60">
                Indépendants &amp; TPE
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Plan Pro</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Pour les professionnels actifs voulant automatiser
              </p>

              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white">
                  30 000
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-mono font-semibold text-sm">
                  {" "}
                  FCFA / mois
                </span>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-6">
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    Factures et devis <strong className="text-slate-900 dark:text-white font-semibold">illimités</strong>
                  </span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Relances automatiques WhatsApp &amp; Email</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Intégration Wave &amp; Orange Money direct</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Multi-devises (FCFA XOF/XAF, EUR, USD)</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Personnalisation sans filigrane + Logo</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Support prioritaire 7j/7 WhatsApp</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/auth/register"
                className="w-full block py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-center font-medium text-sm text-white shadow-sm shadow-blue-500/25 active:scale-[0.98] transition-all"
              >
                Choisir le Plan Pro
              </Link>
            </div>
          </div>

          {/* Plan 3: Business */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col justify-between">
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-4">
                Agences &amp; PME
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Plan Business</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Pour les équipes et structures en forte croissance
              </p>

              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white">
                  50 000
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-mono font-semibold text-sm">
                  {" "}
                  FCFA / mois
                </span>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Utilisateurs et collaborateurs illimités</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Gestion fine des rôles (comptable, commercial)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Tableau de bord financier &amp; trésorerie avancé</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Rapprochement bancaire automatisé</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>API &amp; Export direct vers votre logiciel comptable</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/auth/register"
                className="w-full block py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-center font-semibold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
              >
                Choisir le Plan Business
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
