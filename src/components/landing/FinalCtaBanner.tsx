"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export function FinalCtaBanner() {
  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-[#0D121F] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cobalt Blue & Indigo Gradient Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
          {/* Abstract background blur shapes */}
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-60 h-60 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 text-white text-xs font-extrabold mb-4 tracking-wider border border-white/20">
              REJOIGNEZ LA RÉVOLUTION DE LA FACTURATION
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Rejoins les milliers d&apos;entrepreneurs qui facturent comme des pros.
            </h2>

            <p className="mt-4 text-base sm:text-lg text-white/90 font-normal leading-relaxed max-w-2xl">
              Commence gratuitement dès aujourd&apos;hui. Aucune carte bancaire requise. Configuration en 3 minutes chrono.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-blue-700 hover:bg-slate-50 font-extrabold text-sm tracking-wide transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                <span>Commencer gratuitement</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <span className="text-xs text-white/90 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                Support local disponible en direct sur WhatsApp
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
