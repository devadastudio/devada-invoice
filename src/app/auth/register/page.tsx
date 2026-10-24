"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  FileText,
  Globe,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  Briefcase,
  Smartphone,
  Shield,
} from "lucide-react";

const LEGAL_FORMS = [
  { value: "SARL", label: "SARL (Société à Responsabilité Limitée)" },
  { value: "SAS", label: "SAS (Société par Actions Simplifiée)" },
  { value: "SUARL", label: "SUARL (SARL Unipersonnelle)" },
  { value: "SA", label: "SA (Société Anonyme)" },
  { value: "EI", label: "Entreprise Individuelle (EI)" },
  { value: "GIE", label: "GIE (Groupement d'Intérêt Économique)" },
  { value: "Freelance", label: "Consultant Indépendant / Freelance" },
];

const COUNTRIES = [
  { code: "SN", name: "Sénégal 🇸🇳" },
  { code: "CI", name: "Côte d'Ivoire 🇨🇮" },
  { code: "CM", name: "Cameroun 🇨🇲" },
  { code: "ML", name: "Mali 🇲🇱" },
  { code: "GN", name: "Guinée 🇬🇳" },
  { code: "BJ", name: "Bénin 🇧🇯" },
  { code: "TG", name: "Togo 🇹🇬" },
  { code: "BF", name: "Burkina Faso 🇧🇫" },
  { code: "GA", name: "Gabon 🇬🇦" },
  { code: "CG", name: "Congo 🇨🇬" },
  { code: "CD", name: "RD Congo 🇨🇩" },
  { code: "FR", name: "France 🇫🇷" },
  { code: "BE", name: "Belgique 🇧🇪" },
  { code: "MA", name: "Maroc 🇲🇦" },
  { code: "OTHER", name: "Autre pays 🌍" },
];

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  // Étape 1 : Identifiants & Responsable
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Directeur Général");

  // Étape 2 : Profil Entreprise & Mentions Légales
  const [companyName, setCompanyName] = useState("");
  const [legalForm, setLegalForm] = useState("SARL");
  const [ninea, setNinea] = useState("");
  const [rccm, setRccm] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Dakar");
  const [country, setCountry] = useState("Sénégal 🇸🇳");

  // Étape 3 : Coordonnées de Contact de l'Entreprise
  const [companyEmail, setCompanyEmail] = useState("");
  const [emailPec, setEmailPec] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires de l'étape 1.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    // Pré-remplir les contacts avec les infos du dirigeant si vides
    if (!companyEmail) setCompanyEmail(email.trim());
    if (!companyPhone && phone) setCompanyPhone(phone.trim());
    if (!whatsappNumber && phone) setWhatsappNumber(phone.trim());

    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!companyName.trim()) {
      setErrorMessage("La raison sociale de votre entreprise est obligatoire pour la facturation.");
      return;
    }

    setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!companyEmail.trim()) {
      setErrorMessage("L'adresse email de l'entreprise est obligatoire pour la facturation.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Inscription Supabase Auth avec toutes les métadonnées transmises au trigger SQL
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: role.trim(),
            phone: phone.trim(),
            company_name: companyName.trim(),
            legal_form: legalForm,
            ninea: ninea.trim(),
            rccm: rccm.trim(),
            address: address.trim(),
            city: city.trim(),
            country: country.replace(/[^\w\sÀ-ÿ]/gi, "").trim(),
            company_email: companyEmail.trim(),
            email_pec: emailPec.trim(),
            company_phone: companyPhone.trim() || phone.trim(),
            whatsapp: whatsappNumber.trim() || phone.trim(),
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      // Si l'utilisateur est connecté directement (auto-confirm)
      if (data.session && data.user) {
        // Enregistrer explicitement dans company_settings pour garantir l'intégrité
        await supabase
          .from("company_settings")
          .upsert({
            user_id: data.user.id,
            company_name: companyName.trim(),
            legal_form: legalForm,
            ninea: ninea.trim(),
            rccm: rccm.trim(),
            address: address.trim(),
            city: city.trim(),
            country: country.replace(/[^\w\sÀ-ÿ]/gi, "").trim(),
            email: companyEmail.trim(),
            email_pec: emailPec.trim(),
            phone: companyPhone.trim() || phone.trim(),
            whatsapp_number: whatsappNumber.trim() || phone.trim(),
            currency: "FCFA",
            default_tax_rate: 18,
            tax_applicable: true,
          }, { onConflict: "user_id" });

        router.push("/?welcome=true");
        router.refresh();
      } else {
        // Confirmation email requise
        setRegistrationSuccess(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-9 shadow-soft border border-slate-200/80 dark:border-slate-800 rounded-3xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Vérifiez votre boîte de réception
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Un email de confirmation vient d&apos;être envoyé à l&apos;adresse{" "}
              <strong className="text-slate-900 dark:text-white">{email}</strong>. Cliquez sur le lien pour activer votre espace entreprise <strong className="text-slate-900 dark:text-white">{companyName}</strong>.
            </p>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/auth/login"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all"
              >
                <span>Accéder à la page de connexion</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col justify-center py-10 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      {/* Background highlight */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-emerald-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 text-center space-y-2">
        {/* Brand Header */}
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center p-1.5 overflow-hidden">
              <img
                src="/images/devada-logo.png"
                alt="Devada Invoice"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="text-left">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white block leading-none">
              devada<span className="text-emerald-600 dark:text-emerald-400">invoice</span>
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
              Création de Compte Entreprise
            </span>
          </div>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white pt-2">
          {step === 1 && "Vos identifiants de dirigeant"}
          {step === 2 && "Informations légales de l'entreprise"}
          {step === 3 && "Coordonnées officielles de l'entreprise"}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          {step === 1 && "Créez votre accès personnel avant de renseigner les informations légales de votre société."}
          {step === 2 && "Ces informations figureront sur l'en-tête et le pied de page de vos factures officielles conformes à la réglementation du pays où votre entreprise est domiciliée."}
          {step === 3 && "Coordonnées de contact pour vos factures, devis officiels et échanges avec vos clients."}
        </p>

        {/* Step Progress Bar (3 steps) */}
        <div className="pt-3 max-w-xs mx-auto">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
            <span className={step >= 1 ? "text-blue-600 dark:text-blue-400 font-extrabold" : ""}>
              1. Identifiants
            </span>
            <span className={step >= 2 ? "text-blue-600 dark:text-blue-400 font-extrabold" : ""}>
              2. Entreprise
            </span>
            <span className={step >= 3 ? "text-blue-600 dark:text-blue-400 font-extrabold" : ""}>
              3. Contacts
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: step === 1 ? "33.33%" : step === 2 ? "66.66%" : "100%" }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-7 px-6 sm:px-8 shadow-soft border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-5">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ÉTAPE 1 : IDENTIFIANTS */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Nom complet */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Nom & Prénom <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Amadou Diallo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Fonction / Rôle */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Fonction / Rôle
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Directeur Général"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Email personnel */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email de connexion <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="amadou.diallo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Téléphone personnel */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Téléphone personnel
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      placeholder="+221 77 123 45 67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Mot de passe <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Min. 6 caractères"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-9 pr-10 py-2 text-xs bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bouton Suivant */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all mt-4"
              >
                <span>Continuer vers les infos entreprise</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* ÉTAPE 2 : INFORMATIONS LÉGALES ENTREPRISE */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-3.5">
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <span>
                  Ces informations figureront sur l&apos;en-tête et le pied de page de vos factures officielles conformes à la réglementation du pays où votre entreprise est domiciliée.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Raison sociale */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Raison sociale de l&apos;entreprise <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Dakar Digital Agency SARL"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Forme juridique */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Forme
                  </label>
                  <select
                    value={legalForm}
                    onChange={(e) => setLegalForm(e.target.value)}
                    className="block w-full px-3 py-2 text-xs bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  >
                    {LEGAL_FORMS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* NINEA / NIF / SIREN */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Identifiant fiscal (NINEA / NIF / SIREN)
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="006458921 2R8"
                      value={ninea}
                      onChange={(e) => setNinea(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* RCCM / Registre du commerce */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Registre du commerce (RCCM / RCS)
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="SN-DKR-2022-B-1425"
                      value={rccm}
                      onChange={(e) => setRccm(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Adresse du siège */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Adresse du siège
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Immeuble Kébé, Avenue Jean Jaurès, Plateau"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Ville */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Ville
                  </label>
                  <input
                    type="text"
                    placeholder="Dakar"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="block w-full px-3 py-2 text-xs bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Pays de domiciliation */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Pays de domiciliation
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Globe className="h-4 w-4" />
                    </div>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Boutons Navigation Étape 2 */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all"
                >
                  <span>Continuer vers les contacts officiels</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* ÉTAPE 3 : CONTACTS OFFICIELS DE L'ENTREPRISE */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-3.5">
              <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  Ces coordonnées officielles figureront sur vos documents de facturation pour permettre à vos clients de vous joindre et de recevoir leurs quittances.
                </span>
              </div>

              {/* Email professionnel de l'entreprise */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email de facturation de l&apos;entreprise <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="contact@votre-entreprise.sn"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Email PEC (Courrier Électronique Certifié) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email PEC (Courrier Électronique Certifié)
                  </label>
                  <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                    Optionnel
                  </span>
                </div>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-500">
                    <Shield className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="entreprise@pec.sn"
                    value={emailPec}
                    onChange={(e) => setEmailPec(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Téléphone de l'entreprise */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Téléphone de l&apos;entreprise
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      placeholder="+221 33 821 00 00"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Numéro WhatsApp professionnel */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Numéro WhatsApp Pro
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600 dark:text-emerald-400">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      placeholder="+221 77 123 45 67"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Boutons Navigation Étape 3 */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={isLoading}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Finalisation de votre espace...</span>
                    </>
                  ) : (
                    <>
                      <span>Finaliser et créer mon espace</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Déjà un compte */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/auth/login"
                className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Vos données financières sont chiffrées et isolées par Row Level Security (RLS)</span>
        </div>
      </div>
    </div>
  );
}
