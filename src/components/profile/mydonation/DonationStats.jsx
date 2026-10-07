"use client"

import { motion } from "framer-motion"
import {
  Wallet,
  Target,
  Users,
  Trophy,
  Star,
  Calculator,
  ArrowRight
} from "lucide-react"
import { useState, useEffect } from "react"

export default function DonationStats({
  darkMode,
  donationStats,
  currentUser,
  leaderboardData,
  monthlyData = [],
  yearlyData = [],
  leaderboardLoading = false,
  leaderboardError = false,
  getRankIcon,
  peopleHelped = 0,
  rankByTab = {},
  combinedTotalAmount
}) {

  const [activeTab, setActiveTab] = useState("weekly")
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const getActiveData = () => {
    if (activeTab === "monthly") return monthlyData
    if (activeTab === "yearly") return yearlyData
    return leaderboardData // weekly default
  }

  const activeLeaderboard = getActiveData()
  const activeUserStats = rankByTab[activeTab] || { rank: "—", amount: 0 };
  // ✅ Dynamic Zakat calculation values from user profile
  const calculatedZakat = donationStats?.totalZakatCalculated || 0;
  const totalZakatDonated = donationStats?.totalZakat || 0;
  const zakatRemaining = Math.max(0, calculatedZakat - totalZakatDonated);

  const hasAnyDonations =
    (donationStats?.totalAmount || 0) > 0 ||
    (donationStats?.totalZakat || 0) > 0 ||
    (donationStats?.campaignsSupported || 0) > 0;

  const safePeopleHelped = peopleHelped && peopleHelped > 0 ? peopleHelped : 0;

  const showLeaderboard =
    !leaderboardLoading &&
    !leaderboardError &&
    activeLeaderboard.length > 0;


  if (!mounted) {
    return (
      <div className="animate-pulse text-center py-10 text-gray-400 dark:text-gray-500">
        Loading donation statistics...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

      {/* Left Column - Stats Cards */}
      <div className="lg:col-span-2 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 flex-1">

          {/* Total Amount Donated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={`p-6 rounded-2xl border relative overflow-hidden ${darkMode
              ? "bg-zinc-800/50 border-zinc-700"
              : "bg-white border-gray-200 shadow-lg"
              }`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-12 -mt-12" />
            <div className="relative">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${darkMode ? "bg-emerald-500/20" : "bg-emerald-100"
                }`}>
                <Wallet className="w-6 h-6 text-emerald-600" />
              </div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? "text-zinc-400" : "text-gray-600"
                }`}>
                Total Donated
              </p>
              {hasAnyDonations && donationStats.totalAmount > 0 ? (
                <p className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"
                  }`}>
                  ₹{(combinedTotalAmount || donationStats.totalAmount).toLocaleString('en-IN')}
                </p>
              ) : (
                <p className={`text-sm md:text-base font-semibold ${darkMode ? "text-zinc-300" : "text-gray-700"
                  }`}>
                  Start with your first donation to see your impact here ✨
                </p>
              )}
            </div>
          </motion.div>

          {/* Total Zakat Calculated & Donated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={`p-6 rounded-2xl border relative overflow-hidden ${darkMode
              ? "bg-zinc-800/50 border-zinc-700"
              : "bg-white border-gray-200 shadow-lg"
              }`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full -mr-12 -mt-12" />
            <div className="relative">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${darkMode ? "bg-rose-500/20" : "bg-rose-100"
                }`}>
                <Wallet className="w-6 h-6 text-rose-600" />
              </div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? "text-zinc-400" : "text-gray-600"
                }`}>
                Total Zakat Calculated
              </p>

              {calculatedZakat > 0 ? (
                <p className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"
                  }`}>
                  ₹{calculatedZakat.toLocaleString('en-IN')}
                </p>
              ) : totalZakatDonated > 0 ? (
                <p className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"
                  }`}>
                  ₹{totalZakatDonated.toLocaleString('en-IN')}
                </p>
              ) : (
                <p className={`text-sm md:text-base font-semibold ${darkMode ? "text-zinc-300" : "text-gray-700"
                  }`}>
                  Calculate and track your Zakat with ease
                </p>
              )}

              {calculatedZakat > 0 ? (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-700/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>Calculated:</span>
                    <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      ₹{calculatedZakat.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>Donated:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹{totalZakatDonated.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-dashed border-gray-200 dark:border-zinc-700/40">
                    <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>Left to Donate:</span>
                    {zakatRemaining > 0 ? (
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        ₹{zakatRemaining.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        ✓ Fully Donated
                      </span>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <a
                      href="/zakat-calculator"
                      className={`text-[11px] font-medium transition-colors inline-flex items-center gap-1 ${
                        darkMode ? "text-rose-400 hover:text-rose-300" : "text-rose-600 hover:text-rose-700"
                      }`}
                    >
                      <Calculator className="w-3 h-3" />
                      Recalculate
                    </a>
                    {zakatRemaining > 0 && (
                      <a
                        href="/all-campaigns"
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                          darkMode ? "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30" : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                        }`}
                      >
                        Donate Zakat →
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <a
                  href="/zakat-calculator"
                  className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${darkMode
                    ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/50"
                    : "bg-rose-500 text-white hover:bg-rose-600"
                    }`}
                >
                  <Calculator className="w-4 h-4" />
                  Calculate Zakat Now
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Campaigns Supported */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className={`p-6 rounded-2xl border relative overflow-hidden ${darkMode
              ? "bg-zinc-800/50 border-zinc-700"
              : "bg-white border-gray-200 shadow-lg"
              }`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -mr-12 -mt-12" />
            <div className="relative">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${darkMode ? "bg-indigo-500/20" : "bg-indigo-100"
                }`}>
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? "text-zinc-400" : "text-gray-600"
                }`}>
                Campaigns Supported
              </p>
              {donationStats.campaignsSupported > 0 ? (
                <>
                  <p className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"
                    }`}>
                    {donationStats.campaignsSupported}
                  </p>
                  <p className={`text-xs mt-2 ${darkMode ? "text-zinc-500" : "text-gray-500"
                    }`}>
                    Active causes you've supported
                  </p>
                </>
              ) : (
                <p className={`text-sm md:text-base font-semibold mt-2 ${darkMode ? "text-zinc-300" : "text-gray-700"
                  }`}>
                  Support your first campaign to see it here 🌱
                </p>
              )}
            </div>
          </motion.div>

          {/* People Helped */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className={`p-6 rounded-2xl border relative overflow-hidden ${darkMode
              ? "bg-zinc-800/50 border-zinc-700"
              : "bg-white border-gray-200 shadow-lg"
              }`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -mr-12 -mt-12" />
            <div className="relative">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${darkMode ? "bg-amber-500/20" : "bg-amber-100"
                }`}>
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? "text-zinc-400" : "text-gray-600"
                }`}>
                People Helped
              </p>
              {safePeopleHelped > 0 ? (
                <>
                  <p className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"
                    }`}>
                    {safePeopleHelped}+
                  </p>
                  <p className={`text-xs mt-2 ${darkMode ? "text-zinc-500" : "text-gray-500"
                    }`}>
                    Lives impacted through your generosity
                  </p>
                </>
              ) : (
                <>
                  <p className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-white/70" : "text-gray-500"
                    }`}>
                    —
                  </p>
                  <p className={`text-xs mt-2 ${darkMode ? "text-zinc-500" : "text-gray-500"
                    }`}>
                    Your first donation will be someone's first hope 💚
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT COLUMN — LEADERBOARD */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`rounded-2xl border overflow-hidden ${darkMode
            ? "bg-zinc-800/50 border-zinc-700"
            : "bg-white border-gray-200 shadow-lg"
            }`}
        >
          {/* Header */}
          <div className={`p-6 border-b ${darkMode ? "border-zinc-700" : "border-gray-200"
            }`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-amber-500/20" : "bg-amber-100"
                }`}>
                <Trophy className="w-6 h-6 text-amber-600" />
              </div>

              <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"
                }`}>
                Leaders
              </h2>
            </div>

            {/* TABS: weekly / monthly / yearly */}
            <div className="flex gap-2 mt-3">
              {["weekly", "monthly", "yearly"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${activeTab === tab
                    ? "bg-amber-500 text-white"
                    : darkMode
                      ? "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Current User Rank */}
          <div className={`p-4 border-b ${darkMode ? "bg-zinc-900/50 border-zinc-700" : "bg-emerald-50 border-emerald-200"
            }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${darkMode ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-500 text-white"
                }`}>
                #{activeUserStats.rank}
              </div>

              <div className="flex-1 min-w-0">
                {/* HYDRATION SAFE — NAME IN LEADERBOARD */}
                {!mounted && (
                  <p className={`font-semibold text-sm truncate ${darkMode ? "text-white/30" : "text-gray-700/40"
                    }`}>
                    You (—)
                  </p>
                )}

                {mounted && (
                  <p className={`font-semibold text-sm truncate ${darkMode ? "text-white" : "text-gray-900"
                    }`}>
                    You ({currentUser.name})
                  </p>
                )}

              </div>

              <div className="text-right">
                <p className={`font-bold text-sm ${darkMode ? "text-emerald-400" : "text-emerald-600"
                  }`}>
                  ₹{(activeUserStats.amount || 0).toLocaleString("en-IN")}

                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Leaderboard */}
          <div className="max-h-[320px] overflow-y-auto scrollbar-leaderboard" data-lenis-prevent>

            {leaderboardLoading && (
              <div className="p-6 text-center text-sm text-gray-500">
                Loading leaderboard…
              </div>
            )}

            {leaderboardError && (
              <div className="p-6 text-center text-sm text-gray-500">
                Leaderboard unavailable right now
              </div>
            )}

            {!leaderboardLoading &&
              !leaderboardError &&
              activeLeaderboard.length === 0 && (
                <div className="p-6 text-center text-sm text-gray-500">
                  Be the first donor this period 🌱
                </div>
              )}

            {showLeaderboard &&
              activeLeaderboard.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.1) }}
                  className={`p-3 border-b transition-all ${user.isCurrentUser
                    ? darkMode
                      ? "bg-emerald-900/20 border-emerald-700"
                      : "bg-emerald-50 border-emerald-200"
                    : user.isPermanent
                      ? darkMode
                        ? "bg-gradient-to-r from-amber-900/30 via-amber-900/20 to-amber-900/30 border-amber-700/50 hover:from-amber-900/40 hover:via-amber-900/30 hover:to-amber-900/40"
                        : "bg-gradient-to-r from-amber-50 via-amber-100/50 to-amber-50 border-amber-300 hover:from-amber-100 hover:via-amber-100 hover:to-amber-100"
                      : darkMode
                        ? "border-zinc-800 hover:bg-zinc-700/30"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${user.rank <= 3
                        ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg"
                        : user.isPermanent
                          ? darkMode
                            ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md"
                            : "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-md"
                          : darkMode
                            ? "bg-zinc-700 text-zinc-400"
                            : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {getRankIcon(user.rank) || `#${user.rank}`}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-semibold text-sm truncate ${user.isPermanent
                            ? darkMode
                              ? "text-amber-300"
                              : "text-amber-900"
                            : darkMode
                              ? "text-white"
                              : "text-gray-900"
                            }`}
                        >
                          {user.name}
                          {user.isCurrentUser && " (You)"}
                        </p>

                        {user.isPermanent && (
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/30 border border-amber-500/50">
                            <Star className="w-3 h-3 text-amber-600 fill-amber-500 flex-shrink-0" />
                          </div>
                        )}
                      </div>

                      <p
                        className={`text-xs font-medium ${user.isPermanent
                          ? darkMode
                            ? "text-amber-400/80"
                            : "text-amber-700"
                          : darkMode
                            ? "text-zinc-400"
                            : "text-gray-600"
                          }`}
                      >
                        ₹{user.amount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>


          {/* Scroll indicator */}
          {activeLeaderboard.length > 5 && (
            <div className={`p-3 text-center border-t ${darkMode ? "border-zinc-700 bg-zinc-800/30" : "border-gray-200 bg-gray-50"
              }`}>
              <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-gray-500"
                }`}>
                Scroll to see more • {activeLeaderboard.length} total
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}