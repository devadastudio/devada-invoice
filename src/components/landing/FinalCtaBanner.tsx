"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function FinalCtaBanner() {
  return (
    <section className="py-12 sm:py-20 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-12 lg:p-16 text-white shadow-xl relative overflow-hidden">
          {/* Abstract background blur shapes */}
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute left-1/4 top-0 w-60 h-60 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-extrabold uppercase tracking-widest mb-4 border border-white/20">
              Rejoignez la Révolution de la Facturation
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Rejoins les milliers d&apos;entrepreneurs qui facturent comme des pros.
            </h2>

            <p className="mt-4 text-sm sm:text-lg text-white/90 font-normal leading-relaxed">
              Commence gratuitement dès aujourd&apos;hui. Aucune carte bancaire requise. Configuration en 3 minutes chrono.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/auth/register"
                className="px-8 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-slate-50 font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 text-center"
              >
                <span>Commencer gratuitement</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-white/90 bg-white/10 px-3.5 py-2.5 rounded-xl border border-white/15">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <MessageCircle className="w-4 h-4 text-emerald-300 ml-1" />
                <span>Support local disponible en direct sur WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
