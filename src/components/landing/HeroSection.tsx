"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Play, Check, Clock, Zap, DollarSign, Percent } from "lucide-react";
import { DashboardMockup } from "./DashboardMockup";

export function HeroSection() {
  return (
    <section
      className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] dark:from-[#090D16] dark:via-[#0D121F] dark:to-[#090D16]"
      data-purpose="hero-section"
    >
      {/* Decorative background blur shapes */}
      <div className="absolute top-1/4 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none -mr-20 animate-pulse-glow" />
      <div className="absolute top-1/2 left-0 w-72 sm:w-80 h-72 sm:h-80 bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-3xl pointer-events-none -ml-20 animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Social Proof Pill Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide shadow-soft">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            </span>
            Plus de 2 500 entrepreneurs au Sénégal, Côte d&apos;Ivoire &amp; Cameroun
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Fini les factures sur{" "}
            <span className="text-slate-400 dark:text-slate-500 line-through decoration-blue-600 decoration-4">
              Word &amp; Excel
            </span>
            .<br />
            <span className="text-blue-600 dark:text-blue-400">Facturez</span>{" "}
            <span className="text-emerald-600 dark:text-emerald-400">comme un pro.</span>
          </h1>

          <p className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            La plateforme de facturation tout-en-un pensée pour les entrepreneurs africains. Créez des
            factures conformes, calculez la TVA 18% en un clic et faites-vous payer plus vite en FCFA.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-base shadow-sm shadow-blue-500/25 active:scale-[0.98] flex items-center justify-center gap-2 transition-all group"
            >
              <span>Commencer gratuitement</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#simulateur"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-base border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2.5 transition-all shadow-soft"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </span>
              <span>Calculer mon gain de temps</span>
            </a>
          </div>

          {/* Reassurance Row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
            <div className="flex items-center -space-x-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 shadow-sm">
                AD
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 shadow-sm">
                MK
              </div>
              <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 shadow-sm">
                BK
              </div>
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-900 ring-1 ring-slate-100 dark:ring-slate-800 shadow-sm">
                CM
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-amber-500 font-bold">
              <span>★ ★ ★ ★ ★</span>
              <span className="text-slate-900 dark:text-white font-extrabold ml-1">4.9/5</span>
            </div>

            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Zéro carte bancaire
            </span>

            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Prêt en 2 min
            </span>
          </div>
        </div>

        {/* Hero Dashboard Preview with 4 Floating Badges */}
        <div className="mt-12 sm:mt-16 relative max-w-5xl mx-auto" data-purpose="hero-dashboard-preview">
          {/* Badge 1: Top Left - Facture créée en 38 sec */}
          <div className="hidden lg:flex absolute -left-8 -top-6 z-20 animate-float bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-lg border border-slate-200/90 dark:border-slate-800 items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg font-black border border-amber-200/70 dark:border-amber-800/60">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Ultra-rapide
                </p>
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                Facture créée en 38 sec
              </p>
            </div>
          </div>

          {/* Badge 2: Mid Left - +98% payé à temps */}
          <div className="hidden lg:flex absolute -left-6 top-1/2 z-20 animate-float-delayed bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-soft border border-slate-200/80 dark:border-slate-800 items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-200/60 dark:border-emerald-800/60">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Encaissement
              </p>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                +98% payé à temps
              </p>
            </div>
          </div>

          {/* Badge 3: Top Right - +12h gagnées / semaine */}
          <div className="hidden lg:flex absolute -right-8 -top-4 z-20 animate-float-badge bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-lg border border-slate-200/90 dark:border-slate-800 items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-black border border-emerald-200/70 dark:border-emerald-800/60">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Productivité x3
              </p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                +12h gagnées / semaine
              </p>
            </div>
          </div>

          {/* Badge 4: Bottom Right - TVA 18% automatique */}
          <div className="hidden lg:flex absolute -right-6 bottom-10 z-20 animate-float bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-soft border border-slate-200/80 dark:border-slate-800 items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm border border-blue-200/60 dark:border-blue-800/60 font-mono">
              18%
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Zone UEMOA &amp; CEMAC
              </p>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                TVA 18% automatique
              </p>
            </div>
          </div>

          {/* Embedded Interactive 3-Tab Mockup */}
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}
