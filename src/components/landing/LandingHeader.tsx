"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Moon, Sun, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/supabase/auth-context";

interface LandingHeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function LandingHeader({ isDarkMode, onToggleDarkMode }: LandingHeaderProps) {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Simulateur ROI", href: "#simulateur" },
    { label: "Fonctionnalités", href: "#fonctionnalites" },
    { label: "Comparatif", href: "#comparatif" },
    { label: "Comment ça marche", href: "#comment-ca-marche" },
    { label: "Tarifs", href: "#tarifs" },
    { label: "Témoignages", href: "#temoignages" },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 dark:bg-[#090D16]/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-slate-800/80"
          : "bg-white/80 dark:bg-[#090D16]/80 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-800/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/landing" className="flex items-center gap-3 group focus:outline-none">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center p-1.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full relative flex items-center justify-center">
              <div className="absolute w-3 h-3 bg-white/90 rounded-full top-0.5" />
              <div className="absolute w-3 h-3 bg-white/90 rounded-full bottom-0.5" />
              <div className="absolute w-3 h-3 bg-white/90 rounded-full left-0.5" />
              <div className="absolute w-3 h-3 bg-white/90 rounded-full right-0.5" />
              <div className="relative z-10 w-2 h-2 rounded-full bg-white shadow-sm" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              devada <span className="text-emerald-600 dark:text-emerald-400 font-black">invoice</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80">
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
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA & Theme Toggle */}
        <div className="hidden sm:flex items-center gap-3.5">
          {/* Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {user ? (
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/25 active:scale-[0.98] transition-all duration-200"
            >
              <span>Accéder au tableau de bord</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              {/* Login Button with direct redirect to /auth/login */}
              <Link
                href="/auth/login"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-xl"
              >
                Se connecter
              </Link>
              {/* Register CTA Button */}
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/25 active:scale-[0.98] transition-all duration-200"
              >
                Essai gratuit 14 jours
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            aria-label="Changer de thème"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#090D16]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            {user ? (
              <Link
                href="/"
                onClick={handleLinkClick}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm text-center shadow-sm shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <span>Accéder au tableau de bord</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={handleLinkClick}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Se connecter
                </Link>
                <Link
                  href="/auth/register"
                  onClick={handleLinkClick}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm text-center shadow-sm shadow-blue-500/25 active:scale-[0.98] transition-all"
                >
                  Essai gratuit 14 jours
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
