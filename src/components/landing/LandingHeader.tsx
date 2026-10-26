"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Moon, Sun, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LandingHeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function LandingHeader({ isDarkMode, onToggleDarkMode }: LandingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#090D16]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo Container */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Trèfle géométrique stylisé officiel */}
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
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60">
              PRO
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA & Theme Toggle */}
        <div className="hidden sm:flex items-center gap-3.5">
          {/* Theme Switcher */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Connexion Link */}
          <Link
            href="/auth/login"
            className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-xl transition-colors duration-150"
          >
            Se connecter
          </Link>

          {/* Essai gratuit Button */}
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/25 active:scale-[0.98] transition-all duration-200 gap-1.5"
          >
            <span>Essai gratuit 14 jours</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger & Theme Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
            aria-label="Changer le thème"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
            aria-label="Ouvrir le menu mobile"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-over / Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-[#0D121F]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={handleLinkClick}
                className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            <Link
              href="/auth/login"
              onClick={handleLinkClick}
              className="w-full text-center py-3 text-sm font-bold text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/auth/register"
              onClick={handleLinkClick}
              className="w-full text-center py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Essai gratuit 14 jours</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
