"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getMediaUrl } from "@/utils/media";
import {
  LayoutDashboard,
  Heart,
  Download,
  ClipboardList,
  Wrench,
  IndianRupeeIcon,
  ChevronRight,
  X,
  Building2,
  BadgeCheck,
  Plus,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/organization/profile/dashboard",
    icon: LayoutDashboard,
    gradient: "from-emerald-500 to-teal-600",
    description: "Organization overview",
  },
  {
    name: "My Donations",
    path: "/organization/profile/mydonation",
    icon: Heart,
    gradient: "from-rose-500 to-pink-600",
    description: "View contributions",
  },
  {
    name: "Downloads",
    path: "/organization/profile/downloads",
    icon: Download,
    gradient: "from-cyan-500 to-blue-600",
    description: "Receipts & invoices",
  },
  {
    name: "My Campaigns",
    path: "/organization/profile/my-campaigns",
    icon: ClipboardList,
    gradient: "from-violet-500 to-purple-600",
    description: "Manage fundraisers",
  },
  {
    name: "Offline Donations",
    path: "/organization/profile/offline-donations",
    icon: IndianRupeeIcon,
    gradient: "from-amber-500 to-orange-500",
    description: "Manage offline donations",
  },
  {
    name: "Contact Us",
    path: "/organization/profile/contactpage",
    icon: Wrench,
    gradient: "from-slate-500 to-zinc-600",
    description: "Support & feedback",
  },
];

const SidebarContent = memo(({ onClose, darkMode, org }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const logoUrl = getMediaUrl(org?.organizationLogo);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className={`px-4 lg:px-5 py-4 border-b flex-shrink-0 ${darkMode ? "border-zinc-800" : "border-gray-100"
          }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Logo */}
            <div
              className={`w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 border ${darkMode ? "border-zinc-700" : "border-gray-200"
                }`}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={getMediaUrl(org?.organizationName)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p
                className={`text-sm font-bold truncate leading-tight ${darkMode ? "text-white" : "text-gray-900"
                  }`}
              >
                {org?.organizationName || "Organization"}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <BadgeCheck className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span className="text-[10px] text-emerald-500 font-semibold capitalize">
                  {org?.verificationStatus || "pending"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`lg:hidden p-1.5 rounded-lg transition-colors flex-shrink-0 ${darkMode
                ? "hover:bg-zinc-800 text-zinc-400"
                : "hover:bg-gray-100 text-gray-500"
              }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active path label */}
        {mounted && (
          <p
            className={`text-[11px] font-medium truncate ${darkMode ? "text-zinc-500" : "text-gray-400"
              }`}
          >
            {menuItems.find((i) => i.path === pathname)?.name || "Navigation"}
          </p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide px-2.5 py-3">
        <div className="flex flex-col gap-1">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path} className="block">
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                  className={`relative group rounded-xl transition-colors duration-200 ${isActive
                      ? darkMode
                        ? "bg-zinc-800"
                        : "bg-gray-50 shadow-sm"
                      : darkMode
                        ? "hover:bg-zinc-800/60"
                        : "hover:bg-gray-50"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="orgActiveTab"
                      className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b ${item.gradient}`}
                    />
                  )}

                  <div className="flex items-center gap-2.5 px-3 py-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isActive
                          ? `bg-gradient-to-br ${item.gradient}`
                          : darkMode
                            ? "bg-zinc-800"
                            : "bg-gray-100"
                        }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${isActive
                            ? "text-white"
                            : darkMode
                              ? "text-zinc-400"
                              : "text-gray-500"
                          }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold truncate ${isActive
                            ? darkMode
                              ? "text-white"
                              : "text-gray-900"
                            : darkMode
                              ? "text-zinc-300"
                              : "text-gray-700"
                          }`}
                      >
                        {item.name}
                      </p>
                      <p
                        className={`text-[10px] truncate ${darkMode ? "text-zinc-500" : "text-gray-400"
                          }`}
                      >
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isActive
                          ? darkMode
                            ? "text-white translate-x-0.5"
                            : "text-gray-700 translate-x-0.5"
                          : "text-gray-300 opacity-0 group-hover:opacity-100"
                        }`}
                    />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Campaign Request Action Button */}
      <div className="px-3 py-2 shrink-0">
        <Link href="/organization/profile/my-campaigns/create">
          <button className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
            darkMode 
              ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30" 
              : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
          }`}>
            <Plus size={16} />
            Request New Campaign
          </button>
        </Link>
      </div>

      {/* Footer */}
      <div
        className={`px-4 py-3 border-t flex-shrink-0 ${darkMode ? "border-zinc-800" : "border-gray-100"
          }`}
      >
        <p
          className={`text-[10px] text-center ${darkMode ? "text-zinc-600" : "text-gray-400"
            }`}
        >
          {org?.companyDetails?.businessDomain || "Organization"} ·{" "}
          {org?.city}, {org?.state}
        </p>
      </div>
    </div>
  );
});

SidebarContent.displayName = "OrgSidebarContent";

function OrgSidebar({ darkMode }) {
  const pathname = usePathname();
  const org = useSelector((state) => state.auth.userInfo);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = useCallback(() => setIsMobileOpen((p) => !p), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  useEffect(() => closeMobile(), [pathname, closeMobile]);
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileOpen]);

  const logoUrl = getMediaUrl(org?.organizationLogo);

  return (
    <>
      {/* Mobile FAB */}
      <button
        onClick={toggleMobile}
        aria-label="Open organization menu"
        className={`lg:hidden fixed left-5 bottom-5 z-40 p-3.5 rounded-2xl shadow-xl transition-all active:scale-95 border ${darkMode
            ? "bg-zinc-900 border-zinc-700 text-white"
            : "bg-white border-gray-200 text-gray-700 shadow-gray-200"
          }`}
      >
        {logoUrl ? (
          <img src={logoUrl} alt="" className="w-6 h-6 rounded-lg object-cover" />
        ) : (
          <Building2 className="w-5 h-5" />
        )}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className={`lg:hidden fixed top-0 left-0 bottom-0 w-[280px] sm:w-[300px] z-50 ${darkMode ? "bg-zinc-900" : "bg-white"
              }`}
          >
            <SidebarContent onClose={closeMobile} darkMode={darkMode} org={org} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col w-56 xl:w-64 border-r flex-shrink-0 overflow-y-auto ${darkMode
            ? "bg-zinc-900 border-zinc-800"
            : "bg-white border-gray-100"
          }`}
      >
        <SidebarContent darkMode={darkMode} org={org} />
      </aside>
    </>
  );
}

export default memo(OrgSidebar);