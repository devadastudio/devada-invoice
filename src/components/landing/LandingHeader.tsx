"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, LogIn } from "lucide-react";
import { useAuth } from "@/lib/supabase/auth-context";

export default function LandingHeader() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { label: "Simulateur ROI", href: "#simulateur" },
    { label: "Fonctionnalités", href: "#fonctionnalites" },
    { label: "Comparatif", href: "#comparatif" },
    { label: "Comment ça marche", href: "#comment-ca-marche" },
    { label: "Tarifs", href: "#tarifs" },
    { label: "Témoignages", href: "#temoignages" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/95 dark:bg-[#090D16]/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-slate-800"
            : "bg-white/90 dark:bg-[#090D16]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Container */}
          <Link href="/landing" className="flex items-center gap-3 group focus:outline-none">
            {/* Trèfle géométrique stylisé officiel */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center p-1.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full relative flex items-center justify-center">
                <div className="absolute w-3 h-3 bg-white/90 rounded-full top-0.5"></div>
                <div className="absolute w-3 h-3 bg-white/90 rounded-full bottom-0.5"></div>
                <div className="absolute w-3 h-3 bg-white/90 rounded-full left-0.5"></div>
                <div className="absolute w-3 h-3 bg-white/90 rounded-full right-0.5"></div>
                <div className="relative z-10 w-2 h-2 rounded-full bg-white shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                devada <span className="text-emerald-600 font-black">invoice</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800">
                PRO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {user ? (
              <Link
                href="/"
                className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/25 active:scale-[0.98] transition-all duration-200 gap-1.5"
              >
                <span>Mon Tableau de bord</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-xl transition-colors duration-150"
                >
                  <LogIn className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Se connecter</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="hidden sm:inline-flex items-center justify-center px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/25 active:scale-[0.98] transition-all duration-200"
                >
                  Essai gratuit 14 jours
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-over Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-[#0D121F] shadow-2xl p-6 flex flex-col justify-between border-l border-slate-200/80 dark:border-slate-800 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center p-1 text-white font-bold text-xs">
                    DI
                  </div>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    devada <span className="text-emerald-600">invoice</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Bottom Actions inside Mobile Drawer */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {user ? (
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-sm shadow-blue-500/25"
                >
                  <span>Accéder à mon compte</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm text-center block hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm text-center block shadow-sm shadow-blue-500/25 transition-all"
                  >
                    Essai gratuit 14 jours
                  </Link>
                </>
              )}
              <p className="text-[11px] text-center text-slate-400 pt-2">
                Conforme UEMOA & CEMAC • Zéro CB requise
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
