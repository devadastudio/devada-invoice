"use client";

import React from "react";
import { Star, Phone, Globe, MapPin, Sparkles, MessageCircle } from "lucide-react";
import { Lead } from "@/lib/mock-data";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { LeadActionsMenu } from "./LeadActionsMenu";
import { getLeadAvatarBg, getLeadInitials } from "./LeadsTable";
import { sanitizeWhatsAppNumber } from "@/lib/utils";

interface LeadMobileCardsProps {
  leads: Lead[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onGenerateMessage: (lead: Lead) => void;
  onOpenWhatsApp: (lead: Lead) => void;
  onConvertToClient: (lead: Lead) => void;
  onToggleIgnore: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  isLoading?: boolean;
}

export function LeadMobileCards({
  leads,
  selectedIds,
  onToggleSelect,
  onGenerateMessage,
  onOpenWhatsApp,
  onConvertToClient,
  onToggleIgnore,
  onDelete,
  isLoading = false,
}: LeadMobileCardsProps) {
  if (isLoading) {
    return (
      <div className="block md:hidden space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-soft animate-pulse space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="flex-1 space-y-1.5">
                <div className="w-2/3 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="w-1/3 h-3 bg-slate-100 dark:bg-slate-850 rounded" />
              </div>
            </div>
            <div className="h-4 bg-slate-100 dark:bg-slate-850 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="block md:hidden p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-soft">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Aucun prospect trouvé
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Lancez une recherche ci-dessus pour afficher vos prospects cibles.
        </p>
      </div>
    );
  }

  return (
    <div className="block md:hidden space-y-3 w-full max-w-full overflow-hidden">
      {leads.map((lead) => {
        const isSelected = selectedIds.includes(lead.id);
        const avatarBg = getLeadAvatarBg(lead.name);
        const initials = getLeadInitials(lead.name);
        const sanitizedPhone = lead.phone ? sanitizeWhatsAppNumber(lead.phone) : "";

        return (
          <div
            key={lead.id}
            className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all p-4 shadow-soft space-y-3 ${
              isSelected
                ? "border-blue-500 ring-1 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/10"
                : "border-slate-200/80 dark:border-slate-800"
            }`}
          >
            {/* Header: Checkbox + Avatar + Nom + Statut */}
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(lead.id)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer flex-shrink-0"
                />
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-sm flex-shrink-0 ring-1 ring-black/10 dark:ring-white/10 ${avatarBg} text-white`}
                >
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 dark:text-white text-sm truncate">
                    {lead.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {lead.category || "Entreprise"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <LeadStatusBadge status={lead.status} />
                <LeadActionsMenu
                  lead={lead}
                  onGenerateMessage={onGenerateMessage}
                  onOpenWhatsApp={onOpenWhatsApp}
                  onConvertToClient={onConvertToClient}
                  onToggleIgnore={onToggleIgnore}
                  onDelete={onDelete}
                />
              </div>
            </div>

            {/* Détails : Ville, Note, Téléphone, Site */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-800/80">
              {/* Ville */}
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{lead.city || lead.address || "Sénégal"}</span>
              </div>

              {/* Note ⭐ */}
              <div className="flex items-center gap-1 justify-end">
                {lead.rating ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-mono font-bold text-[10px] border border-amber-200/60 dark:border-amber-800/60">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    {lead.rating.toFixed(1)} {lead.reviewsCount ? `(${lead.reviewsCount})` : ""}
                  </span>
                ) : (
                  <span className="text-slate-400 text-[10px]">—</span>
                )}
              </div>

              {/* Téléphone */}
              <div className="flex items-center gap-1.5 col-span-2 text-slate-700 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                {lead.phone ? (
                  <a
                    href={`tel:${lead.phone}`}
                    className="font-mono text-xs font-semibold hover:text-blue-600"
                  >
                    {lead.phone}
                  </a>
                ) : (
                  <span className="text-slate-400 text-xs">Téléphone indisponible</span>
                )}

                {lead.website && (
                  <a
                    href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Globe className="w-3 h-3" />
                    Site web
                  </a>
                )}
              </div>
            </div>

            {/* Boutons d'action tactiles */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onGenerateMessage(lead)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Générer message</span>
              </button>

              {sanitizedPhone && (
                <button
                  type="button"
                  onClick={() => onOpenWhatsApp(lead)}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 hover:bg-emerald-100 text-xs font-semibold transition-all"
                  title="Ouvrir WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
