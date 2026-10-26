"use client";

import React from "react";
import { Star, Phone, Globe, MapPin, Sparkles, MessageCircle } from "lucide-react";
import { Lead } from "@/lib/mock-data";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { LeadActionsMenu } from "./LeadActionsMenu";
import { sanitizeWhatsAppNumber } from "@/lib/utils";

interface LeadsTableProps {
  leads: Lead[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onGenerateMessage: (lead: Lead) => void;
  onOpenWhatsApp: (lead: Lead) => void;
  onConvertToClient: (lead: Lead) => void;
  onToggleIgnore: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  isLoading?: boolean;
}

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-rose-600",
  "bg-indigo-600",
  "bg-amber-600",
  "bg-teal-600",
];

export function getLeadAvatarBg(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function getLeadInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "LD";
}

export function LeadsTable({
  leads,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onGenerateMessage,
  onOpenWhatsApp,
  onConvertToClient,
  onToggleIgnore,
  onDelete,
  isLoading = false,
}: LeadsTableProps) {
  const allSelected = leads.length > 0 && selectedIds.length === leads.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < leads.length;

  if (isLoading) {
    return (
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden animate-pulse">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex gap-4">
          <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="w-1/4 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="w-1/6 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="w-1/6 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="w-1/6 h-5 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 border-b border-slate-100 dark:border-slate-800 flex gap-4 items-center">
            <div className="w-5 h-5 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="flex-1 space-y-2">
              <div className="w-1/3 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="w-1/4 h-3 bg-slate-100 dark:bg-slate-850 rounded" />
            </div>
            <div className="w-24 h-6 bg-slate-100 dark:bg-slate-800 rounded-full" />
            <div className="w-20 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-soft">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3.5">
          <Sparkles className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Aucun prospect trouvé
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mt-1 mb-4">
          Lancez une recherche ci-dessus pour extraire des entreprises cibles depuis Google Maps avec leurs coordonnées directes.
        </p>
      </div>
    );
  }

  return (
    <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 pl-4 pr-2 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isPartiallySelected;
                  }}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-3">Entreprise & Catégorie</th>
              <th className="py-3.5 px-3">Note & Avis</th>
              <th className="py-3.5 px-3">Téléphone / WhatsApp</th>
              <th className="py-3.5 px-3">Ville & Localisation</th>
              <th className="py-3.5 px-3">Statut</th>
              <th className="py-3.5 pl-3 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {leads.map((lead) => {
              const isSelected = selectedIds.includes(lead.id);
              const avatarBg = getLeadAvatarBg(lead.name);
              const initials = getLeadInitials(lead.name);
              const sanitizedPhone = lead.phone ? sanitizeWhatsAppNumber(lead.phone) : "";

              return (
                <tr
                  key={lead.id}
                  className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group ${
                    isSelected ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3.5 pl-4 pr-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(lead.id)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                    />
                  </td>

                  {/* Nom & Catégorie */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-sm flex-shrink-0 ring-1 ring-black/10 dark:ring-white/10 ${avatarBg} text-white`}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                          {lead.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {lead.category && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {lead.category}
                            </span>
                          )}
                          {lead.website ? (
                            <a
                              href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <Globe className="w-2.5 h-2.5" />
                              Site
                            </a>
                          ) : (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                              • Sans site
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Note ⭐ & Avis */}
                  <td className="py-3.5 px-3">
                    {lead.rating ? (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-mono font-bold text-[11px] border border-amber-200/60 dark:border-amber-800/60">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {lead.rating.toFixed(1)}
                        </span>
                        {lead.reviewsCount !== undefined && (
                          <span className="text-[11px] text-slate-400 font-mono">
                            ({lead.reviewsCount})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">—</span>
                    )}
                  </td>

                  {/* Téléphone / WhatsApp */}
                  <td className="py-3.5 px-3">
                    {lead.phone ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-medium text-slate-700 dark:text-slate-300 text-xs">
                          {lead.phone}
                        </span>
                        {sanitizedPhone && (
                          <span
                            className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px]"
                            title="Numéro compatible WhatsApp"
                          >
                            ✓
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Non renseigné</span>
                    )}
                  </td>

                  {/* Ville & Localisation */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="font-medium truncate max-w-[140px]">
                        {lead.city || lead.address || "Sénégal"}
                      </span>
                    </div>
                  </td>

                  {/* Statut */}
                  <td className="py-3.5 px-3">
                    <LeadStatusBadge status={lead.status} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 pl-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Bouton rapide Message */}
                      <button
                        type="button"
                        onClick={() => onGenerateMessage(lead)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-xs font-semibold transition-all"
                        title="Générer un message de prospection avec l'IA"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Message</span>
                      </button>

                      {/* Menu 3 points contextuel */}
                      <LeadActionsMenu
                        lead={lead}
                        onGenerateMessage={onGenerateMessage}
                        onOpenWhatsApp={onOpenWhatsApp}
                        onConvertToClient={onConvertToClient}
                        onToggleIgnore={onToggleIgnore}
                        onDelete={onDelete}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
