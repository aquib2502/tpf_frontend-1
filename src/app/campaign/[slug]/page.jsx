"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useFetchCampaignBySlugQuery } from "@/utils/slices/campaignApiSlice";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

import CampaignHero from "@/components/campaign/CampaignHero";
import CampaignProgress from "@/components/campaign/CampaignProgress";
import CampaignTabs from "@/components/campaign/CampaignTabs";
import CampaignVideo from "@/components/campaign/CampaignVideo";
import DonationCard from "@/components/campaign/DonationCard";
import DonatePopUpModal from "@/components/campaign/DonateModal";
import RelatedCampaigns from "@/components/campaign/RelatedCampaigns";
import FooterCTA from "@/components/campaign/FooterCTA";
import TrustSafety from "@/components/campaign/TrustSafety";
import FloatingDonateButton from "@/components/campaign/FloatingDonateButton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlobalLoader from "@/components/GlobalLoader";

export default function CampaignPage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Find name
  let rawName = searchParams.get("name") || searchParams.get("referral_name") || searchParams.get("ref_name");
  // Find city
  let rawCity = searchParams.get("city") || searchParams.get("referral_city") || searchParams.get("ref_city");
  // Find source/category
  let rawRef = searchParams.get("source") || searchParams.get("category") || searchParams.get("referral_source") || searchParams.get("referral_category") || searchParams.get("ref_category");
  
  const refVal = searchParams.get("ref");
  const categoriesList = ["masjid", "insta", "instagram", "whatsapp", "email", "meta", "facebook", "broadcast", "ads"];
  
  let detectedCategory = rawRef || "";
  let detectedName = rawName || "";
  
  if (refVal) {
    const isCategory = categoriesList.some(cat => refVal.toLowerCase().includes(cat));
    if (isCategory) {
      if (!detectedCategory) detectedCategory = refVal;
    } else {
      if (!detectedName) detectedName = refVal;
    }
  }
  
  if (!detectedCategory && refVal) detectedCategory = refVal;
  if (!detectedName && refVal && refVal !== detectedCategory) detectedName = refVal;
  
  let refSource = "";
  if (detectedCategory) {
    const cleanRef = detectedCategory.toLowerCase().trim();
    if (cleanRef.includes("insta") || cleanRef === "instagram" || cleanRef === "ig") {
      refSource = "Insta Influencer";
    } else if (cleanRef.includes("masjid") || cleanRef.includes("mosque")) {
      refSource = "Masjid";
    } else if (cleanRef.includes("whatsapp") || cleanRef === "wa") {
      refSource = "WhatsappAPI";
    } else if (cleanRef.includes("email") || cleanRef.includes("broadcast")) {
      refSource = "Email Broadcast";
    } else if (cleanRef.includes("meta") || cleanRef.includes("fb") || cleanRef.includes("facebook") || cleanRef.includes("ad")) {
      refSource = "Meta Ads";
    } else {
      refSource = detectedCategory.charAt(0).toUpperCase() + detectedCategory.slice(1);
    }
  }

  const referral = {
    refSource,
    refName: detectedName || "",
    refCity: rawCity || ""
  };

  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(true);
  const donationCardRef = useRef(null);
  const [isFloatingModalOpen, setIsFloatingModalOpen] = useState(false);
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);

  const { data, isLoading, error } = useFetchCampaignBySlugQuery(slug, {
    skip: !slug,
  });

  useEffect(() => {
    if (isLoading || !data?.campaign || data.campaign.campaignStatus === "COMPLETED") return;

    const MAX_AUTO_OPENS = 4;
    const storageKey = "donate_popup_count";

    const rawCount = sessionStorage.getItem(storageKey);
    const count = rawCount ? parseInt(rawCount, 10) : 0;

    if (count < MAX_AUTO_OPENS) {
      setIsFloatingModalOpen(true);
      sessionStorage.setItem(storageKey, String(count + 1));
    }
  }, [isLoading]);

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (error || !data?.campaign) {
    return (
      <div className="py-24 text-center text-red-600">
        Campaign not found
      </div>
    );
  }

  const campaign = data.campaign;
  const isCompleted = campaign.campaignStatus === "COMPLETED";

  const handleDonateClick = () => {
    if (isCompleted) return;
    setIsFloatingModalOpen(true);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-zinc-900" : "bg-gray-50"}`}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        scrolled={scrolled}
      />

      {/* Hero Section */}
      <div className="relative w-full pt-14 md:pt-20">
        {/* Back Button */}
        <div className="absolute top-16 md:top-24 left-2 sm:left-4 md:left-8 z-20">
          <button
            type="button"
            onClick={() => router.back()}
            className={`group flex items-center gap-2 transition-colors duration-200 ${darkMode
                ? "text-white hover:text-emerald-400"
                : "text-gray-900 hover:text-emerald-600"
              }`}
            aria-label="Go back"
          >
            <div
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border backdrop-blur-md shadow-lg transition-all duration-200 ${darkMode
                  ? "bg-black/40 border-white/20 hover:border-emerald-500/50 hover:bg-black/60"
                  : "bg-white/70 border-gray-200 hover:border-emerald-500/40 hover:bg-white"
                }`}
            >
              <ArrowLeft size={18} className="sm:size-[20px]" strokeWidth={2.5} />
            </div>
          </button>
        </div>

        <CampaignHero
          campaign={campaign}
          darkMode={darkMode}
          onDonateClick={handleDonateClick}
          isCompleted={isCompleted}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress */}
        <div className="mt-4 sm:mt-6">
          <CampaignProgress
            darkMode={darkMode}
            campaign={campaign}
            onDonateClick={handleDonateClick}
            isDonorModalOpen={isDonorModalOpen}
            setIsDonorModalOpen={setIsDonorModalOpen}
            isCompleted={isCompleted}
          />
        </div>

        {/* Tabs + Donation Card grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6">
          {/* Tabs - left 2/3 */}
          <div className="lg:col-span-2">
            <CampaignTabs campaign={campaign} darkMode={darkMode} />
          </div>

          {/* Donation Card - right 1/3 */}
          <div className="lg:col-span-1" ref={donationCardRef}>
            <DonationCard
              campaignId={campaign._id}
              targetAmount={campaign.targetAmount}
              zakatVerified={campaign.zakatVerified}
              taxEligible={campaign.taxBenefits}
              ribaEligible={campaign.ribaEligible}
              allowedDonationTypes={campaign.allowedDonationTypes}
              unitConfig={campaign.unitConfig}
              darkMode={darkMode}
              isCompleted={isCompleted}
              referral={referral}
            />
          </div>
        </div>

        {/* Trust & Safety - mobile only */}
        <div className="lg:hidden mt-6">
          <TrustSafety darkMode={darkMode} />
        </div>

        {/* ── Campaign Video ── */}
        {/* On desktop: video sits in the left 2/3 column to match the tabs width */}
        {/* On mobile: full width */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6">
          <div className="lg:col-span-2">
            <CampaignVideo campaign={campaign} darkMode={darkMode} />
          </div>
          {/* empty right column keeps video aligned with tabs above */}
          <div className="hidden lg:block lg:col-span-1" />
        </div>

        {/* Related Campaigns */}
        <RelatedCampaigns
          category={campaign.category}
          currentSlug={campaign.slug}
          darkMode={darkMode}
        />

        <FooterCTA darkMode={darkMode} />
      </div>

      <Footer darkMode={darkMode} />

      <FloatingDonateButton
        darkMode={darkMode}
        onClick={() => setIsFloatingModalOpen(true)}
        isModalOpen={isFloatingModalOpen || isDonorModalOpen}
        isCompleted={isCompleted}
      />

      <DonatePopUpModal
        isOpen={isFloatingModalOpen && !isCompleted}
        onClose={() => setIsFloatingModalOpen(false)}
        darkMode={darkMode}
        campaignId={campaign._id}
        campaignSlug={campaign.slug}
        zakatVerified={campaign.zakatVerified}
        ribaEligible={campaign.ribaEligible}
        sadaqahEligible={campaign.sadaqahEligible ?? true}
        lillahEligible={campaign.lillahEligible ?? true}
        imdadEligible={campaign.imdadEligible ?? true}
        taxEligible={campaign.taxBenefits}
        allowedDonationTypes={campaign.allowedDonationTypes}
        unitConfig={campaign.unitConfig}
        referral={referral}
      />
    </div>
  );
}