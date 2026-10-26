"use client";

import React, { useEffect, useState } from "react";
import "./landing.css";

import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import RoiCalculator from "@/components/landing/RoiCalculator";
import ComparisonSection from "@/components/landing/ComparisonSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import FinalCtaBanner from "@/components/landing/FinalCtaBanner";
import LandingFooter from "@/components/landing/LandingFooter";
import LiveToastNotification from "@/components/landing/LiveToastNotification";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col w-full max-w-full overflow-x-clip transition-colors">
      {/* 1. Header with Desktop Nav & Mobile Drawer */}
      <LandingHeader />

      {/* 2. Main Landmark */}
      <main className="flex-1 w-full max-w-full overflow-x-clip">
        {/* Hero Section with Interactive Mockup */}
        <HeroSection />

        {/* ROI Calculator */}
        <RoiCalculator />

        {/* Avant vs Avec Devada Comparison */}
        <ComparisonSection />

        {/* Key Features */}
        <FeaturesSection />

        {/* How It Works in 3 Steps */}
        <HowItWorksSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Transparent Pricing Plans in FCFA */}
        <PricingSection />

        {/* Final Cobalt Blue Action Banner */}
        <FinalCtaBanner />
      </main>

      {/* 3. Footer */}
      <LandingFooter />

      {/* 4. Live Simulated Transaction Toasts */}
      {mounted && <LiveToastNotification />}
    </div>
  );
}
