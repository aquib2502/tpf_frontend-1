"use client"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import {
  Heart,
  Wallet,
  TrendingUp,
  Trophy,
  Users,
  Target,
  Download,
  FileText,
  Calendar
} from "lucide-react"
import DonationStats from "./DonationStats"
import DonationHistory from "./DonationHistory"
import RealWorldImpact from "./RealWorldImpact"
import { useGetLeaderboardStatsQuery } from "@/utils/slices/leaderboardApiSlice"
import { useGetRecentTransactionsQuery, useGetPeopleHelpedStatsQuery } from "@/utils/slices/authApiSlice"
import { useFetchMyDonationsQuery } from "@/utils/slices/donationApiSlice"

export default function DonationsPage({ darkModeFromParent }) {
  const userInfo = useSelector((state) => state.auth.userInfo || [])
  const [darkMode, setDarkMode] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filter80G, setFilter80G] = useState(false)
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [mounted, setMounted] = useState(false);
  const { data: peopleHelpedRes } = useGetPeopleHelpedStatsQuery();
  useEffect(() => setMounted(true), []);


  // Sync with parent dark mode
  useEffect(() => {
    if (darkModeFromParent !== undefined) {
      setDarkMode(darkModeFromParent)
    }
  }, [darkModeFromParent])


  const peopleHelped = peopleHelpedRes?.data?.totalPeopleHelped || 0;
  const categoryBreakdown = peopleHelpedRes?.data?.categoryBreakdown || {};

  const {
    data: leaderboardStats,
    isLoading: leaderboardLoading,
    isError: leaderboardError,
  } = useGetLeaderboardStatsQuery()

  const { data: myDonationsData } = useFetchMyDonationsQuery({
  page: 1,
  limit: 1,  // just need the stats, not the list
  dateFilter: "all"
});

// AFTER (fixed)
const currentUserStats = leaderboardStats?.currentUser || {};

const currentUser = {
  name: userInfo.fullName,
  rank: currentUserStats?.weekly?.rank ?? "—",
  weeklyDonation: currentUserStats?.weekly?.amount ?? 0,
  rankByTab: {
    weekly:  { rank: currentUserStats?.weekly?.rank  ?? "—", amount: currentUserStats?.weekly?.amount  ?? 0 },
    monthly: { rank: currentUserStats?.monthly?.rank ?? "—", amount: currentUserStats?.monthly?.amount ?? 0 },
    yearly:  { rank: currentUserStats?.yearly?.rank  ?? "—", amount: currentUserStats?.yearly?.amount  ?? 0 },
  },
};

  const donationStats = {
    totalAmount: userInfo?.donationStats?.totalAmount || 0,
    totalZakat: userInfo?.donationStats?.totalZakat || 0,
    campaignsSupported: userInfo?.donationStats?.campaignsSupported || 0,
    totalZakatCalculated: userInfo?.totalZakatCalculated ?? userInfo?.donationStats?.totalZakatCalculated ?? 0,
  };

  // Transaction history with 80G eligibility

  const {
    data: recentTxnResponse,
    isLoading: isTransactionsLoading,
    isError,
  } = useGetRecentTransactionsQuery();

  const transactions = recentTxnResponse?.data || [];



  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return null
  }

  const handleDownloadInvoice = () => {
    console.log(`Downloading invoice for date range: ${dateRange.start} to ${dateRange.end}`)
    // Implement invoice download logic
  }




  return (
    <div className={`relative ${darkMode ? "bg-zinc-900" : "bg-transparent"}`}>

      {/* Background Pattern */}
      <div className="absolute inset-y-0 left-0 right-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute inset-0 ${darkMode
            ? "bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)]"
            : "bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)]"
            }`}
          style={{ backgroundSize: '48px 48px' }}
        />
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-20 pb-24">

        {/* Greeting Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`mb-6 rounded-2xl overflow-hidden relative ${darkMode
            ? "bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-700/30"
            : "bg-gradient-to-br from-emerald-600 to-teal-600 shadow-xl"
            }`}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-20 -mb-20 blur-2xl" />

          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {mounted && (
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white flex items-center gap-2">
                      Salam, {currentUser.name}! <span className="text-4xl">🤲</span>
                    </h1>
                  )}

                  <p className="text-sm md:text-base mb-3 text-white/90">
                    Your generosity is making a real difference in people's lives
                  </p>
                </motion.div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${darkMode ? "bg-white/10" : "bg-white/20"
                  } backdrop-blur-sm`}>
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span className="font-semibold text-sm text-white">
                    Rank #{currentUser.rank}
                  </span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${darkMode ? "bg-white/10" : "bg-white/20"
                  } backdrop-blur-sm`}>
                  <Heart className="w-4 h-4 text-rose-300" />
                  <span className="font-semibold text-sm text-white">
                    {donationStats.totalDonations} Contributions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats and Leaderboard */}
        <DonationStats
          darkMode={darkMode}
          donationStats={donationStats}
          currentUser={currentUser}
          rankByTab={currentUser.rankByTab} 
          leaderboardData={leaderboardStats?.weekly || []}
          monthlyData={leaderboardStats?.monthly || []}
          yearlyData={leaderboardStats?.yearly || []}
          leaderboardLoading={leaderboardLoading}
          leaderboardError={leaderboardError}
          getRankIcon={getRankIcon}
          combinedTotalAmount={myDonationsData?.stats?.totalFilteredAmount || donationStats.totalAmount}
          peopleHelped={peopleHelped}
        />



        {/* Donation History */}
        <DonationHistory
          darkMode={darkMode}
          transactions={transactions}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter80G={filter80G}
          setFilter80G={setFilter80G}
          dateRange={dateRange}
          setDateRange={setDateRange}
          handleDownloadInvoice={handleDownloadInvoice}
        />

        {/* Real World Impact */}
        <RealWorldImpact
          darkMode={darkMode}
          categoryBreakdown={categoryBreakdown}
        />

      </div>

    </div>
  )
}