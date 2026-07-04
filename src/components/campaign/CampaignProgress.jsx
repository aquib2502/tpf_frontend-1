"use client"
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Calendar,
  Users,
  IndianRupee,
  Heart,
  ArrowRight,
  TrendingUp as TrendingUpIcon,
  X,
  CheckCircle,
  Target
} from "lucide-react";
import { useState } from "react";
import Image from 'next/image';
import DonateModal from "./DonationCard";
import ShareModal from "../ui/ShareModal";
import TrustSafety from "./TrustSafety";
import { useToggleWishlistMutation } from '@/utils/slices/authApiSlice';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FiShare2 } from "react-icons/fi";
import DonorListModal from "./DonorListModal";
import { useFetchCampaignDonorsQuery } from "@/utils/slices/donationApiSlice";

export default function CampaignProgress({ darkMode, campaign, onDonateClick, isDonorModalOpen, setIsDonorModalOpen, isCompleted }) {
  const [openShare, setOpenShare] = useState(false);

  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);
  const wishlist = userInfo?.wishlist || [];

  const [toggleWishlist] = useToggleWishlistMutation();

  if (!campaign) return null;

  const {
    raisedAmount = 0,
    targetAmount = 0,
    totalDonors = 0,
    deadline,
    _id: campaignId,
    slug,
    title,
    source,
    fundsDisbursed = 0,
    allowedDonationTypes = [],
  } = campaign;

  const isFoundation = source === "FOUNDATION";

  const saved = wishlist.includes(campaignId);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/campaign/${slug}`
      : "";

  const percentage =
    !isFoundation && targetAmount > 0
      ? Math.min(Math.round((raisedAmount / targetAmount) * 100), 100)
      : 100;

  const daysLeft = deadline
    ? Math.max(
      0,
      Math.ceil(
        (new Date(deadline).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
      )
    )
    : 0;
// Add this calculation near the other derived values (after avgDonation)
const remaining = Math.max(0, targetAmount - raisedAmount);

  const avgDonation =
    totalDonors > 0 ? Math.round(raisedAmount / totalDonors) : 0;

  const formatNumber = (num) => num.toLocaleString('en-IN');

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo) {
      router.push("/login");
      return;
    }

    try {
      await toggleWishlist(campaignId).unwrap();
    } catch (err) {
      console.error("Wishlist toggle failed", err);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${darkMode ? "bg-zinc-800" : "bg-white"
          } rounded-xl sm:rounded-2xl shadow-lg p-3.5 sm:p-6 lg:p-8 mb-4 sm:mb-6`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* LEFT: PROGRESS */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                </div>
                <h3
                  className={`text-base sm:text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  Campaign Progress
                </h3>
              </div>

              {/* Share and Wishlist Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleWishlist}
                  className={`transition-all duration-200 hover:scale-110 ${saved
                    ? "text-red-500"
                    : darkMode
                      ? "text-zinc-400 hover:text-red-400"
                      : "text-zinc-600 hover:text-red-600"
                    }`}
                  title={saved ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill={saved ? "currentColor" : "none"}
                  />
                </button>

                <div className="relative inline-block">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenShare(true);
                    }}
                    className={`peer flex items-center gap-1 transition-all duration-200 hover:scale-110 ${darkMode
                      ? "text-zinc-400 hover:text-emerald-400"
                      : "text-zinc-600 hover:text-emerald-600"
                      }`}
                    title="Share this Campaign"
                  >
                    <FiShare2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="mb-6">
              {isFoundation ? (
                <div className="flex flex-wrap items-end gap-1.5 sm:gap-3 mb-4 sm:mb-6">
                  <div className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent leading-none">
                    ₹{formatNumber(fundsDisbursed)}
                  </div>
                  <div className={`text-xs sm:text-base md:text-lg pb-0.5 sm:pb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Total Funds Disbursed
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-end gap-1.5 sm:gap-3 mb-4 sm:mb-6">
                  <div className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent leading-none">
                    {percentage}%
                  </div>
                  <div className={`text-xs sm:text-base md:text-lg pb-0.5 sm:pb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    raised of goal ₹{formatNumber(targetAmount)}
                  </div>
                </div>
              )}

              {/* Progress bar */}
              <div className="relative">
                <div
                  className={`relative w-full h-2.5 sm:h-3 rounded-full overflow-hidden ${darkMode ? "bg-zinc-700" : "bg-gray-200"
                    }`}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                </div>
                {percentage > 0 && (
                  <div
                    className="absolute top-0 h-2.5 sm:h-3 w-1 bg-white rounded-full shadow-lg"
                    style={{ left: `${Math.min(percentage, 98)}%` }}
                  />
                )}
              </div>

              {/* Motivational message */}
              {isCompleted ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`mt-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-l-4 border-emerald-500 ${darkMode
                    ? "bg-gradient-to-r from-emerald-500/20 to-transparent text-gray-100"
                    : "bg-gradient-to-r from-emerald-50 to-transparent text-gray-800"
                    }`}
                >
                  <p className="text-xs sm:text-sm font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Target achieved! Thank you for your support.
                  </p>
                </motion.div>
              ) : percentage < 100 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`mt-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-l-4 border-emerald-500 ${darkMode
                    ? "bg-gradient-to-r from-emerald-500/10 to-transparent text-gray-200"
                    : "bg-gradient-to-r from-emerald-50 to-transparent text-gray-800"
                    }`}
                >
                  <p className="text-xs sm:text-sm font-medium">
                    Every contribution brings hope to those in need
                  </p>
                </motion.div>
              )}
            </div>

            {/* DONOR AVATAR STACK */}
            <DonorAvatarStack
              campaignId={campaignId}
              darkMode={darkMode}
              totalDonors={totalDonors}
              setIsDonorModalOpen={setIsDonorModalOpen}
            />

            {/* DONATE NOW BUTTON - Updated Design */}
            {isCompleted ? (
              <div className={`
                w-full sm:w-auto mb-6
                px-5 sm:px-8 py-3 sm:py-3.5
                bg-zinc-100 border border-zinc-200
                text-zinc-500 font-bold text-sm sm:text-base
                rounded-xl flex items-center justify-center gap-2
              `}>
               <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0">
              <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 10h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Not accepting payments
              </div>
            ) : (
              <motion.button
                onClick={onDonateClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full sm:w-auto mb-6
                  group relative overflow-hidden
                  px-5 sm:px-8 py-3 sm:py-3.5
                  bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500
                  text-white font-bold text-sm sm:text-base
                  rounded-xl
                  shadow-lg shadow-emerald-500/30
                  hover:shadow-xl hover:shadow-emerald-500/40
                  transition-all duration-300
                  flex items-center justify-center gap-2
                `}
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* Button content */}
                <div className="relative flex items-center gap-2.5">
                  <Heart className="w-5 h-5 sm:w-5 sm:h-5" fill="currentColor" />
                  <span>Donate Now</span>
                  <motion.div
                    className="flex items-center"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                </div>
              </motion.button>
            )}

            {/* Stats */}
           {/* Stats */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-3">
  <StatCard
    darkMode={darkMode}
    icon={<Target className="w-4 h-4 sm:w-5 sm:h-5" />}
    value={`₹${formatNumber(targetAmount)}`}
    label="Goal"
    color="blue"
  />
  <StatCard
    darkMode={darkMode}
    icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
    value={(!isFoundation && targetAmount > 0 && raisedAmount >= targetAmount) ? "Goal Achieved" : `₹${formatNumber(raisedAmount)}`}
    label="Raised"
    color="emerald"
  />
  <StatCard
    darkMode={darkMode}
    icon={<IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />}
    value={`₹${formatNumber(remaining)}`}
    label="Still Needed"
    color="purple"
  />
  <StatCard
    darkMode={darkMode}
    icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5" />}
    value={isFoundation ? "Permanent" : formatNumber(daysLeft)}
    label={isFoundation ? "Fund Status" : "Days Left"}
    color="orange"
  />
</div>
          </div>

          {/* RIGHT: TRUST & SAFETY - Only visible on desktop (lg and above) */}
          <div className="hidden lg:block lg:col-span-1">
            <TrustSafety darkMode={darkMode} />
          </div>
        </div>
      </motion.div>


      {openShare && (
        <ShareModal
          url={shareUrl}
          title={title}
          onClose={() => setOpenShare(false)}
        />
      )}

      <DonorListModal
        isOpen={isDonorModalOpen}
        onClose={() => setIsDonorModalOpen(false)}
        campaignId={campaignId}
        darkMode={darkMode}
      />
    </>
  );
}

