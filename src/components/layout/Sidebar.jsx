"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppToast } from "@/app/AppToastContext";
import {
  User,
  Heart,
  FileCheck,
  ChevronRight,
  X,
  Menu,
  Wrench,
  AlertTriangle,
  ClipboardList,
  HandHeartIcon,
  Download,
  IndianRupeeIcon,
  Ticket,
} from "lucide-react";

const menuItems = [
  {
    name: "Profile",
    path: "/profile/userprofile",
    icon: User,
    gradient: "from-blue-500 to-indigo-600",
    activeColor: "blue",
    description: "Manage your personal details"
  },
  {
    name: "My Donations",
    path: "/profile/mydonation",
    icon: Heart,
    gradient: "from-emerald-500 to-teal-600",
    activeColor: "emerald",
    description: "View your contributions"
  },
  {
    name: "Offline Donations",
    path: "/profile/offline-donations",
    icon: IndianRupeeIcon,
    gradient: "from-cyan-500 to-blue-600",
    activeColor: "emerald",
    description: "Manage Offline Donations"
  },
  {
    name: "KYC Details",
    path: "/profile/kyc-details",
    icon: FileCheck,
    gradient: "from-blue-400 via-cyan-500 to-teal-400",
    activeColor: "purple",
    description: "Verify your identity"
  },
  {
    name: "My Communities",
    path: "/profile/my-communities",
    icon: HandHeartIcon,
    gradient: "from-orange-500 to-red-600",
    activeColor: "orange",
    description: "Manage your Communities"
  },
  {
    name: "My Campaigns",
    path: "/profile/my-campaign",
    icon: ClipboardList,
    gradient: "from-rose-500 to-red-600",
    activeColor: "orange",
    description: "Manage your Fundraisers"
  },
  {
    name: "Downloads",
    path: "/profile/downloads",
    icon: Download,
    gradient: "from-cyan-500 to-blue-600",
    activeColor: "orange",
    description: "Manage your Receipts and Invoices"
  },
  {
    name: "Contact Us",
    path: "/profile/contactpage",
    icon: Wrench,
    gradient: "from-rose-500 to-red-600",
    activeColor: "rose",
    description: "Submit Queries and Feedbacks"
  },
  {
    name: "Raise a Voucher",
    path: "/profile/vouchers",
    icon: Ticket, // lucide icon
    gradient: "from-orange-400 to-pink-500",
    activeColor: "orange",
    description: "Submit expense for reimbursement",
    role: "volunteer"
  },
];

const SidebarContent = memo(({ onClose, darkMode, profileCompletion, role }) => {
  const filteredMenuItems = menuItems.filter(item => !item.role || item.role === role);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const { showToast } = useAppToast();
  const firstIncomplete = filteredMenuItems.find((i) => i.incomplete);

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col h-full">
      {/* HEADER - Fixed height, no scroll */}
      <div
        className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b flex-shrink-0 ${darkMode ? "border-zinc-800" : "border-gray-200"
          }`}
      >
        <div className="flex items-center justify-between mb-1">
          <h2
            className={`text-base sm:text-lg lg:text-xl font-bold truncate ${darkMode ? "text-white" : "text-gray-900"
              }`}
          >
            {filteredMenuItems.find((i) => i.path === pathname)?.name || "My Profile"}
          </h2>

          <button
            onClick={onClose}
            className={`lg:hidden p-1.5 sm:p-2 rounded-lg transition-colors ${darkMode
              ? "hover:bg-zinc-800 text-zinc-400"
              : "hover:bg-gray-100 text-gray-600"
              }`}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Profile Completion - Compact */}
        {mounted && (
          <>
            {profileCompletion < 100 && (
              <div className="mt-2 sm:mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] sm:text-xs font-medium ${darkMode ? "text-zinc-300" : "text-gray-700"
                      }`}
                  >
                    Profile Completion
                  </span>
                  <span
                    className={`text-[10px] sm:text-xs font-bold ${darkMode ? "text-zinc-400" : "text-gray-600"
                      }`}
                  >
                    {`${profileCompletion}%`}
                  </span>
                </div>

                <div
                  className={`w-full h-1.5 sm:h-2 rounded-full overflow-hidden ${darkMode ? "bg-zinc-800" : "bg-gray-200"
                    }`}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profileCompletion}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${profileCompletion >= 75
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                      : profileCompletion >= 50
                        ? "bg-gradient-to-r from-orange-500 to-amber-500"
                        : "bg-gradient-to-r from-red-500 to-rose-500"
                      }`}
                  />
                </div>

                <p
                  className={`text-[9px] sm:text-[10px] mt-1 ${darkMode ? "text-zinc-500" : "text-gray-500"
                    }`}
                >
                  Complete to unlock all features
                </p>

                {firstIncomplete && (
                  <button
                    onClick={() => { router.push(firstIncomplete.path); onClose?.(); }}
                    className={`mt-2 w-full text-[10px] sm:text-xs font-semibold cursor-pointer py-1.5 rounded-lg transition-all active:scale-95 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm hover:shadow-md hover:from-blue-600 hover:to-indigo-600`}
                  >
                    Complete Profile →
                  </button>
                )}
              </div>
            )}

            {profileCompletion === 100 && (
              <div
                className={`mt-2 sm:mt-3 px-2 sm:px-3 py-2 rounded-lg text-center border backdrop-blur-sm ${darkMode
                  ? "bg-emerald-900/10 border-emerald-800/40"
                  : "bg-emerald-50/70 border-emerald-200"
                  }`}
              >
                <p
                  className={`text-[10px] sm:text-xs font-semibold ${darkMode ? "text-emerald-300" : "text-emerald-700"
                    }`}
                >
                  "Every act of kindness is a charity."
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* MENU - Scrollable but optimized for screen height */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide px-2 sm:px-3 py-2 sm:py-3">
        <div className="flex flex-col space-y-1 sm:space-y-1.5">
          {filteredMenuItems.map((item, index) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className="block"
                onClick={(e) => {
                  if (isActive) {
                    e.preventDefault();
                    router.refresh();
                    showToast({
                      title: "Already Here",
                      message: `You are already viewing ${item.name}.`,
                      type: "info",
                      duration: 2500,
                    });
                  }
                  onClose?.();
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative group rounded-lg sm:rounded-xl transition-all duration-300 border-2 ${isActive
                    ? darkMode
                      ? "bg-zinc-800/80 shadow-xl border-transparent"
                      : "bg-gradient-to-r from-gray-50 to-white shadow-xl border-gray-200"
                    : darkMode
                      ? "hover:bg-zinc-800/50 border-transparent"
                      : "hover:bg-gray-50 border-transparent"
                    }`}
                >
              

                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 rounded-r-full bg-gradient-to-b ${item.gradient} shadow-lg`}
                    />
                  )}

                  <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5">
                    <div className={`relative w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isActive
                      ? `bg-gradient-to-br ${item.gradient} shadow-lg shadow-${item.activeColor}-500/30`
                      : darkMode
                        ? "bg-zinc-800"
                        : "bg-gray-100"
                      }`}>
                      <Icon className={`w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ${isActive ? "text-white" : darkMode ? "text-zinc-400" : "text-gray-600"
                        }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={`text-xs sm:text-sm font-semibold mb-0.5 truncate ${isActive
                        ? darkMode ? "text-white" : "text-gray-900"
                        : darkMode ? "text-zinc-300" : "text-gray-700"
                        }`}>
                        {item.name}
                      </h3>
                      <p className={`text-[9px] sm:text-[10px] truncate ${isActive
                        ? darkMode ? "text-zinc-400" : "text-gray-600"
                        : darkMode ? "text-zinc-500" : "text-gray-500"
                        }`}>
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {mounted && item.incomplete && (
                        <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                      )}

                      <ChevronRight
                        className={`w-3 h-3 sm:w-4 sm:h-4 transition-all ${isActive
                            ? darkMode
                              ? "text-white translate-x-0.5"
                              : "text-gray-900 translate-x-0.5"
                            : darkMode
                              ? "text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                              : "text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                          }`}
                      />
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
});

