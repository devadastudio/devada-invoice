"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Globe, Sparkles } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-[#090D16] text-white pt-16 pb-12 border-t border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Column (2 cols) */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center p-1.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full relative flex items-center justify-center">
                  <div className="absolute w-2.5 h-2.5 bg-white/90 rounded-full top-0.5" />
                  <div className="absolute w-2.5 h-2.5 bg-white/90 rounded-full bottom-0.5" />
                  <div className="absolute w-2.5 h-2.5 bg-white/90 rounded-full left-0.5" />
                  <div className="absolute w-2.5 h-2.5 bg-white/90 rounded-full right-0.5" />
                  <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  devada <span className="text-emerald-400 font-black">invoice</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded bg-white/10 text-emerald-400 border border-emerald-500/30">
                  PRO
                </span>
              </div>
            </Link>

            <p className="mt-4 text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              La solution de facturation intelligente pour indépendants, agences et PME en Afrique. Facturez en FCFA, appliquez la TVA 18% et encaissez via Mobile Money.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <span>Fait avec fierté en Afrique 🌍</span>
            </div>
          </div>

          {/* Links Column 1: Produit */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Produit
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#fonctionnalites" className="hover:text-white transition-colors">
                  Modèles de Factures
                </a>
              </li>
              <li>
                <a href="#fonctionnalites" className="hover:text-white transition-colors">
                  Calculateur TVA 18%
                </a>
              </li>
              <li>
                <a href="#fonctionnalites" className="hover:text-white transition-colors">
                  Intégration Wave &amp; MoMo
                </a>
              </li>
              <li>
                <a href="#simulateur" className="hover:text-white transition-colors">
                  Simulateur ROI
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-white transition-colors">
                  Tarifs &amp; Devises FCFA
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Ressources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Ressources
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#comparatif" className="hover:text-white transition-colors">
                  Comparatif Excel vs Devada
                </a>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Centre d&apos;aide &amp; FAQ
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  Guide fiscal OHADA (Bientôt)
                </span>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  Modèles gratuits Word/Excel
                </span>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  API Documentation
                </span>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Contact & Bureaux */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Contact &amp; Bureaux
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 font-mono text-slate-300">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>hello@devadainvoice.com</span>
              </div>
              <div className="flex items-start gap-2 leading-relaxed">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Dakar (Almadies) — Sénégal<br />
                  Abidjan (Cocody) — Côte d&apos;Ivoire
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-5 flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Espace Connexion →
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4 text-center sm:text-left">
          <p>
            Devada Invoice SaaS © 2026 — Plateforme de facturation et gestion financière pour entrepreneurs africains.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/help" className="hover:text-slate-400 transition-colors">
              Support &amp; Assistance
            </Link>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">
              Politique de confidentialité
            </span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">
              Conditions générales
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
