"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AppPrivacyPolicy from "@/components/policies/AppPrivacyPolicy";

export default function AppPrivacyPolicyPage() {
  const [scrolled] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  useEffect(() => {
    document.title = "TPF Aid App Privacy Policy | Google Play Compliance - True Path Foundation";

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
        <AppPrivacyPolicy darkMode={darkMode} />
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}
