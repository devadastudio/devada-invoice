"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export function FinalCtaBanner() {
  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-[#0D121F]" data-purpose="final-cta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Cobalt Blue Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
          {/* Abstract Background Circle Shape */}
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold mb-4 tracking-wide border border-white/20">
              REJOIGNEZ LA RÉVOLUTION DE LA FACTURATION
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Rejoins les milliers d&apos;entrepreneurs qui facturent comme des pros.
            </h2>

            <p className="mt-4 text-base sm:text-lg text-white/90 font-normal max-w-2xl">
              Commence gratuitement dès aujourd&apos;hui. Aucune carte bancaire requise. Configuration en 3
              minutes chrono.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/auth/register"
                className="px-8 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-slate-50 font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.98] flex items-center gap-2 group"
              >
                <span>Commencer gratuitement</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <span className="text-xs text-white/90 flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Support local disponible en direct sur WhatsApp</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
