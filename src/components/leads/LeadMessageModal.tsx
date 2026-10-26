"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Copy,
  Check,
  Send,
  Loader2,
  RefreshCw,
  MessageCircle,
  Mail,
  Smartphone,
  AlertCircle,
} from "lucide-react";
import { Lead, LeadChannel, LeadTone } from "@/lib/mock-data";
import { generateWhatsAppLink, sanitizeWhatsAppNumber } from "@/lib/utils";

interface LeadMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSaveMessageSuccess?: (leadId: string, content: string) => void;
  senderSector?: string;
  prospectingPitch?: string;
  onLeadContacted?: (leadId: string) => void;
}

export function LeadMessageModal({
  isOpen,
  onClose,
  lead,
  onSaveMessageSuccess,
  senderSector,
  prospectingPitch,
  onLeadContacted,
}: LeadMessageModalProps) {
  const [channel, setChannel] = useState<LeadChannel>("whatsapp");
  const [tone, setTone] = useState<LeadTone>("professional");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with latest message if present, or trigger auto-generation
  useEffect(() => {
    if (isOpen && lead) {
      setError(null);
      setCopied(false);
      const existingMessage = lead.messages && lead.messages.length > 0 ? lead.messages[0] : null;
      if (existingMessage) {
        setMessage(existingMessage.content);
        setSubject(existingMessage.subject || "");
        setChannel(existingMessage.channel || "whatsapp");
        setTone(existingMessage.tone || "professional");
      } else {
        // Auto-generate on open if no message exists
        handleGenerate(channel, tone);
      }
    }
  }, [isOpen, lead?.id]);

  if (!isOpen || !lead) return null;

  const handleGenerate = async (selectedChannel = channel, selectedTone = tone) => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/leads/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadIds: [lead.id],
          channel: selectedChannel,
          tone: selectedTone,
          senderSector,
          prospectingPitch,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Impossible de générer le message");
      }

      if (data.results && data.results.length > 0 && data.results[0].message) {
        const generated = data.results[0].message;
        setMessage(generated.content);
        setSubject(generated.subject || "");
        if (onSaveMessageSuccess) {
          onSaveMessageSuccess(lead.id, generated.content);
        }
      } else {
        throw new Error("Réponse de génération vide");
      }
    } catch (err: any) {
      console.error("Erreur génération message:", err);
      setError(err.message || "Erreur de connexion au service d'IA");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      const fullText = subject ? `Objet : ${subject}\n\n${message}` : message;
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur copie presse-papier:", err);
    }
  };

  const handleOpenWhatsApp = () => {
    if (!lead.phone) return;
    const sanitized = sanitizeWhatsAppNumber(lead.phone);
    if (!sanitized) return;

    const url = generateWhatsAppLink(sanitized, message);
    window.open(url, "_blank");

    if (onLeadContacted) {
      onLeadContacted(lead.id);
    }
    onClose();
  };

  const sanitizedPhone = lead.phone ? sanitizeWhatsAppNumber(lead.phone) : "";
  const charCount = message.length;
  const isOverWhatsAppLimit = channel === "whatsapp" && charCount > 500;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Message de prospection IA
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pour <span className="font-semibold text-slate-700 dark:text-slate-200">{lead.name}</span>
                {lead.category && ` (${lead.category})`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps défilant */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Options de Canal & Ton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Canal */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Canal de contact
              </label>
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setChannel("whatsapp");
                    handleGenerate("whatsapp", tone);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    channel === "whatsapp"
                      ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChannel("email");
                    handleGenerate("email", tone);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    channel === "email"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChannel("sms");
                    handleGenerate("sms", tone);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    channel === "sms"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>SMS</span>
                </button>
              </div>
            </div>

            {/* Ton */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Ton du message
              </label>
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 gap-1">
                {(["professional", "warm", "direct"] as LeadTone[]).map((t) => {
                  const labels = {
                    professional: "Professionnel",
                    warm: "Chaleureux",
                    direct: "Direct",
                  };
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTone(t);
                        handleGenerate(channel, t);
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all text-center ${
                        tone === t
                          ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {labels[t]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Erreur éventuelle */}
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Objet (pour email) */}
          {channel === "email" && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Objet de l'email
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Objet professionnel..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          )}

          {/* Contenu du message */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Corps du message <span className="font-normal text-slate-400">(personnalisable)</span>
              </label>
              <span
                className={`text-[11px] font-mono font-semibold ${
                  isOverWhatsAppLimit
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-slate-400"
                }`}
              >
                {charCount} car. {channel === "whatsapp" && "(max conseillé 500)"}
              </span>
            </div>

            <div className="relative">
              <textarea
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isGenerating}
                placeholder="Le message généré par l'IA apparaîtra ici..."
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-sans transition-all resize-none"
              />
              {isGenerating && (
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-xs font-semibold">Génération du message ciblé avec GPT...</span>
                </div>
              )}
            </div>
          </div>

          {/* Infos de conformité */}
          <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
            💡 L'accroche est automatiquement construite sur les données publiques réelles de la fiche Google Maps (note, avis, site web). Vous gardez le contrôle total avant l'envoi.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 bg-slate-50/80 dark:bg-slate-850/80 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={() => handleGenerate()}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
            <span>Régénérer</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!message || isGenerating}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all disabled:opacity-50 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier</span>
                </>
              )}
            </button>

            {sanitizedPhone && channel === "whatsapp" ? (
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                disabled={!message || isGenerating}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm shadow-emerald-500/25 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ouvrir dans WhatsApp</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all"
              >
                <span>Terminé</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
