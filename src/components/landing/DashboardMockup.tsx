"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { WhatsAppIcon } from "@/lib/whatsapp-utils";

type MockupTab = "invoice" | "wave" | "tva";

export function DashboardMockup() {
  const [activeTab, setActiveTab] = useState<MockupTab>("invoice");

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-md transition-all duration-200 overflow-hidden p-4 sm:p-7 backdrop-blur-sm">
      {/* Interactive Tab Switcher Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center p-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            devada <span className="text-emerald-600 dark:text-emerald-400">invoice</span>
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80">
            PRO
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 gap-1 overflow-x-auto no-scrollbar max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab("invoice")}
            className={`px-3 py-1.5 rounded-lg transition-all text-xs flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "invoice"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <span>⚡</span>
            <span>Facturation Instantanée</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("wave")}
            className={`px-3 py-1.5 rounded-lg transition-all text-xs flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "wave"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <span>📱</span>
            <span>Rapprochement Wave/OM</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tva")}
            className={`px-3 py-1.5 rounded-lg transition-all text-xs flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "tva"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <span>📊</span>
            <span>Déclaration TVA 18%</span>
          </button>
        </div>

        {/* Status Indicators */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
            Devise : FCFA (XOF)
          </span>
          <span className="text-xs font-medium px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Wave Connecté
          </span>
        </div>
      </div>

      {/* Tab 1: Facturation Instantanée */}
      {activeTab === "invoice" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          {/* Invoice Document Preview (Left 7 cols) */}
          <div className="lg:col-span-7 bg-[#F8FAFC] dark:bg-slate-800/50 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200/80 dark:border-slate-700/80 pb-4 gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Facture Définitive
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    CONFORME UEMOA
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                  #DEV-2026-089
                </h3>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                  Date : 24/10/2026 • Échéance : Réception
                </p>
              </div>

              <div className="sm:text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Payée via Wave
                </span>
                <p className="text-[11px] font-mono text-slate-400 mt-1">Réf: WV-983271-SN</p>
              </div>
            </div>

            {/* Issuer & Client metadata */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Émetteur :</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">Agence Digitale Dakar SAS</p>
                <p className="text-slate-500 dark:text-slate-400">Almadies, Dakar (Sénégal)</p>
                <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  NINEA: 00984321 • RCCM: SN-DKR-2023-B
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Client :</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">Studio Sahel Tech</p>
                <p className="text-slate-500 dark:text-slate-400">Plateau, Abidjan (CI)</p>
                <p className="text-slate-500 dark:text-slate-400">contact@saheltech.sn</p>
              </div>
            </div>

            {/* Line items */}
            <div className="mt-5 border-t border-slate-200/80 dark:border-slate-700/80 pt-3 space-y-1.5">
              <div className="flex justify-between text-xs py-1 text-slate-700 dark:text-slate-200 font-medium">
                <span>1. Refonte UX/UI Plateforme SaaS</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">1 450 000 FCFA</span>
              </div>
              <div className="flex justify-between text-xs py-1 text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  Taux TVA applicable{" "}
                  <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded font-bold">
                    Standard 18%
                  </span>
                </span>
                <span className="font-mono font-medium text-slate-700 dark:text-slate-300">18.00 %</span>
              </div>
            </div>

            {/* Calculations Box */}
            <div className="mt-4 bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs shadow-soft">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Montant Hors Taxe (HT) :</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">1 450 000 FCFA</span>
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

          {/* Quick Stats and Mobile Money (Right 5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {/* Treasury KPI Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Trésorerie encaissée ce mois
              </span>
              <div className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white mt-1">
                9 480 000 <span className="text-sm font-sans font-semibold text-slate-500">FCFA</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 px-2.5 py-1 rounded-md font-mono flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +34.8% vs M-1
                </span>
                <span className="text-[11px] text-slate-400 font-medium">8 factures soldées</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: "78%" }} />
              </div>
            </div>

            {/* Mobile Payments Channels Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-inner relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                    Canaux UEMOA & CEMAC
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
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Générer lien de paiement WhatsApp</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Rapprochement Wave & Orange Money */}
      {activeTab === "wave" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          <div className="lg:col-span-8 bg-[#F8FAFC] dark:bg-slate-800/50 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400" />
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Rapprochement Mobile Money en Direct (Wave & OM)
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                Synchronisé
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 font-black flex items-center justify-center text-xs">
                    WV
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Paiement reçu • Agence Dakar (Facture #089)
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">ID: WV-983271-SN • Il y a 6 min</p>
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

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-black flex items-center justify-center text-xs">
                    OM
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Paiement reçu • BioMarket Abidjan (Facture #088)
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">ID: OM-440219-CI • Il y a 42 min</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">+480 000 FCFA</p>
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
                Dès que le client valide sur Wave ou Orange Money, le statut passe en &quot;PAYÉ&quot; et le reçu PDF
                scellé lui est renvoyé en 3 secondes.
              </p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl mt-4">
              <div className="text-xs text-slate-300 font-medium">Temps moyen de règlement :</div>
              <div className="text-xl font-bold font-mono text-cyan-300">4 minutes</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Déclaration Fiscale TVA 18% */}
      {activeTab === "tva" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          <div className="lg:col-span-8 bg-[#F8FAFC] dark:bg-slate-800/50 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Pré-remplissage Déclaration Fiscale UEMOA (Taux 18%)
              </h4>
              <span className="text-xs font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-bold border border-blue-200 dark:border-blue-800">
                Conforme DGI
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  Chiffre HT Réalisé
                </p>
                <p className="text-base font-mono font-extrabold text-slate-900 dark:text-white mt-1">14 200 000 F</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  TVA Collectée (18%)
                </p>
                <p className="text-base font-mono font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                  2 556 000 F
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  TVA Déductible
                </p>
                <p className="text-base font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  680 000 F
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-xl border border-blue-200/80 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span>
                Net TVA à déclarer : <strong className="font-mono text-sm">1 876 000 FCFA</strong>
              </span>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-[11px]">
                Liasse fiscale conforme
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
                Les arrondis et calculs sont certifiés conformes au code général des impôts (CGI Sénégal, Côte d&apos;Ivoire & Cameroun).
              </p>
            </div>
            <div className="text-[11px] text-emerald-300 font-mono mt-4">Audit fiscal instantané ✓</div>
          </div>
        </div>
      )}
    </div>
  );
}
