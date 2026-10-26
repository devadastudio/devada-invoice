"use client";

import React from "react";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="bg-[#090D16] text-white pt-16 pb-12 border-t border-slate-800/80" data-purpose="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/landing" className="flex items-center gap-3 group focus:outline-none">
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center p-1 shadow-md">
                <div className="w-full h-full relative flex items-center justify-center">
                  <div className="absolute w-2 h-2 bg-white/90 rounded-full top-0.5" />
                  <div className="absolute w-2 h-2 bg-white/90 rounded-full bottom-0.5" />
                  <div className="absolute w-2 h-2 bg-white/90 rounded-full left-0.5" />
                  <div className="absolute w-2 h-2 bg-white/90 rounded-full right-0.5" />
                  <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-white">
                  devada <span className="text-emerald-400">invoice</span>
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wider rounded bg-white/10 text-emerald-400 border border-emerald-500/30">
                  PRO
                </span>
              </div>
            </Link>

            <p className="mt-4 text-xs text-slate-400 max-w-sm leading-relaxed">
              La solution de facturation intelligente pour indépendants, agences et PME en Afrique. Facturez
              en FCFA, appliquez la TVA 18% et encaissez via Mobile Money.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <span>Fait avec fierté en Afrique 🌍</span>
            </div>
          </div>

          {/* Column 1: Produit */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Produit</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a className="hover:text-white transition-colors" href="#fonctionnalites">
                  Modèles de Factures
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#fonctionnalites">
                  Calculateur TVA 18%
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#fonctionnalites">
                  Intégration Wave &amp; OM
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#simulateur">
                  Simulateur ROI
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#tarifs">
                  Tarifs &amp; Devises
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Ressources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Ressources</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a className="hover:text-white transition-colors" href="#comparatif">
                  Comparatif Excel vs Devada
                </a>
              </li>
              <li>
                <Link className="hover:text-white transition-colors" href="/help">
                  Guide fiscal OHADA
                </Link>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#tarifs">
                  Modèles gratuits Word/Excel
                </a>
              </li>
              <li>
                <Link className="hover:text-white transition-colors" href="/help">
                  Centre d&apos;aide &amp; FAQ
                </Link>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#simulateur">
                  Calculateur de gain
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Bureaux */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Contact &amp; Bureaux</h4>
            <p className="text-xs text-slate-400 mb-2 font-mono">hello@devadainvoice.com</p>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Dakar (Almadies) — Sénégal<br />
              Abidjan (Cocody) — Côte d&apos;Ivoire
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 text-slate-400">
              <a
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-blue-600 flex items-center justify-center transition-colors text-white text-xs font-bold"
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
              >
                f
              </a>
              <a
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-blue-600 flex items-center justify-center transition-colors text-white text-xs font-bold"
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
              >
                in
              </a>
              <a
                aria-label="Twitter X"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-blue-600 flex items-center justify-center transition-colors text-white text-xs font-bold"
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
              >
                𝕏
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>
            Devada Invoice SaaS © 2026 — Plateforme de facturation et gestion financière pour entrepreneurs
            africains.
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <a className="hover:text-slate-400 transition-colors" href="#">
              Politique de confidentialité
            </a>
            <a className="hover:text-slate-400 transition-colors" href="#">
              Conditions générales
            </a>
            <a className="hover:text-slate-400 transition-colors" href="#">
              Sécurité des données
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