function DonorAvatarStack({ campaignId, darkMode, totalDonors, setIsDonorModalOpen }) {
  const { data } = useFetchCampaignDonorsQuery({
    campaignId,
    page: 1,
    limit: 4
  });

  const donors = data?.donors || [];
  const hasMore = totalDonors > 4;

  const getInitials = (name) => {
    if (!name) return "KS";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-emerald-500', 'bg-purple-500',
      'bg-amber-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (donors.length === 0) return null;

  return (
    <div className="flex items-center gap-3 mb-6 transition-all duration-300">
      <div className="flex -space-x-3 overflow-hidden">
        {donors.map((donor, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`
              relative !flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-2
              ${darkMode ? "ring-zinc-800" : "ring-white"}
              text-white font-bold leading-none
              text-[10px] sm:text-xs shadow-sm shadow-black/10
              ${getAvatarColor(donor.fullName)}
            `}
          >
            {getInitials(donor.fullName)}
          </motion.div>
        ))}
        {hasMore && (
          <div className={`relative !flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-2 ${darkMode ? "ring-zinc-800" : "ring-white"} bg-zinc-700 text-white font-bold text-[10px] sm:text-xs leading-none shadow-sm`}>
            +{totalDonors - 4}
          </div>
        )}
      </div>
      <div>
        <p className={`text-xs sm:text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          <span className="font-bold text-emerald-500">
            {(() => {
              const firstDonor = donors[0];
              const isAnonymous = firstDonor?.fullName?.toLowerCase() === "kind supporter";

              if (totalDonors <= 1) {
                return isAnonymous ? "1 donor" : (firstDonor?.fullName || "0 donors");
              }

              // Rounding logic for "and more" (e.g., 62 becomes 60+)
              const displayCount = Math.floor((totalDonors - (isAnonymous ? 0 : 1)) / 10) * 10;
              const hasRounding = displayCount > 0;

              if (isAnonymous) {
                return `${hasRounding ? displayCount + "+" : totalDonors} donors`;
              } else {
                return `${firstDonor.fullName}${hasRounding ? ` and ${displayCount}+ more` : " and others"}`;
              }
            })()}
          </span> supported this campaign.{" "}
          <button
            type="button"
            onClick={() => setIsDonorModalOpen(true)}
            className="text-emerald-500 hover:text-emerald-400 font-bold hover:underline cursor-pointer inline-flex items-center gap-0.5 transition-all text-xs sm:text-sm"
          >
            Click here to view <ArrowRight className="w-3 h-3" />
          </button>
        </p>
      </div>
    </div>
  );
}

function StatCard({ darkMode, icon, value, label, color }) {
  const colorClasses = {
    emerald: darkMode ? 'text-emerald-400' : 'text-emerald-600',
    blue: darkMode ? 'text-blue-400' : 'text-blue-600',
    purple: darkMode ? 'text-purple-400' : 'text-purple-600'
  };

  const bgClasses = {
    emerald: darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50',
    blue: darkMode ? 'bg-blue-500/10' : 'bg-blue-50',
    purple: darkMode ? 'bg-purple-500/10' : 'bg-purple-50'
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`p-2 sm:p-4 rounded-xl border transition-all overflow-hidden ${darkMode ? "bg-zinc-900/50 border-zinc-700 hover:border-zinc-600" : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
        }`}
    >
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${bgClasses[color]} flex items-center justify-center mb-2 sm:mb-3`}>
        <div className={colorClasses[color]}>
          {icon}
        </div>
      </div>
      <div
        className={`text-[10px] min-[360px]:text-xs sm:text-lg md:text-xl font-bold tracking-tight sm:tracking-normal mb-0.5 sm:mb-1 truncate ${darkMode ? "text-white" : "text-gray-900"
          }`}
      >
        {value}
      </div>
      <p
        className={`text-[10px] sm:text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-600"
          }`}
      >
        {label}
      </p>
    </motion.div>
  );
}