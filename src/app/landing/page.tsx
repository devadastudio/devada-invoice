"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  Zap,
  Globe,
  Smartphone,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Moon,
  Sun,
  ChevronRight,
  TrendingUp,
  Download,
  Share2,
  Building2,
  Receipt,
  Users,
  Check,
} from "lucide-react";
import { cn, formatFCFA } from "@/lib/utils";

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("devada_theme");
    const isDark =
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("devada_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("devada_theme", "light");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] text-slate-800 dark:text-slate-100 transition-colors duration-200 overflow-x-hidden">
      {/* ===== HEADER / NAVIGATION BAR ===== */}
      <header className="sticky top-0 z-50 bg-white/85 dark:bg-[#090D16]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              {/* Clover shape icon */}
              <div className="grid grid-cols-2 gap-0.5 p-1">
                <span className="w-2 h-2 rounded-full bg-white opacity-95" />
                <span className="w-2 h-2 rounded-full bg-white opacity-95" />
                <span className="w-2 h-2 rounded-full bg-white opacity-95" />
                <span className="w-2 h-2 rounded-full bg-white opacity-95" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                devada<span className="text-emerald-600 dark:text-emerald-400">invoice</span>
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60">
                PRO
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Fonctionnalités
            </a>
            <a href="#compliance" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Conformité OHADA & DGID
            </a>
            <a href="#payments" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Wave & Orange Money
            </a>
            <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Actions: Theme Toggle + Open App CTA */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
              aria-label="Changer de thème"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold shadow-sm shadow-blue-500/25 transition-all"
            >
              <span>Accéder à l&apos;application</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle decorative glow circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/10 via-emerald-500/10 to-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Solution SaaS de Facturation N°1 au Sénégal &amp; Zone OHADA</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Facturez vos clients en toute simplicité, en{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">
                FCFA, Euro &amp; Dollar
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              La solution pensée pour les PME, startups et indépendants d&apos;Afrique de l&apos;Ouest :
              conformité fiscale sénégalaise (DGID &amp; OHADA), encaissements Wave &amp; Orange Money,
              génération de factures PDF légères et multilingues en temps réel.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all"
              >
                <Receipt className="w-4 h-4" />
                <span>Ouvrir mon tableau de bord</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/invoices/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 text-sm font-bold shadow-soft transition-all"
              >
                <span>Créer une facture test</span>
              </Link>
            </div>

            {/* Guarantees */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>100% Conforme DGID (TVA 18%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Zéro centime pour le FCFA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Multi-langue FR / EN / IT</span>
              </div>
            </div>
          </div>

          {/* ===== HERO INTERACTIVE PREVIEW CARD ===== */}
          <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
            <div className="p-3 sm:p-5 rounded-3xl bg-slate-900/5 dark:bg-white/5 border border-slate-200/80 dark:border-slate-800 shadow-2xl backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-6">
                {/* Header preview */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Dakar Digital Agency SARL
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        NINEA : 006458921 2R8 • RCCM : SN-DKR-2022-B-1425
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Payée
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                      FAC-2026-0050
                    </span>
                  </div>
                </div>

                {/* Client & Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Facturé à :
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white">Teranga Solutions SARL</p>
                    <p className="text-slate-500">Rue 10 x Boulevard de l&apos;Est, Dakar - Point E</p>
                    <p className="text-slate-400 font-mono text-[11px]">NINEA : 005489123 2G3</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Modalités :
                    </span>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Date d&apos;émission :</span>
                      <strong className="text-slate-900 dark:text-white font-mono">24/10/2026</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Règlement :</span>
                      <strong className="text-blue-600 font-semibold">Wave Business (+221 77 845 22 10)</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Devise :</span>
                      <strong className="text-emerald-600 font-bold">FCFA (XOF)</strong>
                    </div>
                  </div>
                </div>

                {/* Line Item */}
                <div className="border border-slate-200/70 dark:border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                    <span>Prestation</span>
                    <span>Montant HT</span>
                  </div>
                  <div className="p-4 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Développement application web SaaS (Sprint 1)
                      </p>
                      <p className="text-slate-400 text-[11px]">Qté : 1 • Prix unitaire : 1 850 000 FCFA • TVA 18%</p>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                      1 850 000 FCFA
                    </span>
                  </div>
                </div>

                {/* Total & Action row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-400">
                    Calculs automatiques : <strong className="text-slate-700 dark:text-slate-300">TVA 18% (333 000 FCFA)</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 mr-2">Net à payer :</span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                      2 183 000 FCFA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID SECTION ===== */}
      <section id="features" className="py-20 bg-white dark:bg-[#0D121F] border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Conçu pour l&apos;entrepreneuriat moderne
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Toutes les armes pour piloter votre trésorerie
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Gagnez des heures sur la gestion administrative grâce à une suite complète dédiée aux entreprises sénégalaises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Conformité OHADA &amp; NINEA
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Mentions fiscales obligatoires (NINEA, RCCM, TVA 18% sénégalaise, pénalités de retard) intégrées automatiquement à tous vos devis et factures.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Paiements Wave &amp; Orange Money
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Partagez directement vos factures sur WhatsApp avec texte personnalisé et QR codes de paiement mobile pour être réglé 3 fois plus rapidement.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Multilingue &amp; Multi-devises
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Basculez entre le Français 🇫🇷, l&apos;Anglais 🇬🇧 et l&apos;Italien 🇮🇹 en temps réel. Facturez en FCFA, EUR ou USD avec conversion déterministe.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                PDF Vectoriel Ultra-Léger
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Fini les PDF lourds de 5 Mo : Devada Invoice génère des documents vectoriels natifs de 15 Ko avec OCR natif pour des copier-coller parfaits.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tableau de Bord &amp; Suivi Impayés
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Visualisez votre chiffre d&apos;affaires mensuel, les soldes clients en retard et déclenchez des relances amicales en un simple clic.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Annuaire Clients &amp; Synchronisation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Centralisez les coordonnées de vos clients à Dakar, Thiès ou Abidjan, avec email PEC, NINEA certifié et historique de facturation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION PAYMENTS & WHATSAPP ===== */}
      <section id="payments" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Paiements Africains Instantanés
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Faites-vous payer par Wave, Orange Money ou Virement bancaire
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                90% des transactions professionnelles au Sénégal s&apos;effectuent par Mobile Money.
                Devada Invoice intègre vos coordonnées marchandes directement sur le document officiel et génère des liens de règlement instantanés.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Partage WhatsApp natif :</strong> message pré-formaté dans la langue du client avec pièce jointe PDF.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Coordonnées RIB / IBAN BOA &amp; CBAO :</strong> affichage conforme pour vos clients institutionnels.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Enregistrement partiel ou total :</strong> mise à jour instantanée du reste à payer.
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all"
                >
                  <span>Configurer mes moyens de paiement</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-6 bg-gradient-to-tr from-emerald-600/10 via-blue-600/10 to-teal-500/10 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Wave Business Sénégal
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/80">
                      Instantané
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">Compte : Dakar Digital Agency (+221 77 845 22 10)</p>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-600 dark:text-slate-300">
                    Scan direct ou virement Wave sans frais supplémentaires.
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Orange Money Merchant
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200/80">
                      Code Marchand
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">Code Marchand : OM-DKR-5542 (+221 78 520 14 30)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section id="faq" className="py-20 bg-white dark:bg-[#0D121F] border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Questions fréquentes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Tout ce que vous devez savoir sur Devada Invoice
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Mes factures sont-elles conformes à la Direction Générale des Impôts et des Domaines (DGID) ?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Oui, à 100%. Devada Invoice respecte scrupuleusement la législation fiscale sénégalaise et les normes OHADA : intégration obligatoire du NINEA, du RCCM, du taux standard de TVA à 18% (désactivable si vous êtes sous le régime de la franchise de taxe) et des mentions de pénalités légales.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Puis-je facturer des clients internationaux en Euros ou Dollars ?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Absolument. Devada Invoice dispose d&apos;un convertisseur multi-devises automatique. Vous pouvez rédiger vos factures en Euro (€) ou Dollar ($), avec mention automatique du taux de change officiel par rapport au FCFA.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Comment fonctionne l&apos;envoi WhatsApp ?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Un clic sur le bouton WhatsApp ouvre directement votre conversation avec le client, préremplit un message cordial dans la langue choisie (Français, Anglais ou Italien) et vous permet d&apos;attacher le PDF en haute résolution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CALL TO ACTION ===== */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Prêt à professionnaliser votre facturation dès aujourd&apos;hui ?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
            Rejoignez les entrepreneurs sénégalais qui ont simplifié leur gestion et accéléré leurs encaissements avec Devada Invoice.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white text-blue-600 hover:bg-blue-50 active:scale-[0.98] text-sm font-black shadow-xl transition-all"
            >
              <span>Accéder à l&apos;application Devada</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/80 py-8 px-6 text-center text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-[#090D16]">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="font-extrabold text-slate-800 dark:text-slate-200">devada<span className="text-emerald-600">invoice</span></span>
            <span>—</span>
            <span>Dakar Digital Agency SARL</span>
          </div>
          <p>Devada Invoice SaaS © 2026 — Plateforme de facturation et gestion financière pour entrepreneurs africains.</p>
        </div>
      </footer>
    </div>
  );
}
