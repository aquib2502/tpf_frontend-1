"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import PermanentDonorPage from "@/components/permanentdonor/PermanentDonor";

export default function Page() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  useEffect(() => {
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
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-zinc-950 text-zinc-100" : "bg-[#fbfbf9] text-slate-900"}`}>
      {/* Existing Navbar preserved exactly as required */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} scrolled={true} />

      {/* Main Content Area between Navbar and Footer */}
      <div className="flex-1 w-full pt-16">
        <main className="w-full overflow-x-hidden">
          <PermanentDonorPage darkModeFromParent={darkMode} />
        </main>
      </div>

      {/* Existing Footer preserved exactly as required */}
      <Footer darkMode={darkMode} />
    </div>
  );
}