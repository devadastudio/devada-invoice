"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Receipt,
  CreditCard,
  Bell,
  Save,
  RotateCcw,
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileText,
  BadgePercent,
  Landmark,
  QrCode,
  Users,
  Eye,
  Upload,
  Image as ImageIcon,
  Trash2,
  PenTool,
  Coins,
  MessageSquare,
  Share2,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import {
  CompanySettings,
  DEFAULT_SETTINGS,
  getStoredSettings,
  saveStoredSettings,
  DEFAULT_WHATSAPP_TEMPLATE_FR,
  DEFAULT_WHATSAPP_TEMPLATE_EN,
  DEFAULT_WHATSAPP_TEMPLATE_IT,
} from "@/lib/mock-data";
import { useAuth } from "@/lib/supabase/auth-context";
import {
  fetchCompanySettings,
  saveCompanySettings,
  uploadCompanyAsset,
} from "@/lib/supabase/db";
import {
  saveStoredLanguage,
  SUPPORTED_LANGUAGES,
  AppLanguage,
  getInvoiceTranslations,
} from "@/lib/i18n";
import { WhatsAppIcon } from "@/lib/whatsapp-utils";
import { cn } from "@/lib/utils";

type SettingsTab =
  | "general"
  | "billing"
  | "payments"
  | "language"
  | "whatsapp"
  | "notifications";

