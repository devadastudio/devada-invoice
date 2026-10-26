"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Check,
  Clock,
  CheckCircle2,
  Zap,
  TrendingUp,
  Share2,
  FileCheck2,
  Smartphone,
  ShieldCheck,
  Receipt,
  FileText,
} from "lucide-react";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<"invoice" | "wave" | "tva">("invoice");

  return (
    <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] dark:from-[#090D16] dark:via-[#0D121F] dark:to-[#090D16]">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none -mr-20 animate-glow" />
      <div className="absolute top-1/2 left-0 w-72 sm:w-80 h-72 sm:h-80 bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-3xl pointer-events-none -ml-20 animate-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Social Proof Pill Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide shadow-soft">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            </span>
            <span>Plus de 2 500 entrepreneurs au Sénégal, Côte d&apos;Ivoire & Cameroun</span>
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

          <p className="mt-5 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            La plateforme de facturation tout-en-un pensée pour les entrepreneurs africains. Créez des
            factures conformes, calculez la TVA 18% en un clic et faites-vous payer plus vite en FCFA.
          </p>

          {/* Buttons Group */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-sm shadow-blue-500/25 active:scale-[0.98] flex items-center justify-center gap-2 transition-all group"
            >
              <span>Commencer gratuitement</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#simulateur"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-semibold text-base border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2.5 transition-all shadow-soft"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </span>
              <span>Calculer mon gain de temps</span>
            </a>
          </div>

          {/* Reassurance & Social Proof Row under CTA */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
            <div className="flex items-center -space-x-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-900 shadow-sm">
                AD
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-900 shadow-sm">
                MK
              </div>
              <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-900 shadow-sm">
                BK
              </div>
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-900 shadow-sm">
                CM
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-amber-500 font-bold">
              <span>★ ★ ★ ★ ★</span>
              <span className="text-slate-900 dark:text-white font-extrabold ml-1">4.9/5</span>
            </div>

            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 font-bold" />
              Zéro carte bancaire
            </span>

            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Prêt en 2 min
            </span>
          </div>
        </div>

        {/* Hero UI Preview Container with Dynamic Gimmicks */}
        <div className="mt-12 sm:mt-14 relative max-w-5xl mx-auto">
          {/* Floating Gimmick Badge Top Left: Facture créée en 38 sec */}
          <div className="hidden lg:flex absolute -left-8 -top-6 z-20 animate-float bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-lg border border-slate-200/90 dark:border-slate-800 items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg font-black border border-amber-200/70 dark:border-amber-900/50">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Ultra-rapide
                </p>
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">Facture créée en 38 sec</p>
            </div>
          </div>

          {/* Floating Badge Left: Timely payment */}
          <div className="hidden lg:flex absolute -left-6 top-1/2 z-20 animate-float-delayed bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-soft border border-slate-200/80 dark:border-slate-800 items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-200/60 dark:border-emerald-900/50">
              ✓
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Encaissement
              </p>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white">+98% payé à temps</p>
            </div>
          </div>

          {/* Floating Gimmick Badge Top Right: +12h gagnées / semaine */}
          <div className="hidden lg:flex absolute -right-8 -top-4 z-20 animate-float-badge bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-lg border border-slate-200/90 dark:border-slate-800 items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-black border border-emerald-200/70 dark:border-emerald-900/50">
              💰
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Productivité x3
              </p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">+12h gagnées / semaine</p>
            </div>
          </div>

          {/* Floating Badge Right: Automatic VAT */}
          <div className="hidden lg:flex absolute -right-6 bottom-10 z-20 animate-float bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-soft border border-slate-200/80 dark:border-slate-800 items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm border border-blue-200/60 dark:border-blue-900/50 font-mono">
              18%
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Zone UEMOA &amp; CEMAC
              </p>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white">TVA 18% automatique</p>
            </div>
          </div>

          {/* Dashboard Mockup Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-md transition-all duration-200 overflow-hidden p-4 sm:p-7 backdrop-blur-sm">
            {/* Interactive Tab Switcher inside Mockup */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center p-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  devada <span className="text-emerald-600">invoice</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800">
                  PRO
                </span>
              </div>

              {/* Interactive Views Tab Navigation */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 gap-1 overflow-x-auto no-scrollbar max-w-full">
                <button
                  type="button"
                  onClick={() => setActiveTab("invoice")}
                  className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === "invoice"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  ⚡ Facturation Instantanée
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("wave")}
                  className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === "wave"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  📱 Rapprochement Wave/OM
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("tva")}
                  className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === "tva"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  📊 Déclaration TVA 18%
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  Devise : FCFA (XOF)
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Wave Connecté
                </span>
              </div>
            </div>

            {/* Tab Content 1: Main Invoice View */}
            {activeTab === "invoice" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-300">
                {/* Invoice Document Preview (Left 7 cols) */}
                <div className="lg:col-span-7 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700 relative">
                  <div className="flex justify-between items-start border-b border-slate-200/80 dark:border-slate-700 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          Facture Définitive
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          CONFORME UEMOA
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                        #FAC-2026-0089
                      </h3>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                        Date : 24/10/2026 • Échéance : À réception
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Payée via Wave
                      </span>
                      <p className="text-[11px] font-mono text-slate-400 mt-1">Réf: WV-983271-SN</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 text-xs gap-3">
                    <div>
                      <p className="text-slate-400 font-medium">Émetteur :</p>
                      <p className="font-bold text-slate-800 dark:text-slate-100">Agence Digitale Dakar SAS</p>
                      <p className="text-slate-500 dark:text-slate-400">Almadies, Dakar (Sénégal)</p>
                      <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        NINEA: 00984321 / RCCM: SN-DKR-2023-B
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Client :</p>
                      <p className="font-bold text-slate-800 dark:text-slate-100">Studio Sahel Tech</p>
                      <p className="text-slate-500 dark:text-slate-400">Plateau, Abidjan (CI)</p>
                      <p className="text-slate-500 dark:text-slate-400">contact@saheltech.ci</p>
                    </div>
                  </div>

                  {/* Line Item */}
                  <div className="mt-5 border-t border-slate-200/80 dark:border-slate-700 pt-3">
                    <div className="flex justify-between text-xs py-1.5 text-slate-700 dark:text-slate-200 font-medium">
                      <span>1. Refonte UX/UI Plateforme SaaS</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        1 450 000 FCFA
                      </span>
                    </div>
                    <div className="flex justify-between text-xs py-1 text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        Taux TVA applicable{" "}
                        <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          Standard 18%
                        </span>
                      </span>
                      <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                        18.00 %
                      </span>
                    </div>
                  </div>

                  {/* Total Box */}
                  <div className="mt-4 bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700 space-y-1.5 text-xs shadow-soft">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Montant Hors Taxe (HT) :</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                        1 450 000 FCFA
                      </span>
                    </div>
                    <div className="flex justify-between text-blue-600 dark:text-blue-400 font-semibold">
                      <span>TVA légale (18%) :</span>
                      <span className="font-mono font-bold">+ 261 000 FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-2">
                      <span className="flex items-center gap-1">
                        Total TTC Réglé : <span className="text-[10px] text-slate-400 font-normal">(XOF)</span>
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 text-base font-mono font-extrabold">
                        1 711 000 FCFA
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats and Payment Hub (Right 5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                  {/* Mini Stats Card */}
                  <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-soft">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Trésorerie encaissée ce mois
                    </span>
                    <div className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white mt-1">
                      9 480 000{" "}
                      <span className="text-sm font-sans font-semibold text-slate-500 dark:text-slate-400">
                        FCFA
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 px-2.5 py-1 rounded-md font-mono flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +34.8% vs M-1
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">8 factures soldées</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all duration-500 w-[78%]" />
                    </div>
                  </div>

                  {/* Mobile Payments Integrated */}
                  <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-inner relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                          Canaux UEMOA &amp; CEMAC
                        </h4>
                        <p className="text-sm font-bold text-white mt-0.5">Encaissement instantané</p>
                      </div>
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                        QR Code Actif
                      </span>
                    </div>

                    <div className="mt-3.5 grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white/10 hover:bg-white/15 p-2 rounded-xl transition-colors border border-white/5">
                        <span className="text-xs font-black text-cyan-300 block">Wave</span>
                        <span className="text-[10px] text-slate-300">1% sans frais</span>
                      </div>
                      <div className="bg-white/10 hover:bg-white/15 p-2 rounded-xl transition-colors border border-white/5">
                        <span className="text-xs font-black text-amber-400 block">Orange Money</span>
                        <span className="text-[10px] text-slate-300">Instantané</span>
                      </div>
                      <div className="bg-white/10 hover:bg-white/15 p-2 rounded-xl transition-colors border border-white/5">
                        <span className="text-xs font-black text-yellow-300 block">MTN MoMo</span>
                        <span className="text-[10px] text-slate-300">Direct wallet</span>
                      </div>
                    </div>

                    <Link
                      href="/auth/register"
                      className="w-full mt-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Générer lien de paiement WhatsApp</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content 2: Wave Reconciliation View */}
            {activeTab === "wave" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-300">
                <div className="lg:col-span-8 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        Rapprochement Mobile Money en Direct (Wave &amp; OM)
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      Synchronisé
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 font-black flex items-center justify-center text-xs">
                          WV
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                            Paiement reçu • Agence Dakar (Facture #FAC-2026-0089)
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            ID: WV-983271-SN • Il y a 6 min
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          +1 711 000 FCFA
                        </p>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-bold">
                          Soldé auto
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-black flex items-center justify-center text-xs">
                          OM
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                            Paiement reçu • BioMarket Abidjan (Facture #FAC-2026-0088)
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            ID: OM-440219-CI • Il y a 42 min
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          +480 000 FCFA
                        </p>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-bold">
                          Soldé auto
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Automatisation Totale
                    </span>
                    <h4 className="text-base font-extrabold mt-1">Zéro pointage manuel</h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Dès que le client valide sur Wave ou Orange Money, le statut passe en &quot;PAYÉ&quot; et le
                      reçu PDF scellé lui est renvoyé en 3 secondes.
                    </p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl mt-4">
                    <div className="text-xs text-slate-300 font-medium">Temps moyen de règlement :</div>
                    <div className="text-xl font-bold font-mono text-cyan-300">4 minutes</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content 3: TVA 18% View */}
            {activeTab === "tva" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-300">
                <div className="lg:col-span-8 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Pré-remplissage Déclaration Fiscale UEMOA (Taux 18%)
                    </h4>
                    <span className="text-xs font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-bold border border-blue-200 dark:border-blue-800">
                      Conforme DGI
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                        Chiffre HT Réalisé
                      </p>
                      <p className="text-base font-mono font-extrabold text-slate-900 dark:text-white mt-1">
                        14 200 000 F
                      </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                        TVA Collectée (18%)
                      </p>
                      <p className="text-base font-mono font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                        2 556 000 F
                      </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                        TVA Déductible
                      </p>
                      <p className="text-base font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                        680 000 F
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-xl border border-blue-200/80 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span>
                      Net TVA à déclarer : <strong className="font-mono text-sm">1 876 000 FCFA</strong>
                    </span>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-[11px] self-start sm:self-auto">
                      Télécharger liasse fiscale
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-emerald-950 text-white rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Sécurité Légale
                    </span>
                    <h4 className="text-base font-extrabold mt-1">0% de pénalités</h4>
                    <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
                      Les arrondis et calculs sont certifiés conformes au code général des impôts (CGI Sénégal,
                      Côte d&apos;Ivoire &amp; Cameroun).
                    </p>
                  </div>
                  <div className="text-[11px] text-emerald-300 font-mono mt-4">Audit fiscal instantané ✓</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
