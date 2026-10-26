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
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LiveToastNotification } from "@/components/landing/LiveToastNotification";

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Synchronise state with root class and localStorage
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const handleToggleDarkMode = () => {
    const nextState = !isDarkMode;
    setIsDarkMode(nextState);

    if (nextState) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("devada_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("devada_theme", "light");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col w-full max-w-full overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* 1. Header Navigation with Login button & Mobile menu */}
      <LandingHeader
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* 2. Main Content */}
      <main className="flex-1 w-full max-w-full overflow-hidden">
        {/* Hero Section with interactive live mockup */}
        <HeroSection />

        {/* Interactive ROI Calculator */}
        <ROICalculatorSection />

        {/* Comparison: Old Excel/Word vs Devada Invoice PRO */}
        <ComparisonSection />

        {/* Key Features Grid */}
        <FeaturesSection />

        {/* 3-Step Process: How It Works */}
        <HowItWorksSection />

        {/* Testimonials from Dakar, Abidjan & Douala */}
        <TestimonialsSection />

        {/* Pricing Table in FCFA */}
        <PricingSection />

        {/* Final High-Conversion CTA Banner */}
        <FinalCtaBanner />
      </main>

      {/* 3. Footer */}
      <LandingFooter />

      {/* 4. Live Activity Toast Widget */}
      <LiveToastNotification />
    </div>
  );
}