export default function SettingsPage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [whatsappEditLang, setWhatsappEditLang] = useState<AppLanguage>("fr");

  useEffect(() => {
    const load = async () => {
      if (user?.id) {
        try {
          const dbSettings = await fetchCompanySettings(user.id);
          if (dbSettings) {
            setSettings(dbSettings);
            saveStoredSettings(dbSettings);
            return;
          }
        } catch (e) {
          console.error("Erreur chargement settings Supabase:", e);
        }
      }
      setSettings(getStoredSettings());
    };
    load();
  }, [user?.id]);

  const handleChange = <K extends keyof CompanySettings>(key: K, value: CompanySettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleInsertTag = (tag: string) => {
    const key =
      whatsappEditLang === "fr"
        ? "whatsappTemplateFr"
        : whatsappEditLang === "en"
        ? "whatsappTemplateEn"
        : "whatsappTemplateIt";
    const curVal =
      settings[key] ??
      (whatsappEditLang === "fr"
        ? DEFAULT_WHATSAPP_TEMPLATE_FR
        : whatsappEditLang === "en"
        ? DEFAULT_WHATSAPP_TEMPLATE_EN
        : DEFAULT_WHATSAPP_TEMPLATE_IT);
    handleChange(key, curVal + " " + tag);
  };

  const handleResetWhatsAppTemplate = () => {
    const key =
      whatsappEditLang === "fr"
        ? "whatsappTemplateFr"
        : whatsappEditLang === "en"
        ? "whatsappTemplateEn"
        : "whatsappTemplateIt";
    const defaultVal =
      whatsappEditLang === "fr"
        ? DEFAULT_WHATSAPP_TEMPLATE_FR
        : whatsappEditLang === "en"
        ? DEFAULT_WHATSAPP_TEMPLATE_EN
        : DEFAULT_WHATSAPP_TEMPLATE_IT;
    handleChange(key, defaultVal);
    setToastMessage(
      `Modèle WhatsApp (${whatsappEditLang.toUpperCase()}) réinitialisé aux valeurs d'origine.`
    );
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const renderedWhatsAppPreview = React.useMemo(() => {
    const template =
      whatsappEditLang === "fr"
        ? (settings.whatsappTemplateFr ?? DEFAULT_WHATSAPP_TEMPLATE_FR)
        : whatsappEditLang === "en"
        ? (settings.whatsappTemplateEn ?? DEFAULT_WHATSAPP_TEMPLATE_EN)
        : (settings.whatsappTemplateIt ?? DEFAULT_WHATSAPP_TEMPLATE_IT);

    const sampleCur = settings.currency || "FCFA";
    const sampleAmt = sampleCur === "FCFA" ? "1 850 000 FCFA" : "2 800 " + sampleCur;
    const sampleStatus =
      whatsappEditLang === "en" ? "Paid" : whatsappEditLang === "it" ? "Pagata" : "Payée";

    return template
      .replace(/{client_name}/g, "Teranga Solutions SARL")
      .replace(/{invoice_number}/g, "FAC-2026-0051")
      .replace(/{amount}/g, sampleAmt)
      .replace(/{issue_date}/g, "24/10/2026")
      .replace(/{due_date}/g, "08/11/2026")
      .replace(/{status}/g, sampleStatus)
      .replace(/{company_name}/g, settings.companyName || "Dakar Digital Agency");
  }, [settings, whatsappEditLang]);

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("L'image de signature ne doit pas dépasser 2 Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        handleChange("signatureImageData", dataUrl);
        handleChange("signatureType", "image");

        if (user?.id) {
          const uploadRes = await uploadCompanyAsset(file, user.id, "signatures");
          if (uploadRes.url) {
            handleChange("signatureImageData", uploadRes.url);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSignature = () => {
    handleChange("signatureImageData", "");
    handleChange("signatureType", "name");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Le fichier de logo ne doit pas dépasser 2 Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        handleChange("companyLogo", dataUrl);

        if (user?.id) {
          const uploadRes = await uploadCompanyAsset(file, user.id, "logos");
          if (uploadRes.url) {
            handleChange("companyLogo", uploadRes.url);
          }
        }

        setToastMessage("Logo de l'entreprise chargé avec succès !");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    handleChange("companyLogo", "");
    setToastMessage("Logo personnalisé supprimé. Le logo Devada Invoice sera utilisé.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    if (user?.id) {
      await saveCompanySettings(settings, user.id);
    }
    saveStoredSettings(settings);
    saveStoredLanguage(settings.defaultLanguage || "fr");
    setIsSaving(false);
    setToastMessage("Paramètres enregistrés avec succès !");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleReset = async () => {
    if (confirm("Voulez-vous réinitialiser tous les paramètres aux valeurs par défaut ?")) {
      setSettings(DEFAULT_SETTINGS);
      if (user?.id) {
        await saveCompanySettings(DEFAULT_SETTINGS, user.id);
      }
      saveStoredSettings(DEFAULT_SETTINGS);
      setToastMessage("Paramètres réinitialisés avec succès");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const tabs = [
    { id: "general", label: "Entreprise & Légal", icon: Building2 },
    { id: "billing", label: "Facturation & TVA", icon: Receipt },
    { id: "payments", label: "Moyens de paiement", icon: CreditCard },
    { id: "language", label: "Langue & Région", icon: Globe },
    { id: "whatsapp", label: "Messages WhatsApp", icon: Smartphone },
    { id: "notifications", label: "Notifications & Équipe", icon: Bell },
  ] as const;

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
          title="Paramètres de l'entreprise"
          subtitle="Configurez vos mentions légales sénégalaises, fiscalité et coordonnées de paiement"
          onMenuToggle={() => setMobileMenuOpen(true)}
          showPeriodSelector={false}
          showActions={false}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto overflow-hidden">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {settings.companyName || "Configuration de votre entreprise"}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  NINEA : <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{settings.ninea}</span> • RCCM : <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{settings.rccm}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Réinitialiser</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-sm shadow-blue-500/25 transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {isSaving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Enregistrer les modifications</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs (Zero horizontal scroll with overflow-x-auto) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-2xl overflow-x-auto no-scrollbar w-full max-w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all",
                    isActive
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400")} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Informations Entreprise & Légal */}
          {activeTab === "general" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
              {/* Formulaire Entreprise (2 cols) */}
              <div className="lg:col-span-2 space-y-5 sm:space-y-6">
                {/* Logo officiel de facturation */}
                <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        Logo sur les documents de facturation
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Votre logo personnalisé apparaîtra en tête des factures et devis. Si non défini, le logo standard Devada Invoice est utilisé.
                      </p>
                    </div>
                  </div>

                  {settings.companyLogo ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-[180px] max-h-24 flex items-center justify-center overflow-hidden">
                        <img
                          src={settings.companyLogo}
                          alt="Logo entreprise"
                          className="max-h-16 max-w-full object-contain"
                        />
                      </div>
                      <div className="space-y-1 flex-1 text-center sm:text-left">
                        <p className="text-xs font-bold text-emerald-600 flex items-center justify-center sm:justify-start gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Logo personnalisé actif sur vos factures</span>
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Ce logo remplace l&apos;emblème Devada Invoice sur les documents clients et téléchargements PDF.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                        title="Supprimer le logo personnalisé"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <img
                          src="/images/devada-logo.png"
                          alt="Logo standard"
                          className="w-12 h-12 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Logo standard Devada Invoice
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Logo officiel par défaut de la plateforme
                          </p>
                        </div>
                      </div>

                      <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-xl cursor-pointer bg-white dark:bg-slate-900 transition-colors text-center">
                        <Upload className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          Importer le logo de votre entreprise
                        </span>
                        <span className="text-[10px] text-slate-400">
                          PNG transparent ou JPEG (Max 2 Mo)
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Carte Informations Générales */}
                <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        Identité de l'entreprise
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Ces coordonnées apparaîtront en tête de toutes vos factures.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800">
                      Sénégal (SN)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Raison sociale (Nom légal) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={settings.companyName}
                        onChange={(e) => handleChange("companyName", e.target.value)}
                        placeholder="Ex: Dakar Digital Agency SARL"
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Forme juridique
                      </label>
                      <select
                        value={settings.legalForm}
                        onChange={(e) => handleChange("legalForm", e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      >
                        <option value="SARL">SARL (Société à Responsabilité Limitée)</option>
                        <option value="SAS">SAS (Société par Actions Simplifiée)</option>
                        <option value="SUARL">SUARL (Société Unipersonnelle)</option>
                        <option value="SA">SA (Société Anonyme)</option>
                        <option value="EI">Entreprise Individuelle (GIE)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Nom commercial / Marque
                      </label>
                      <input
                        type="text"
                        value={settings.tradeName}
                        onChange={(e) => handleChange("tradeName", e.target.value)}
                        placeholder="Ex: Dakar Digital"
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Numéros d'enregistrement légal DGID & Greffe */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                      Enregistrement légal au Sénégal
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Numéro NINEA <span className="text-rose-500">*</span>
                          </label>
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                            DGID Sénégal
                          </span>
                        </div>
                        <div className="relative">
                          <ShieldCheck className="w-4 h-4 text-emerald-500 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            value={settings.ninea}
                            onChange={(e) => handleChange("ninea", e.target.value)}
                            placeholder="006458921 2R8"
                            className="w-full pl-9 pr-3 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          />
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Numéro d'Identification Nationale des Entreprises et Associations
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Numéro RCCM <span className="text-rose-500">*</span>
                          </label>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            Greffe du Tribunal
                          </span>
                        </div>
                        <div className="relative">
                          <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            value={settings.rccm}
                            onChange={(e) => handleChange("rccm", e.target.value)}
                            placeholder="SN-DKR-2022-B-1425"
                            className="w-full pl-9 pr-3 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          />
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Registre du Commerce et du Crédit Mobilier
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coordonnées & Adresse */}
                <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                    Siège social & Coordonnées
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Adresse du siège social
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={settings.address}
                          onChange={(e) => handleChange("address", e.target.value)}
                          placeholder="Immeuble Kébé, Avenue Jean Jaurès, Plateau"
                          className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Ville & Région
                      </label>
                      <input
                        type="text"
                        value={settings.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        placeholder="Dakar"
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Pays
                      </label>
                      <input
                        type="text"
                        value={settings.country}
                        disabled
                        className="w-full px-3.5 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 cursor-not-allowed font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Téléphone professionnel
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={settings.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder="+221 33 821 00 11"
                          className="w-full pl-9 pr-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Email de facturation
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          value={settings.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          placeholder="contact@dakardigital.sn"
                          className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Site web
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="url"
                          value={settings.website}
                          onChange={(e) => handleChange("website", e.target.value)}
                          placeholder="https://dakardigital.sn"
                          className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aperçu en direct de l'en-tête de facture (1 col) */}
              <div className="space-y-5 sm:space-y-6">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Aperçu sur vos factures
                    </h3>
                  </div>

                  {/* Facture Header Simulator */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        {settings.companyName.slice(0, 2).toUpperCase() || "DD"}
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                        FAC-2026-0048
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {settings.companyName || "Nom de l'entreprise"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {settings.address || "Adresse du siège"}, {settings.city}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {settings.phone} • {settings.email}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-0.5">
                      <p>
                        <span className="text-slate-400">NINEA :</span> {settings.ninea}
                      </p>
                      <p>
                        <span className="text-slate-400">RCCM :</span> {settings.rccm}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Conformément à la législation sénégalaise (Code Général des Impôts), la mention du NINEA et du RCCM est obligatoire sur toutes les factures professionnelles émises.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Facturation & TVA */}
          {activeTab === "billing" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
              <div className="lg:col-span-2 space-y-5 sm:space-y-6">
                <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        Règles fiscales & Numérotation
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Gérez le taux de TVA et la séquence de numérotation légale de vos factures.
                      </p>
                    </div>
                    <BadgePercent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>

                  {/* Devise de facturation par défaut */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Devise monétaire par défaut
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Sera sélectionnée par défaut lors de la création de chaque nouvelle facture
                      </p>
                    </div>
                    <select
                      value={settings.currency || "FCFA"}
                      onChange={(e) => {
                        const newCurr = e.target.value;
                        handleChange("currency", newCurr);
                        const updated = { ...settings, currency: newCurr };
                        saveStoredSettings(updated);
                        setToastMessage(`Devise de facturation mise à jour : ${newCurr}`);
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                      className="px-3.5 py-2 font-mono font-bold text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="FCFA">FCFA (XOF - Franc CFA)</option>
                      <option value="EUR">Euro (€ - EUR)</option>
                      <option value="USD">Dollar ($ - USD)</option>
                    </select>
                  </div>


                  {/* Assujettissement à la TVA */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <label className="text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
                        Entreprise assujettie à la TVA sénégalaise
                      </label>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Appliquer automatiquement la taxe sur la valeur ajoutée sur les factures émises
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange("taxApplicable", !settings.taxApplicable)}
                      className={cn(
                        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500",
                        settings.taxApplicable ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          settings.taxApplicable ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>

                  {/* Taux de TVA standard */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Taux standard de TVA (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={settings.defaultTaxRate}
                          onChange={(e) => handleChange("defaultTaxRate", Number(e.target.value))}
                          disabled={!settings.taxApplicable}
                          min={0}
                          max={100}
                          className="w-full px-3.5 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 disabled:opacity-50"
                        />
                        <span className="absolute right-3.5 top-2 text-sm font-bold text-slate-400">
                          %
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Taux légal DGID au Sénégal : 18%
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Délai de règlement par défaut
                      </label>
                      <select
                        value={settings.defaultDueDays}
                        onChange={(e) => handleChange("defaultDueDays", Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                      >
                        <option value={0}>À réception immédiate</option>
                        <option value={7}>7 jours</option>
                        <option value={15}>15 jours (recommandé)</option>
                        <option value={30}>30 jours</option>
                        <option value={45}>45 jours fin de mois</option>
                      </select>
                    </div>
                  </div>

                  {/* Numérotation des factures */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Séquence & Préfixe de numérotation
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Préfixe des factures
                        </label>
                        <input
                          type="text"
                          value={settings.invoicePrefix}
                          onChange={(e) => handleChange("invoicePrefix", e.target.value)}
                          placeholder="FAC-"
                          className="w-full px-3.5 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Prochain numéro séquentiel
                        </label>
                        <input
                          type="number"
                          value={settings.nextInvoiceSequence}
                          onChange={(e) => handleChange("nextInvoiceSequence", Number(e.target.value))}
                          className="w-full px-3.5 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mentions légales de bas de page */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Mention de pied de page par défaut
                    </label>
                    <textarea
                      rows={3}
                      value={settings.footerLegalText}
                      onChange={(e) => handleChange("footerLegalText", e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all leading-relaxed"
                    />
                  </div>

                  {/* Taux de change multi-devises */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Taux de change de référence (Multi-devises)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Configurez la valeur de conversion des devises. Cette valeur est consignée sur chaque facture émise pour assurer la traçabilité comptable de la période.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Taux 1 Euro (€) en FCFA
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.001"
                            value={settings.rateEur || 655.957}
                            onChange={(e) => handleChange("rateEur", Number(e.target.value))}
                            className="w-full px-3.5 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                          />
                          <span className="absolute right-3.5 top-2 text-xs font-bold text-slate-400">
                            FCFA
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">Parité fixe BCEAO / UEMOA : 655,957 FCFA</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Taux 1 Dollar US ($) en FCFA
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            value={settings.rateUsd || 600.0}
                            onChange={(e) => handleChange("rateUsd", Number(e.target.value))}
                            className="w-full px-3.5 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                          />
                          <span className="absolute right-3.5 top-2 text-xs font-bold text-slate-400">
                            FCFA
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">Ajustable selon le cours de la période</p>
                      </div>
                    </div>

                    {/* Toggle: Affichage du taux de change par défaut */}
                    <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-900 dark:text-white cursor-pointer block">
                          Afficher le taux de change appliqué sur les factures par défaut
                        </label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Si désactivé (recommandé), le taux de change reste masqué sur les factures lors de la création, sauf si activé manuellement dans les options.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleChange(
                            "showExchangeRateOnInvoices",
                            !settings.showExchangeRateOnInvoices
                          )
                        }
                        className={cn(
                          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500",
                          settings.showExchangeRateOnInvoices
                            ? "bg-blue-600"
                            : "bg-slate-300 dark:bg-slate-700"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                            settings.showExchangeRateOnInvoices
                              ? "translate-x-5"
                              : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Signature & Cachet officiel */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Signature autorisée & Cachet sur les factures
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Choisissez d&apos;apposer le nom du dirigeant ou une image de signature réelle (PNG transparent ou JPEG).
                    </p>

                    {/* Mode selection buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleChange("signatureType", "name")}
                        className={cn(
                          "p-3 rounded-xl border text-left transition-all",
                          settings.signatureType === "name"
                            ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <span className="block text-xs font-bold text-slate-900 dark:text-white">
                          Nom textuel officiel
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Signature électronique certifiée par nom
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleChange("signatureType", "image")}
                        className={cn(
                          "p-3 rounded-xl border text-left transition-all",
                          settings.signatureType === "image"
                            ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <span className="block text-xs font-bold text-slate-900 dark:text-white">
                          Image de signature manuscrite / Cachet
                        </span>
                        <span className="text-[10px] text-slate-400">
                          PNG transparent ou JPEG fond blanc
                        </span>
                      </button>
                    </div>

                    {/* Signatory Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Nom et qualité du signataire autorisé
                      </label>
                      <input
                        type="text"
                        value={settings.signatureName || "Moussa Diop"}
                        onChange={(e) => handleChange("signatureName", e.target.value)}
                        placeholder="Ex: Moussa Diop, Directeur Général"
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    {/* Image Upload Box if Image mode */}
                    {settings.signatureType === "image" && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Fichier image de la signature / Cachet (PNG transparent ou JPEG)
                        </label>

                        {settings.signatureImageData ? (
                          <div className="flex items-center gap-4 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg max-w-[160px] max-h-20 flex items-center justify-center overflow-hidden">
                              <img
                                src={settings.signatureImageData}
                                alt="Signature preview"
                                className="max-h-16 max-w-full object-contain"
                              />
                            </div>
                            <div className="space-y-1 flex-1">
                              <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Signature chargée et active</span>
                              </p>
                              <p className="text-[11px] text-slate-400">
                                Elle apparaîtra automatiquement sur toutes les factures et les téléchargements PDF.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveSignature}
                              className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                              title="Supprimer la signature"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl cursor-pointer bg-white dark:bg-slate-900 transition-colors">
                              <Upload className="w-6 h-6 text-slate-400 mb-2" />
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                Cliquez pour importer votre signature
                              </span>
                              <span className="text-[10px] text-slate-400 mt-0.5">
                                PNG avec fond transparent ou JPEG blanc (Max 2 Mo)
                              </span>
                              <input
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={handleSignatureUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Guide fiscalité sénégalaise */}
              <div className="space-y-5">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <HelpCircle className="w-5 h-5" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Règles DGID Sénégal
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Le taux normal de TVA au Sénégal est fixé à <strong>18%</strong> selon l'article 355 du Code Général des Impôts (CGI).
                  </p>

                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 list-disc list-inside">
                    <li>La numérotation doit être continue et sans rupture chronologique.</li>
                    <li>Le calcul de la taxe s'effectue sur le montant Hors Taxes (HT) net de remises.</li>
                    <li>Une facture émise et validée ne peut être supprimée, un avoir doit être émis en cas d'annulation.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Moyens de paiement */}
          {activeTab === "payments" && (
            <div className="space-y-5 sm:space-y-6">
              {/* Carte Wave Business */}
              <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                <div className="flex items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-500 flex items-center justify-center font-bold flex-shrink-0 mt-0.5 sm:mt-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          Wave Business (Sénégal)
                        </h2>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-300 font-bold whitespace-nowrap">
                          Instantané (1%)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        Permettez à vos clients de régler instantanément via leur application Wave
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleChange("waveEnabled", !settings.waveEnabled)}
                    className={cn(
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 sm:mt-0",
                      settings.waveEnabled ? "bg-sky-500" : "bg-slate-300 dark:bg-slate-700"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        settings.waveEnabled ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                {settings.waveEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Numéro de téléphone Wave
                      </label>
                      <input
                        type="text"
                        value={settings.waveNumber}
                        onChange={(e) => handleChange("waveNumber", e.target.value)}
                        placeholder="+221 77 845 22 10"
                        className="w-full px-3.5 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Nom du compte marchand Wave
                      </label>
                      <input
                        type="text"
                        value={settings.waveAccountName}
                        onChange={(e) => handleChange("waveAccountName", e.target.value)}
                        placeholder="Dakar Digital Agency"
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Carte Orange Money Pro */}
              <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                <div className="flex items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-500 flex items-center justify-center font-bold flex-shrink-0 mt-0.5 sm:mt-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          Orange Money Pro (Sonatel)
                        </h2>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 font-bold whitespace-nowrap">
                          Code Marchand
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        Règlement par code USSD #144# ou application Max it
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleChange("omEnabled", !settings.omEnabled)}
                    className={cn(
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 sm:mt-0",
                      settings.omEnabled ? "bg-orange-500" : "bg-slate-300 dark:bg-slate-700"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        settings.omEnabled ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                {settings.omEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Numéro Orange Money
                      </label>
                      <input
                        type="text"
                        value={settings.omNumber}
                        onChange={(e) => handleChange("omNumber", e.target.value)}
                        placeholder="+221 78 520 14 30"
                        className="w-full px-3.5 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Code Marchand (facultatif)
                      </label>
                      <input
                        type="text"
                        value={settings.omMerchantCode}
                        onChange={(e) => handleChange("omMerchantCode", e.target.value)}
                        placeholder="OM-DKR-5542"
                        className="w-full px-3.5 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Carte Stripe (Carte bancaire Visa / Mastercard) */}
              <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                <div className="flex items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold flex-shrink-0 mt-0.5 sm:mt-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          Stripe (Cartes Bancaires Visa & Mastercard)
                        </h2>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-300 font-bold whitespace-nowrap">
                          International
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        Encaissement par cartes bancaires avec support multi-devises (FCFA, EUR, USD)
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleChange("stripeEnabled", !settings.stripeEnabled)}
                    className={cn(
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 sm:mt-0",
                      settings.stripeEnabled ? "bg-violet-600" : "bg-slate-300 dark:bg-slate-700"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        settings.stripeEnabled ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                {settings.stripeEnabled && (
                  <div className="p-3 bg-violet-50/70 dark:bg-violet-950/30 rounded-xl border border-violet-200/60 dark:border-violet-900/40 text-xs text-violet-800 dark:text-violet-300 flex items-center justify-between">
                    <span>Passerelle de paiement sécurisée Stripe Checkout activée.</span>
                    <span className="font-bold text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      Opérationnel
                    </span>
                  </div>
                )}
              </div>

              {/* Carte Virement Bancaire */}
              <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                <div className="flex items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center font-bold flex-shrink-0 mt-0.5 sm:mt-0">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        Virement Bancaire (RIB / IBAN BCEAO)
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        Pour les règlements interbancaires d'entreprises et virements UEMOA
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleChange("bankEnabled", !settings.bankEnabled)}
                    className={cn(
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 sm:mt-0",
                      settings.bankEnabled ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        settings.bankEnabled ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                {settings.bankEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Nom de la banque
                      </label>
                      <input
                        type="text"
                        value={settings.bankName}
                        onChange={(e) => handleChange("bankName", e.target.value)}
                        placeholder="Bank of Africa (BOA Sénégal) / CBAO / Société Générale"
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Titulaire du compte bancaire
                      </label>
                      <input
                        type="text"
                        value={settings.bankAccountHolder}
                        onChange={(e) => handleChange("bankAccountHolder", e.target.value)}
                        placeholder="Dakar Digital Agency SARL"
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        IBAN / Relevé d'Identité Bancaire (RIB)
                      </label>
                      <input
                        type="text"
                        value={settings.bankIban}
                        onChange={(e) => handleChange("bankIban", e.target.value)}
                        placeholder="SN08 SN03 4010 0200 4589 2100 12"
                        className="w-full px-3.5 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Clé RIB
                      </label>
                      <input
                        type="text"
                        value={settings.bankRibKey}
                        onChange={(e) => handleChange("bankRibKey", e.target.value)}
                        placeholder="45"
                        className="w-full px-3.5 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Notifications & Équipe */}
          {activeTab === "notifications" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
              <div className="lg:col-span-2 space-y-5 sm:space-y-6">
                <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                    Rappels automatiques & Notifications
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Rappels par email avant échéance
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Envoyer un rappel courtois au client 3 jours avant la date limite
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleChange("autoPaymentReminder", !settings.autoPaymentReminder)}
                        className={cn(
                          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500",
                          settings.autoPaymentReminder ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                            settings.autoPaymentReminder ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Confirmation d'encaissement
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Recevoir un accusé par email dès qu'un paiement Wave ou virement est enregistré
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleChange("emailNotifications", !settings.emailNotifications)}
                        className={cn(
                          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500",
                          settings.emailNotifications ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                            settings.emailNotifications ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Équipe & Rôles */}
                <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        Membres de l'organisation
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Gestion des droits d'accès à Devada Invoice
                      </p>
                    </div>
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs shadow-sm ring-1 ring-black/10 flex-shrink-0">
                        AD
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          Amadou Diallo
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          amadou@dakardigital.sn
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center pl-13 sm:pl-0">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Propriétaire (Owner)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sécurité */}
              <div className="space-y-5">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Sécurité des données
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Toutes vos informations financières et documents de facturation sont chiffrés en transit (TLS 1.3) et au repos avec isolation stricte des données (Row Level Security).
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                    Dernière sauvegarde automatique : aujourd'hui à 02:40 GMT.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Langue & Région */}
          {activeTab === "language" && (
            <div className="space-y-6">
              {/* Card 1: Langue de la Plateforme */}
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <span>Langue active de la plateforme</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Traduisez l'ensemble de l'interface utilisateur dans votre langue de travail préférée.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
                    {SUPPORTED_LANGUAGES.find((l) => l.code === (settings.defaultLanguage || "fr"))?.flag}{" "}
                    {settings.defaultLanguage?.toUpperCase() || "FR"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = (settings.defaultLanguage || "fr") === lang.code;
                    return (
                      <div
                        key={lang.code}
                        onClick={() => {
                          handleChange("defaultLanguage", lang.code);
                          saveStoredLanguage(lang.code);
                          setToastMessage(`Langue de la plateforme mise à jour : ${lang.name} ${lang.flag}`);
                          setShowToast(true);
                          setTimeout(() => setShowToast(false), 2500);
                        }}
                        className={cn(
                          "p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 relative",
                          isSelected
                            ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 shadow-sm shadow-blue-500/10"
                            : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-3xl">{lang.flag}</span>
                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4" />
                            </span>
                          ) : (
                            <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600" />
                          )}
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{lang.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">({lang.shortName})</span>
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {lang.code === "fr" && "Interface intégrale en français, standard UEMOA et droit comptable OHADA."}
                            {lang.code === "en" && "Complete English interface for international clients, export & cross-border deals."}
                            {lang.code === "it" && "Interfaccia completa in italiano per partner italo-senegalesi e investimenti."}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                          {isSelected ? "✓ Langue active" : "Sélectionner cette langue"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 2: Langue par défaut des factures */}
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Langue par défaut des nouvelles factures
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Chaque nouvelle facture générée pré-sélectionnera automatiquement cette langue. Vous conservez toujours la liberté de modifier la langue lors de la rédaction.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = (settings.defaultLanguage || "fr") === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleChange("defaultLanguage", lang.code)}
                        className={cn(
                          "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all",
                          isSelected
                            ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200 font-bold"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium"
                        )}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <div className="text-xs">
                          <span className="block font-bold">{lang.name}</span>
                          <span className="text-[10px] text-slate-400">Par défaut pour les factures</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card 3: Règle d'or de traçabilité légale */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-800 dark:text-amber-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Règle d'immuabilité et traçabilité des factures déjà générées</span>
                </div>
                <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                  Conformément aux normes OHADA et aux directives du projet, <strong>toute facture déjà créée avec une langue spécifique conserve définitivement cette langue</strong> dans ses registres, son aperçu et son export PDF, même si vous modifiez la langue globale de la plateforme ultérieurement.
                </p>
              </div>
            </div>
          )}

          {/* Tab 5: Messages WhatsApp */}
          {activeTab === "whatsapp" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
              {/* Formulaire & Squelette de message (7 cols) */}
              <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-emerald-600" />
                        <span>Personnalisation des messages WhatsApp</span>
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Définissez le squelette de message envoyé automatiquement avec les factures PDF par WhatsApp.
                      </p>
                    </div>
                  </div>

                  {/* Language Tabs for WhatsApp Template */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Modèle à personnaliser par langue :
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {SUPPORTED_LANGUAGES.map((lang) => {
                        const isActive = whatsappEditLang === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => setWhatsappEditLang(lang.code)}
                            className={cn(
                              "flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold border transition-all text-xs",
                              isActive
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20"
                                : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                            )}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Tags Toolbar */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">
                        Variables dynamiques disponibles (cliquez pour insérer) :
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { tag: "{client_name}", label: "Nom client" },
                        { tag: "{invoice_number}", label: "N° Facture" },
                        { tag: "{amount}", label: "Montant" },
                        { tag: "{due_date}", label: "Échéance" },
                        { tag: "{issue_date}", label: "Émission" },
                        { tag: "{status}", label: "Statut" },
                        { tag: "{company_name}", label: "Entreprise" },
                      ].map(({ tag, label }) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleInsertTag(tag)}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-400 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-mono font-bold transition-colors border border-slate-200/80 dark:border-slate-700"
                          title={`Insérer la variable ${tag}`}
                        >
                          +{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Template Textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Squelette du message ({whatsappEditLang.toUpperCase()}) :
                      </label>
                      <button
                        type="button"
                        onClick={handleResetWhatsAppTemplate}
                        className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restaurer le modèle par défaut</span>
                      </button>
                    </div>
                    <textarea
                      rows={8}
                      value={
                        whatsappEditLang === "fr"
                          ? (settings.whatsappTemplateFr ?? DEFAULT_WHATSAPP_TEMPLATE_FR)
                          : whatsappEditLang === "en"
                          ? (settings.whatsappTemplateEn ?? DEFAULT_WHATSAPP_TEMPLATE_EN)
                          : (settings.whatsappTemplateIt ?? DEFAULT_WHATSAPP_TEMPLATE_IT)
                      }
                      onChange={(e) => {
                        const key =
                          whatsappEditLang === "fr"
                            ? "whatsappTemplateFr"
                            : whatsappEditLang === "en"
                            ? "whatsappTemplateEn"
                            : "whatsappTemplateIt";
                        handleChange(key, e.target.value);
                      }}
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 leading-relaxed font-mono"
                    />
                  </div>

                  {/* WhatsApp Default Language Selection */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Langue par défaut lors du partage WhatsApp :
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {SUPPORTED_LANGUAGES.map((lang) => {
                        const isSelected = (settings.whatsappDefaultLanguage || "fr") === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleChange("whatsappDefaultLanguage", lang.code)}
                            className={cn(
                              "flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all",
                              isSelected
                                ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                                : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                            )}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Live WhatsApp Chat Simulation Preview (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Aperçu simulation WhatsApp (Temps réel)
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600">
                    {whatsappEditLang.toUpperCase()}
                  </span>
                </div>

                {/* Mock Phone / WhatsApp Screen */}
                <div className="bg-[#EFEAE2] dark:bg-[#0b141a] rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative min-h-[380px] flex flex-col justify-between">
                  {/* WhatsApp Chat Header */}
                  <div className="bg-[#008069] text-white p-3 rounded-2xl flex items-center justify-between shadow-sm mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                        TS
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight">Teranga Solutions</p>
                        <p className="text-[10px] text-emerald-100">En ligne</p>
                      </div>
                    </div>
                    <WhatsAppIcon className="w-5 h-5 text-white/90" />
                  </div>

                  {/* WhatsApp Message Bubble */}
                  <div className="space-y-3 flex-1 flex flex-col justify-end">
                    <div className="bg-[#D9FDD3] dark:bg-[#005c4b] text-[#111B21] dark:text-[#E9EDEF] rounded-2xl rounded-tr-none p-3.5 shadow-sm max-w-[94%] ml-auto space-y-2.5 text-xs">
                      {/* Attachment preview */}
                      <div className="p-2.5 bg-black/5 dark:bg-white/10 rounded-xl flex items-center gap-2 border border-black/5 dark:border-white/10">
                        <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold text-[9px]">
                          PDF
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[11px] truncate">Facture_FAC-2026-0051.pdf</p>
                          <p className="text-[9.5px] opacity-75">18 Ko • Document vectoriel OCR</p>
                        </div>
                      </div>

                      {/* Rendered text */}
                      <p className="whitespace-pre-line leading-relaxed text-[11.5px] font-sans">
                        {renderedWhatsAppPreview}
                      </p>

                      <div className="text-right text-[9.5px] text-slate-500 dark:text-slate-400 font-medium pt-1">
                        13:45 • <span className="text-blue-500">✓✓</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-2.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl text-[10.5px] text-slate-600 dark:text-slate-300 text-center border border-slate-200/50 dark:border-slate-800">
                    💡 Les modifications apportées ci-contre sont appliquées en temps réel sur tous les partages de factures.
                  </div>
                </div>
              </div>
            </div>
          )}
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
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
