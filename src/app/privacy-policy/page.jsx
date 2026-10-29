"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AppPrivacyPolicy from "@/components/policies/AppPrivacyPolicy";
import Link from "next/link";
import { Shield, Smartphone } from "lucide-react";

export default function PrivacyPolicyRedirectPage() {
  const [scrolled] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  useEffect(() => {
    document.title = "TPF Aid Privacy Policy | True Path Foundation";

    const handleStorageChange = () => {
      const savedMode = localStorage.getItem("darkMode");
      setDarkMode(savedMode === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("darkModeChanged", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("darkModeChanged", handleStorageChange);
    };
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-zinc-900" : "bg-neutral-50/50"}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} scrolled={scrolled} />

      <main className="pt-24 sm:pt-28 md:pt-32 pb-16">
        {/* Toggle between Web Policy & App Policy banner */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              darkMode ? "bg-zinc-800/80 border-zinc-700 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-teal-500 shrink-0" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold">Viewing: TPF Aid Mobile App Privacy Policy</span> (Google Play & Android)
              </div>
            </div>
            <Link
              href="/policies"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              <Shield className="w-3.5 h-3.5" />
              View Web & Organization Policies &rarr;
            </Link>
          </div>
        </div>

        <AppPrivacyPolicy darkMode={darkMode} />
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}
