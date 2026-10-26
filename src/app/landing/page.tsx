"use client";

import React, { useState, useEffect } from "react";
import "@/styles/landing.css";

import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { ROICalculatorSection } from "@/components/landing/ROICalculatorSection";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FinalCtaBanner } from "@/components/landing/FinalCtaBanner";
import { LiveToastNotification } from "@/components/landing/LiveToastNotification";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize theme from localStorage & document class
  useEffect(() => {
    const saved = localStorage.getItem("devada_theme");
    const isDark =
      saved === "dark" ||
      (!saved &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("devada_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("devada_theme", "light");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col w-full max-w-full overflow-x-hidden antialiased selection:bg-blue-500/20 selection:text-blue-600">
      {/* 1. Sticky Navigation Header with Auth buttons & mobile drawer */}
      <LandingHeader isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />

      {/* 2. Main Page Content - mobile-first, centered, zero horizontal overflow */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* Hero Section with Live Mockup and Floating Badges */}
        <HeroSection />

        {/* Interactive ROI Calculator Gimmick */}
        <ROICalculatorSection />

        {/* Avant vs Après Visual Comparison */}
        <ComparisonSection />

        {/* Key Features Grid */}
        <FeaturesSection />

        {/* 3-Step Process */}
        <HowItWorksSection />

        {/* Authentic Customer Testimonials */}
        <TestimonialsSection />

        {/* Transparent Pricing Plans in FCFA */}
        <PricingSection />

        {/* Final High-Converting Call-to-Action Banner */}
        <FinalCtaBanner />
      </main>

      {/* 3. Comprehensive Footer with African Presence */}
      <LandingFooter />

      {/* 4. Real-time Live Toast Ticker */}
      <LiveToastNotification />
    </div>
  );
}
