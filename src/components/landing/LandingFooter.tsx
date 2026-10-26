"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer
      className="bg-[#090D16] text-white pt-16 pb-12 border-t border-slate-800/80"
      data-purpose="site-footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Column (2 cols) */}
          <div className="lg:col-span-2">
            <Link href="/landing" className="inline-flex items-center gap-3 group">
              {/* Official Stylized Clover Logo */}
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center p-1 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full relative flex items-center justify-center">
                  <div className="absolute w-2 h-2 bg-white/90 rounded-full top-0.5" />
                  <div className="absolute w-2 h-2 bg-white/90 rounded-full bottom-0.5" />
                  <div className="absolute w-2 h-2 bg-white/90 rounded-full left-0.5" />
                  <div className="absolute w-2 h-2 bg-white/90 rounded-full right-0.5" />
                  <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-white">
                  devada{" "}
                  <span className="text-emerald-400 font-black">invoice</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded bg-white/10 text-emerald-400 border border-emerald-500/30">
                  PRO
                </span>
              </div>
            </Link>

            <p className="mt-4 text-xs text-slate-400 max-w-sm leading-relaxed">
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
                  Tarifs &amp; Devises
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
                <a href="#comment-ca-marche" className="hover:text-white transition-colors">
                  Guide fiscal OHADA
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-white transition-colors">
                  Modèles gratuits Word/Excel
                </a>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Centre d&apos;aide &amp; FAQ
                </Link>
              </li>
              <li>
                <a href="#fonctionnalites" className="hover:text-white transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Contact & Bureaux */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Contact &amp; Bureaux
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-mono">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>hello@devadainvoice.com</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed mb-4">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                Dakar (Almadies) — Sénégal<br />
                Abidjan (Cocody) — Côte d&apos;Ivoire
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 text-slate-400">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-blue-600 flex items-center justify-center transition-colors text-white text-xs font-bold"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-blue-600 flex items-center justify-center transition-colors text-white text-xs font-bold"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-blue-600 flex items-center justify-center transition-colors text-white text-xs font-bold"
                aria-label="X / Twitter"
              >
                𝕏
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p className="text-center sm:text-left">
            Devada Invoice SaaS © 2026 — Plateforme de facturation et gestion financière pour entrepreneurs africains.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/help" className="hover:text-slate-400 transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="/help" className="hover:text-slate-400 transition-colors">
              Conditions générales d&apos;utilisation
            </Link>
            <Link href="/help" className="hover:text-slate-400 transition-colors">
              Sécurité des données
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
