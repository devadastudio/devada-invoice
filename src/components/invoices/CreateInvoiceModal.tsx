"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Plus,
  Trash2,
  Send,
  Save,
  Building2,
  Calendar,
  Sparkles,
  Receipt,
  Check,
} from "lucide-react";
import { formatFCFA, formatDate } from "@/lib/utils";
import {
  Invoice,
  getStoredInvoices,
  saveStoredInvoices,
  getNextInvoiceNumber,
} from "@/lib/mock-data";
import { useAuth } from "@/lib/supabase/auth-context";
import { saveInvoice } from "@/lib/supabase/db";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { AppLanguage, translateItemDescription } from "@/lib/i18n";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

interface NewItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export function CreateInvoiceModal({ isOpen, onClose, onCreated }: CreateInvoiceModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientCity, setClientCity] = useState("Dakar");
  const [issueDate, setIssueDate] = useState("2026-10-24");
  const [dueDate, setDueDate] = useState("2026-11-08");
  const [paymentMethod, setPaymentMethod] = useState("Wave");
  const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);

  const [items, setItems] = useState<NewItem[]>([
    {
      id: "item-1",
      description: "Prestation de conseil & ingénierie logicielle",
      quantity: 1,
      unitPrice: 500000,
      taxRate: 18,
    },
  ]);

  if (!isOpen && !createdInvoice) return null;

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        description: "",
        quantity: 1,
        unitPrice: 0,
        taxRate: 18,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleUpdateItem = (
    id: string,
    field: keyof NewItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  const handleTranslateItemDescription = (id: string, targetLang: AppLanguage) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id || !it.description.trim()) return it;
        return { ...it, description: translateItemDescription(it.description, targetLang) };
      })
    );
  };

  // Calculations
  const subtotalHT = items.reduce(
    (acc, it) => acc + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
    0
  );
  const taxAmount = Math.round(subtotalHT * 0.18);
  const totalTTC = subtotalHT + taxAmount;

  const handleSave = async (status: "draft" | "sent") => {
    if (!clientName.trim()) {
      alert("Veuillez renseigner le nom du client.");
      return;
    }

    const nextNumber = getNextInvoiceNumber();
    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: nextNumber,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim() || "contact@client.sn",
      clientPhone: "+221 77 000 00 00",
      clientCity: clientCity.trim() || "Dakar",
      issueDate,
      dueDate,
      amountHT: subtotalHT,
      taxAmount,
      amountTTC: totalTTC,
      amountPaid: 0,
      balanceDue: totalTTC,
      status,
      items: items.map((it) => ({
        id: it.id,
        description: it.description || "Prestation",
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        taxRate: it.taxRate,
        amount: it.quantity * it.unitPrice,
      })),
      notes: "Paiement exigible sous 15 jours par Wave, Orange Money ou virement bancaire.",
      paymentMethod,
      currency: "XOF",
    };

    if (user?.id) {
      const res = await saveInvoice(newInv, user.id);
      if (res.success && res.id) {
        newInv.id = res.id;
      }
    }

    saveStoredInvoices([newInv, ...getStoredInvoices()]);
    if (onCreated) onCreated();
    setCreatedInvoice(newInv);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200/80 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Créer une nouvelle facture
                  </h3>
                  <p className="text-xs text-slate-500">
                    Séquence automatique conforme OHADA
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <div className="overflow-y-auto p-6 space-y-6 text-xs">
              {/* Client Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Informations du Client
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Nom du client / Entreprise *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Sonatel SA, Wave CI..."
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Email professionnel
                    </label>
                    <input
                      type="email"
                      placeholder="facturation@client.sn"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={clientCity}
                      onChange={(e) => setClientCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Date d&apos;émission
                    </label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Date d&apos;échéance
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Lignes de Prestations
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une ligne</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2.5 items-start sm:items-center"
                    >
                      <div className="flex-1 w-full space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-medium">Description :</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleTranslateItemDescription(item.id, "fr")}
                              className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                              title="Traduire en Français"
                            >
                              🇫🇷 FR
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTranslateItemDescription(item.id, "en")}
                              className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                              title="Traduire en Anglais"
                            >
                              🇬🇧 EN
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTranslateItemDescription(item.id, "it")}
                              className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                              title="Traduire en Italien"
                            >
                              🇮🇹 IT
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="Description de la prestation..."
                          value={item.description}
                          onChange={(e) =>
                            handleUpdateItem(item.id, "description", e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="w-20">
                          <input
                            type="number"
                            min="1"
                            placeholder="Qté"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateItem(
                                item.id,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs text-right focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="w-32">
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            placeholder="Prix unitaire"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleUpdateItem(
                                item.id,
                                "unitPrice",
                                Number(e.target.value)
                              )
                            }
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs text-right font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="w-24 text-right font-mono font-bold text-slate-900 dark:text-white text-xs">
                          {formatFCFA(item.quantity * item.unitPrice)}
                        </div>

                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-2">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Sous-total HT :</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatFCFA(subtotalHT)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>TVA légale (18%) :</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatFCFA(taxAmount)}
                  </span>
                </div>
                <div className="pt-2 border-t border-blue-200/60 dark:border-blue-800/60 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span>Montant Total TTC :</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 text-base">
                    {formatFCFA(totalTTC)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Annuler
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSave("draft")}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer brouillon</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSave("sent")}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-xl shadow-sm shadow-blue-500/20 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Émettre & Envoyer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {createdInvoice && (
        <SuccessModal
          isOpen={!!createdInvoice}
          onClose={() => {
            setCreatedInvoice(null);
            onClose();
          }}
          title="Facture créée avec succès !"
          message={`La facture ${createdInvoice.invoiceNumber} au nom de "${createdInvoice.clientName}" a été générée et enregistrée dans vos comptes.`}
          badgeText="Document Comptable Enregistré"
          details={[
            { label: "Numéro de facture", value: createdInvoice.invoiceNumber, isMono: true },
            { label: "Client destinataire", value: createdInvoice.clientName },
            { label: "Montant total TTC", value: formatFCFA(createdInvoice.amountTTC), isMono: true, isHighlight: true },
            { label: "Date d'échéance", value: formatDate(createdInvoice.dueDate) },
          ]}
          primaryAction={{
            label: "Consulter la facture",
            onClick: () => {
              setCreatedInvoice(null);
              onClose();
              router.push(`/invoices/${createdInvoice.id}`);
            },
          }}
          secondaryAction={{
            label: "Voir les factures",
            onClick: () => {
              setCreatedInvoice(null);
              onClose();
              router.push("/invoices");
            },
          }}
          closeLabel="Fermer"
        />
      )}
    </>
  );
}
