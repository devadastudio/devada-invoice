"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  BookOpen,
  Receipt,
  Smartphone,
  ShieldCheck,
  ChevronDown,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  MapPin,
  Check,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  category: "tax" | "payments" | "invoices" | "legal";
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "tax",
    question: "Comment configurer le taux de TVA à 18% conformément aux règles de la DGID ?",
    answer:
      "Au Sénégal, le taux normal de TVA est de 18% selon l'article 355 du Code Général des Impôts (CGI). Dans Devada Invoice, ce taux est configuré par défaut dans la rubrique Paramètres > Facturation & TVA. Si votre entreprise n'est pas assujettie à la TVA (par exemple si vous relevez du régime de la Contribution Globale Unique - CGU), vous pouvez désactiver l'application de la TVA en un clic.",
  },
  {
    id: "faq-2",
    category: "legal",
    question: "Pourquoi le NINEA et le RCCM sont-ils indispensables sur mes factures ?",
    answer:
      "Le NINEA (Numéro d'Identification Nationale des Entreprises et Associations) délivré par la DGID et le RCCM (Registre du Commerce et du Crédit Mobilier) constituent l'identité juridique obligatoire de toute entreprise sénégalaise. Ils permettent la déductibilité de la TVA pour vos clients professionnels et garantissent la validité légale de vos factures.",
  },
  {
    id: "faq-3",
    category: "payments",
    question: "Comment mes clients peuvent-ils me régler par Wave ou Orange Money ?",
    answer:
      "Renseignez simplement vos numéros professionnels Wave Business ou Orange Money dans l'onglet Paramètres > Moyens de paiement. Vos coordonnées apparaîtront automatiquement sur chaque facture émise. Dès réception des fonds sur votre téléphone, vous pouvez cliquer sur « Enregistrer un paiement » sur la facture correspondante pour actualiser son statut en « Payée ».",
  },
  {
    id: "faq-4",
    category: "invoices",
    question: "Puis-je modifier ou supprimer une facture déjà émise ? (Normes OHADA)",
    answer:
      "Conformément aux normes comptables OHADA et à la réglementation fiscale sénégalaise, une facture émise et transmise ne peut pas être purement supprimée afin d'assurer l'inviolabilité de la comptabilité. En cas d'erreur ou d'annulation convenue avec le client, vous devez émettre une facture d'avoir (montant négatif) qui annule comptablement la facture d'origine.",
  },
  {
    id: "faq-5",
    category: "invoices",
    question: "Comment fonctionne la numérotation automatique des factures ?",
    answer:
      "Devada Invoice attribue automatiquement un numéro chronologique et séquentiel sans rupture (ex: FAC-2026-0048, FAC-2026-0049). Vous pouvez personnaliser le préfixe dans vos paramètres. Les brouillons reçoivent un numéro définitif au moment précis de leur émission.",
  },
  {
    id: "faq-6",
    category: "payments",
    question: "Quels sont les frais de transaction avec Wave Business au Sénégal ?",
    answer:
      "Wave applique des frais forfaitaires de 1% sur les encaissements marchands. Devada Invoice ne prélève aucune commission supplémentaire sur vos encaissements : vous conservez 100% du montant de vos prestations.",
  },
  {
    id: "faq-7",
    category: "legal",
    question: "Pendant combien de temps dois-je conserver mes factures au Sénégal ?",
    answer:
      "Selon le Code de Commerce OHADA et le Code Général des Impôts du Sénégal, tous les documents comptables et factures professionnelles doivent être conservés pendant un délai minimal de dix (10) ans. Toutes vos factures créées sur Devada Invoice sont archivées de manière sécurisée et téléchargeables en PDF à tout moment.",
  },
];

