"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetMeQuery } from "@/utils/slices/authApiSlice";

import PermanentHero from "./PermanentHero";
import PermanentSadaqah from "./PermanentSadaqah";
import PermanentPillars from "./PermanentPillars";
import PermanentImpactCompare from "./PermanentImpactCompare";
import PermanentWorkflow from "./PermanentWorkflow";
import PermanentFaq from "./PermanentFaq";
import PermanentDonateModal from "./PermanentDonateModal";
import PermanentStickyBar from "./PermanentStickyBar";
import CtaBand from "./CtaBand";
import GrowthBand from "./GrowthBand";

export default function PermanentDonorPage({ darkModeFromParent }) {
  const [darkMode, setDarkMode] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [bandVisible, setBandVisible] = useState(false);

  const { userInfo, persistedUser } = useSelector((state) => state.auth);
  const { data: userData } = useGetMeQuery(undefined, {
    skip: !userInfo && !persistedUser,
  });

  const currentUser = userData?.user || userData?.data || userInfo;
  const isPermanentMember = Boolean(currentUser?.permanentMember);

  useEffect(() => {
    if (darkModeFromParent !== undefined) {
      setDarkMode(darkModeFromParent);
    }
  }, [darkModeFromParent]);

  // Floating pill: only after the hero, and never on top of a donate banner.
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const visible = new Set();
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
              setBandVisible(visible.size > 0);
            },
            // ignore the strip under the navbar and the bottom edge where the pill sits
            { rootMargin: "-80px 0px -80px 0px" }
          )
        : null;
    document.querySelectorAll("[data-donate-band]").forEach((el) => io?.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  // Every donate button on this page opens the same modal.
  const openDonate = () => setDonateOpen(true);

  return (
    <div
      data-theme={darkMode ? "dark" : "light"}
      className="pd-root w-full min-h-screen bg-pd-paper text-pd-ink antialiased transition-colors"
    >
      <PermanentHero onDonateClick={openDonate} isPermanentMember={isPermanentMember} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-32 flex flex-col gap-28 sm:gap-40">
        <PermanentSadaqah />

        <div data-donate-band>
          <GrowthBand onClick={openDonate} />
        </div>

        <PermanentPillars onDonateClick={openDonate} />
        <PermanentImpactCompare />
        <PermanentWorkflow onDonateClick={openDonate} />
        <PermanentFaq />

        <div data-donate-band>
          <CtaBand
            eyebrow="₹1,000 is all it takes"
            title="Be there for the next family"
            sub="One payment. No auto-debit."
            cta="Become a Permanent Donor"
            onClick={openDonate}
          />
        </div>
      </div>

      <PermanentStickyBar isVisible={pastHero && !bandVisible && !donateOpen} onDonateClick={openDonate} />

      <PermanentDonateModal open={donateOpen} onOpenChange={setDonateOpen} darkMode={darkMode} />
    </div>
  );
}
