"use client";

import { useState } from "react";
import { Shield, FileText, CreditCard, Scale, ArrowLeft, ChevronRight, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfUse from "./TermsOfUse";
import Pricing from "./Pricing";
import Governance from "./Governance";
import AppPrivacyPolicy from "./AppPrivacyPolicy";

export default function Policies({ darkMode }) {
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const router = useRouter();

  const policies = [
    {
      id: "app-privacy",
      title: "TPF Aid App Privacy Policy",
      icon: Smartphone,
      badge: "Google Play Store",
      description: "Official policy for Google Play Store & mobile app: location, permissions, OTP login, and data deletion.",
      gradient: "from-teal-600 to-emerald-500",
      bgGradient: darkMode
        ? "from-teal-900/25 to-emerald-800/25"
        : "from-emerald-50 to-teal-100/60",
      lastUpdated: "27th October 2026"
    },
    {
      id: "privacy",
      title: "Privacy Policy (Web & Org)",
      icon: Shield,
      description: "Your trust is sacred. Learn how we protect and handle your personal information.",
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: darkMode
        ? "from-emerald-900/20 to-emerald-800/20"
        : "from-emerald-50 to-emerald-100/50",
      lastUpdated: "1st February 2026"
    },
    {
      id: "terms",
      title: "Terms of Use",
      icon: FileText,
      description: "Clear guidelines for using TPF Aid's platform with ethical engagement.",
      gradient: "from-teal-500 to-teal-600",
      bgGradient: darkMode
        ? "from-teal-900/20 to-teal-800/20"
        : "from-teal-50 to-teal-100/50",
      lastUpdated: "1st February 2026"
    },
    {
      id: "pricing",
      title: "Pricing & Refunds",
      icon: CreditCard,
      description: "Complete transparency on donations, platform fees, and refund policy.",
      gradient: "from-emerald-600 to-teal-500",
      bgGradient: darkMode
        ? "from-emerald-900/20 to-teal-900/20"
        : "from-emerald-50 to-teal-100/50",
      lastUpdated: "1st February 2026"
    },
    {
      id: "governance",
      title: "Anti-Discriminatory & Governance",
      icon: Scale,
      description: "Our commitment to equality and nation-first humanitarian service.",
      gradient: "from-teal-600 to-emerald-500",
      bgGradient: darkMode
        ? "from-teal-900/20 to-emerald-900/20"
        : "from-teal-50 to-emerald-100/50",
      lastUpdated: "1st February 2026"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

return (
  <div className={`min-h-screen ${darkMode ? 'bg-zinc-900' : 'bg-white'}`}>

    {selectedPolicy ? (
      <div className="pt-24 sm:pt-28 md:pt-32">

        {selectedPolicy === "app-privacy" && (
          <AppPrivacyPolicy
            darkMode={darkMode}
            onBack={() => {
              setSelectedPolicy(null);
              window.scrollTo(0, 0);
            }}
          />
        )}

        {selectedPolicy === "privacy" && (
          <PrivacyPolicy
            darkMode={darkMode}
            onBack={() => {
              setSelectedPolicy(null);
              window.scrollTo(0, 0);
            }}
          />
        )}

        {selectedPolicy === "terms" && (
          <TermsOfUse
            darkMode={darkMode}
            onBack={() => {
              setSelectedPolicy(null);
              window.scrollTo(0, 0);
            }}
          />
        )}

        {selectedPolicy === "pricing" && (
          <Pricing
            darkMode={darkMode}
            onBack={() => {
              setSelectedPolicy(null);
              window.scrollTo(0, 0);
            }}
          />
        )}

        {selectedPolicy === "governance" && (
          <Governance
            darkMode={darkMode}
            onBack={() => {
              setSelectedPolicy(null);
              window.scrollTo(0, 0);
            }}
          />
        )}

      </div>
    ) : (
      <>
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => router.back()}
              className={`flex items-center gap-2 ${
                darkMode
                  ? 'bg-zinc-800/95 text-zinc-200 border-zinc-700 hover:bg-zinc-700/95'
                  : 'bg-white/95 text-zinc-700 border-zinc-200 hover:bg-zinc-50/95'
              } backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all border`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium text-sm sm:text-base">Back</span>
            </button>
          </motion.div>
        </div>

        {/* Hero Section */}
        <section
          className={`pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-20 ${
            darkMode ? 'bg-zinc-900' : 'bg-white'
          } relative overflow-hidden`}
        >
          <div
            className={`absolute inset-0 ${
              darkMode ? 'opacity-3' : 'opacity-5'
            } pointer-events-none`}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, #14b8a6 1px, transparent 1px),
                                  radial-gradient(circle at 75% 75%, #14b8a6 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto mb-8 sm:mb-10 md:mb-12"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className={`${darkMode ? 'text-zinc-100' : 'text-zinc-900'} block mb-1 sm:mb-2`}>
                  Transparency & Trust in
                </span>
                <span className="bg-gradient-to-r from-teal-500 via-emerald-600 to-emerald-400 text-transparent bg-clip-text">
                  Every Policy We Create
                </span>
              </h1>
              <p
                className={`text-base sm:text-lg md:text-xl ${
                  darkMode ? 'text-zinc-400' : 'text-zinc-600'
                } px-4 sm:px-0 max-w-3xl mx-auto`}
              >
                Comprehensive policies that govern our operations and protect your interests
              </p>
            </motion.div>

            {/* Policy Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto"
            >
              {policies.map((policy) => {
                const Icon = policy.icon;

                return (
                  <motion.div
                    key={policy.id}
                    variants={itemVariants}
                    onClick={() => {
                      setSelectedPolicy(policy.id);
                      window.scrollTo(0, 0);
                    }}
                    className={`group cursor-pointer ${
                      darkMode
                        ? 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70'
                        : 'bg-white border-zinc-200'
                    } rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border`}
                  >
                    <div
                      className={`bg-gradient-to-br ${policy.bgGradient} p-5 sm:p-6 ${
                        darkMode ? 'border-zinc-700/50' : 'border-zinc-200'
                      } border-b`}
                    >
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div
                          className={`bg-gradient-to-r ${policy.gradient} w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        {policy.badge && (
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            {policy.badge}
                          </span>
                        )}
                      </div>

                      <h2
                        className={`text-lg sm:text-xl font-bold ${
                          darkMode ? 'text-zinc-100' : 'text-zinc-800'
                        } mb-2`}
                      >
                        {policy.title}
                      </h2>

                      <p
                        className={`text-sm ${
                          darkMode ? 'text-zinc-400' : 'text-zinc-600'
                        } leading-relaxed`}
                      >
                        {policy.description}
                      </p>

                      <p className="text-xs text-zinc-500 mt-3 font-medium">
                        Last Updated on: {policy.lastUpdated}
                      </p>
                    </div>

                    <div
                      className={`px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between ${
                        darkMode ? 'bg-zinc-900/30' : 'bg-zinc-50/50'
                      }`}
                    >
                      <span
                        className={`text-xs sm:text-sm font-semibold bg-gradient-to-r ${policy.gradient} bg-clip-text text-transparent`}
                      >
                        Read Policy
                      </span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </>
    )}

  </div>
);
}