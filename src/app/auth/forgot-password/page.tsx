"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage("Veuillez renseigner votre adresse email.");
      return;
    }

    setIsLoading(true);

    try {
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000";

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/auth/reset-password`,
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Une erreur est survenue lors de l'envoi du lien."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      {/* Background radial highlight */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/10 via-emerald-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        {/* Brand Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
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
              Récupération de Compte
            </span>
          </div>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white pt-2">
          Mot de passe oublié ?
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Renseignez l&apos;adresse email associée à votre compte Devada Invoice pour recevoir un lien de réinitialisation sécurisé.
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-9 shadow-soft border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-6">
          {/* Success state */}
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Email de récupération envoyé
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Si un compte existe pour l&apos;adresse{" "}
                <strong className="text-slate-900 dark:text-white">{email}</strong>, vous recevrez un email contenant les instructions pour réinitialiser votre mot de passe d&apos;ici quelques instants.
              </p>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/auth/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour à la page de connexion</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-4">
              {/* Error Message */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Email professionnel ou personnel
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="directeur@dakar-tech.sn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm shadow-blue-500/25 transition-all disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Envoyer le lien de réinitialisation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Back to Login Link */}
              <div className="pt-3 text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour à la connexion</span>
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Security badge footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Lien temporaire chiffré à usage unique</span>
        </div>
      </div>
    </div>
  );
}
