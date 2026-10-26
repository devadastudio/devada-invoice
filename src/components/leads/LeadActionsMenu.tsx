"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Sparkles,
  Phone,
  ExternalLink,
  UserPlus,
  EyeOff,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { Lead } from "@/lib/mock-data";
import { sanitizeWhatsAppNumber } from "@/lib/utils";

interface LeadActionsMenuProps {
  lead: Lead;
  onGenerateMessage: (lead: Lead) => void;
  onOpenWhatsApp: (lead: Lead) => void;
  onConvertToClient: (lead: Lead) => void;
  onToggleIgnore: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export function LeadActionsMenu({
  lead,
  onGenerateMessage,
  onOpenWhatsApp,
  onConvertToClient,
  onToggleIgnore,
  onDelete,
}: LeadActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const sanitizedPhone = lead.phone ? sanitizeWhatsAppNumber(lead.phone) : "";

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        title="Actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full mt-1.5 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800 py-1.5 z-40 text-left animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <p className="text-[11px] font-bold text-slate-400 uppercase truncate">
              {lead.name}
            </p>
          </div>

          {/* Générer un message IA */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onGenerateMessage(lead);
            }}
            className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Générer un message (IA)</span>
          </button>

          {/* Ouvrir dans WhatsApp */}
          {sanitizedPhone && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenWhatsApp(lead);
              }}
              className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-semibold transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.18-.544-1.745-.722-2.858-2.518-2.946-2.634-.088-.116-.71-1.026-.71-1.956s.484-1.391.656-1.58c.172-.189.376-.236.502-.236.125 0 .252.002.361.008.115.006.269-.044.421.32.157.375.534 1.303.581 1.399.047.096.079.208.016.333-.063.125-.094.204-.188.314-.094.11-.198.246-.282.33-.095.094-.194.197-.084.385.11.188.489.807 1.05 1.306.723.643 1.332.842 1.52.936.188.094.298.079.409-.047.11-.125.472-.549.598-.737.125-.188.251-.157.422-.094.172.063 1.083.511 1.271.605.188.094.314.141.361.22.047.079.047.456-.097.861z" />
              </svg>
              <span>Envoyer sur WhatsApp</span>
            </button>
          )}

          {/* Appel Téléphonique */}
          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Appeler ({lead.phone})</span>
            </a>
          )}

          {/* Lien Google Maps */}
          {lead.mapsUrl && (
            <a
              href={lead.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Fiche Google Maps</span>
            </a>
          )}

          <div className="my-1 border-t border-slate-100 dark:border-slate-800/80" />

          {/* Convertir en client */}
          {lead.status !== "converted" ? (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onConvertToClient(lead);
              }}
              className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-semibold transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Convertir en client</span>
            </button>
          ) : (
            <div className="px-3 py-1.5 text-xs flex items-center gap-2 text-emerald-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Client créé</span>
            </div>
          )}

          {/* Ignorer / Rétablir */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onToggleIgnore(lead);
            }}
            className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
            <span>{lead.status === "ignored" ? "Rétablir le prospect" : "Marquer comme ignoré"}</span>
          </button>

          <div className="my-1 border-t border-slate-100 dark:border-slate-800/80" />

          {/* Supprimer */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onDelete(lead);
            }}
            className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Supprimer le prospect</span>
          </button>
        </div>
      )}
    </div>
  );
}
