"use client";

import React, { useState } from "react";
import { Search, MapPin, Briefcase, ChevronDown, ChevronUp, Sparkles, Loader2, History, Lightbulb } from "lucide-react";

interface LeadSearchFormProps {
  onSearch: (params: {
    query: string;
    city: string;
    senderSector?: string;
    prospectingPitch?: string;
    maxResults: number;
  }) => void;
  isSearching: boolean;
  defaultSenderSector?: string;
  defaultPitch?: string;
  onOpenHistory?: () => void;
  searchesCount?: number;
}

const CITY_PRESETS = [
  "Dakar",
  "Thiès",
  "Saint-Louis",
  "Touba",
  "Mbour",
  "Ziguinchor",
  "Kaolack",
  "Rufisque",
];

const SEARCH_EXAMPLES = [
  "Restaurants",
  "Pharmacies",
  "Agences immobilières",
  "Boutiques de mode",
  "Cabinets médicaux",
  "Hôtels",
  "Salons de coiffure",
  "Supermarchés",
];

export function LeadSearchForm({
  onSearch,
  isSearching,
  defaultSenderSector = "",
  defaultPitch = "",
  onOpenHistory,
  searchesCount = 0,
}: LeadSearchFormProps) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Dakar");
  const [customCity, setCustomCity] = useState("");
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [senderSector, setSenderSector] = useState(defaultSenderSector);
  const [pitch, setPitch] = useState(defaultPitch);
  const [maxResults, setMaxResults] = useState<number>(50);
  const [isPitchOpen, setIsPitchOpen] = useState(Boolean(defaultPitch));

  const effectiveCity = isCustomCity ? customCity.trim() || "Dakar" : city;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;

    onSearch({
      query: query.trim(),
      city: effectiveCity,
      senderSector: senderSector.trim() || undefined,
      prospectingPitch: pitch.trim() || undefined,
      maxResults,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 shadow-soft transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Rechercher de nouveaux prospects (B2B)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Scraping Google Maps en direct au Sénégal avec génération de messages WhatsApp sur mesure.
          </p>
        </div>

        {onOpenHistory && searchesCount > 0 && (
          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all self-start sm:self-auto"
          >
            <History className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Historique ({searchesCount})</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4">
          {/* Cible / Quoi chercher */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Type d'entreprises cibles <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex : Restaurants, Pharmacies, Agences..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
              />
            </div>
          </div>

          {/* Secteur de l'utilisateur (Pour le pitch) */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Votre secteur d'activité <span className="text-slate-400 font-normal">(ce que vous vendez)</span>
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={senderSector}
                onChange={(e) => setSenderSector(e.target.value)}
                placeholder="Ex : Agence Web, Cabinet Comptable, Grossiste..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
              />
            </div>
          </div>

          {/* Ville au Sénégal */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Ville ciblée <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              {!isCustomCity ? (
                <select
                  value={city}
                  onChange={(e) => {
                    if (e.target.value === "__custom__") {
                      setIsCustomCity(true);
                    } else {
                      setCity(e.target.value);
                    }
                  }}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium appearance-none cursor-pointer"
                >
                  {CITY_PRESETS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="__custom__">Autre ville...</option>
                </select>
              ) : (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    autoFocus
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="Nom de la ville"
                    className="w-full pl-9 pr-2 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCity(false);
                      setCity("Dakar");
                    }}
                    className="text-xs text-blue-600 hover:underline px-1 whitespace-nowrap"
                  >
                    Liste
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Suggestions rapides */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            Idées :
          </span>
          {SEARCH_EXAMPLES.slice(0, 5).map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setQuery(example)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>

        {/* Section repliable : Votre offre / pitch commercial & options de volume */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => setIsPitchOpen(!isPitchOpen)}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors py-1"
          >
            {isPitchOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{isPitchOpen ? "Masquer les détails de votre proposition" : "Affiner votre offre commerciale & volume (recommandé pour l'IA)"}</span>
          </button>

          {isPitchOpen && (
            <div className="mt-3 p-3.5 bg-slate-50/80 dark:bg-slate-850/60 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-3 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Votre proposition de valeur <span className="text-slate-400 font-normal">(en 1 ou 2 phrases)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    placeholder="Ex : Nous créons des sites vitrines modernes pour augmenter vos réservations WhatsApp sans commission."
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Volume de prospects
                  </label>
                  <select
                    value={maxResults}
                    onChange={(e) => setMaxResults(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer"
                  >
                    <option value={20}>20 prospects (Rapide ~30s)</option>
                    <option value={50}>50 prospects (Recommandé ~1min)</option>
                    <option value={100}>100 prospects (Complet ~2min)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Plafonné à 100 max par recherche.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bouton CTA */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-500/25 transition-all"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Extraction Google Maps en cours...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Trouver des prospects</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