SidebarContent.displayName = "SidebarContent";

function Sidebar({ darkMode }) {
  const pathname = usePathname();
  const user = useSelector((state) => state.auth.userInfo);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => setIsMobileOpen((prev) => !prev), []);
  const closeMobileMenu = useCallback(() => setIsMobileOpen(false), []);

  // Profile completion calculation
  const calcProfile = () => {
    let score = 0;
    if (user?.fullName) score += 15;
    if (user?.email) score += 15;
    if (user?.mobileNo) score += 15;
    if (user?.bloodGroup) score += 15;
    if (user?.gender) score += 15;
    if (user?.dob) score += 15;
    if (user?.profession) score += 10;
    return score;
  };

  const calcKyc = () => {
    const k = user?.kycDetails;
    if (!k) return 0;
    const hasAll = k.fullLegalName && k.panNumber && k.address && k.city && k.state;
    return hasAll ? 100 : 0;
  };

  const profilePhase = calcProfile();
  const kycPhase = calcKyc();
  const totalCompletion = Math.round(profilePhase * 0.5 + kycPhase * 0.5);

  // Update incomplete flags
  menuItems.find((i) => i.path === "/profile/userprofile").incomplete = profilePhase < 100;
  menuItems.find((i) => i.path === "/profile/kyc-details").incomplete = kycPhase < 100;

  useEffect(() => closeMobileMenu(), [pathname, closeMobileMenu]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* MOBILE FLOATING BUTTON */}
      <button
        onClick={toggleMobileMenu}
        aria-label="Open menu"
        className={`lg:hidden fixed left-6 bottom-6 z-40 p-4 rounded-2xl shadow-2xl transition-all active:scale-95 border-2 ${darkMode
          ? "bg-gradient-to-br from-emerald-600/90 to-teal-700/90 border-emerald-500/30 text-white backdrop-blur-md shadow-emerald-900/20"
          : "bg-gradient-to-br from-emerald-500 to-teal-500 border-white/40 text-white shadow-emerald-500/20"
          }`}
      >
        <User className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* MOBILE SIDEBAR - Full height, responsive width */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`lg:hidden fixed top-0 left-0 bottom-0 w-[280px] sm:w-[320px] z-50 ${darkMode ? "bg-zinc-900" : "bg-white"
              }`}
          >
            <SidebarContent
              onClose={closeMobileMenu}
              darkMode={darkMode}
              profileCompletion={totalCompletion}
              role={user?.role}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR - Scrollable, not sticky */}
      <aside
        className={`hidden lg:block w-60 xl:w-72 2xl:w-80 border-r flex-shrink-0 ${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100"
          } overflow-y-auto`}

      >
        <SidebarContent darkMode={darkMode} profileCompletion={totalCompletion} role={user?.role} />
      </aside>
    </>
  );
}

export default memo(Sidebar);