export default function HelpPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-1");

  // Contact form state
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Facturation");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSending, setTicketSending] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Filter FAQ
  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    setTicketSending(true);
    setTimeout(() => {
      setTicketSending(false);
      setShowToast(true);
      setTicketSubject("");
      setTicketMessage("");
      setTimeout(() => setShowToast(false), 4000);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex w-full max-w-full overflow-x-clip">
      {/* Universal Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-[260px] flex flex-col min-h-screen w-full max-w-full overflow-x-clip">
        <Header
          title="Centre d'Aide & Support"
          subtitle="Guides d'utilisation, réponses à vos questions et assistance à Dakar"
          onMenuToggle={() => setMobileMenuOpen(true)}
          showPeriodSelector={false}
          showActions={false}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl w-full mx-auto overflow-hidden">
          {/* Hero Banner with Search */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-6 sm:p-10 shadow-lg shadow-blue-900/10">
            {/* Background glowing circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-2xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Support dédié aux entrepreneurs sénégalais & ouest-africains</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                Comment pouvons-nous vous aider ?
              </h1>
              <p className="text-sm text-slate-200">
                Recherchez une solution, explorez nos guides fiscaux ou contactez directement notre équipe à Dakar.
              </p>

              {/* Search Bar */}
              <div className="relative pt-2">
                <div className="relative flex items-center shadow-2xl">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: Taux de TVA 18%, Wave Business, NINEA, facture d'avoir..."
                    className="w-full pl-12 pr-4 py-3.5 text-sm rounded-2xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-400/30 font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-slate-700 px-2 py-1 rounded-md bg-slate-100"
                    >
                      Effacer
                    </button>
                  )}
                </div>

                {/* Popular Keywords Tags */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs">
                  <span className="text-slate-300">Recherches fréquentes :</span>
                  {["TVA 18%", "Wave Business", "NINEA & RCCM", "Mentions légales", "Avoir"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-medium text-[11px] transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4 Interactive Theme Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("invoices");
                setSearchQuery("");
              }}
              className="text-left p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-md hover:border-blue-500/40 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Factures & Avoirs
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Création en split-view, numérotation automatique et conformité OHADA.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory("tax");
                setSearchQuery("");
              }}
              className="text-left p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-md hover:border-emerald-500/40 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Fiscalité & DGID
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                TVA 18% sénégalaise, identification NINEA et mentions obligatoires.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory("payments");
                setSearchQuery("");
              }}
              className="text-left p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-md hover:border-sky-500/40 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Smartphone className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                Wave & Orange Money
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Encaissements mobiles, codes marchands et virements bancaires BCEAO.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory("legal");
                setSearchQuery("");
              }}
              className="text-left p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-md hover:border-violet-500/40 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                Cadre Légal & OHADA
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Conservation sur 10 ans, délais de paiement et sécurité des données.
              </p>
            </button>
          </div>

          {/* Main 2-column section: FAQ on left, Contact & Status on right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left 2 Cols: FAQ Accordions */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Foire Aux Questions (FAQ)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Réponses détaillées aux questions courantes des entrepreneurs
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                  {[
                    { id: "all", label: "Toutes" },
                    { id: "tax", label: "Fiscalité" },
                    { id: "payments", label: "Paiements" },
                    { id: "invoices", label: "Factures" },
                    { id: "legal", label: "Légal" },
                  ].map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                        selectedCategory === category.id
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQ Accordion List */}
              {filteredFaqs.length > 0 ? (
                <div className="space-y-3">
                  {filteredFaqs.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className={cn(
                          "rounded-2xl border transition-all duration-200 overflow-hidden",
                          isOpen
                            ? "bg-white dark:bg-slate-900 border-blue-500/40 shadow-sm"
                            : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full flex items-center justify-between p-4 sm:p-5 text-left gap-4"
                        >
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {faq.question}
                          </span>
                          <div
                            className={cn(
                              "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200",
                              isOpen
                                ? "rotate-180 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                                : "text-slate-400"
                            )}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 leading-relaxed space-y-2 animate-in fade-in duration-200">
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6">
                  <HelpCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Aucun résultat trouvé pour « {searchQuery} »
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Essayez d'autres mots-clés ou envoyez directement un message à notre support ci-contre.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="mt-4 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Réinitialiser la recherche
                  </button>
                </div>
              )}

              {/* Quick Guide to Create an Invoice */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 dark:border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Démarrage rapide : 3 étapes pour émettre votre première facture</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                  <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/70 dark:border-slate-800">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">1.</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-1">Vos coordonnées</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Renseignez votre NINEA & RCCM dans les Paramètres.</p>
                  </div>
                  <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/70 dark:border-slate-800">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">2.</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-1">Ajouter un client</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Créez votre client avec son adresse et téléphone.</p>
                  </div>
                  <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/70 dark:border-slate-800">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">3.</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-1">Créer la facture</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Ajoutez vos prestations en FCFA et validez en 1 clic.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Contact Support & Status */}
            <div className="space-y-5">
              {/* Dakar Hotline & Assistance directe */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Assistance Directe Dakar
                    </h3>
                    <p className="text-[11px] text-slate-400">Équipe locale disponible</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Phone */}
                  <a
                    href="tel:+221338210011"
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        +221 33 821 00 11
                      </p>
                      <p className="text-[11px] text-slate-400">Lun - Ven, 8h30 - 18h30 GMT</p>
                    </div>
                  </a>

                  {/* WhatsApp Direct */}
                  <a
                    href="https://wa.me/221778452210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 hover:bg-emerald-100/50 transition-colors group"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="font-bold text-emerald-800 dark:text-emerald-300">
                        WhatsApp : +221 77 845 22 10
                      </p>
                      <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400">
                        Support prioritaire (Réponse en -15 min)
                      </p>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:support@devadainvoice.com"
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        support@devadainvoice.com
                      </p>
                      <p className="text-[11px] text-slate-400">Support par ticket écrit</p>
                    </div>
                  </a>

                  {/* Address */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      Immeuble Kébé, Avenue Jean Jaurès, Plateau, Dakar, Sénégal.
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Status Card */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Statut de la plateforme
                  </h3>
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Opérationnel
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Moteur de Facturation</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">99.98%</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Génération PDF OHADA</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">100%</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Passerelles Wave & OM</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Actives</span>
                  </div>
                </div>
              </div>

              {/* Support Ticket Quick Form */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Envoyer un message au support
                  </h3>
                </div>

                <form onSubmit={handleSendTicket} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Sujet de votre demande
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="Ex: Question sur la TVA 18%..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Catégorie
                    </label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      <option value="Facturation">Facturation & TVA</option>
                      <option value="Wave / OM">Paiement Wave ou Orange Money</option>
                      <option value="Clients">Gestion des clients</option>
                      <option value="Technique">Question technique / Bug</option>
                      <option value="Autre">Autre demande</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Votre message
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Expliquez-nous précisément votre besoin..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={ticketSending}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {ticketSending ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Envoyer la demande</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/60 dark:border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 dark:text-slate-500">
          <p>
            Devada Invoice SaaS © 2026 — Plateforme de facturation et gestion financière pour entrepreneurs africains.
          </p>
        </footer>
      </div>

      {/* Floating Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl border border-slate-700/50 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">
            Message envoyé à notre équipe de Dakar ! Nous vous répondrons sous peu.
          </span>
        </div>
      )}
    </div>
  );
}
