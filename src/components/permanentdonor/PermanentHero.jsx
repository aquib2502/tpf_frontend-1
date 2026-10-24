"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import HeroSkyline from "./HeroSkyline";

const ARCH_RADII = [280, 230, 180, 130];

export default function PermanentHero({ onDonateClick, isPermanentMember }) {
  const router = useRouter();
  const reduce = useReducedMotion();

  const rise = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section className="relative overflow-hidden bg-pd-paper">
      {/* Soft mihrab-style arches, a quiet nod to the mission */}
      <svg
        aria-hidden
        viewBox="0 0 600 340"
        className="pointer-events-none absolute bottom-0 left-1/2 w-[900px] max-w-none -translate-x-1/2 text-pd-line"
      >
        <path d="M20 340 V300 A280 280 0 0 1 580 300 V340 Z" fill="var(--pd-tint)" opacity="0.7" />
        {ARCH_RADII.map((r) => (
          <path
            key={r}
            d={`M${300 - r} 340 V300 A${r} ${r} 0 0 1 ${300 + r} 300 V340`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        ))}
      </svg>

      {/* soft light behind the headline: a touch of gold in the middle, site greens on the wings */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(34% 32% at 50% 38%, rgba(226,171,61,0.12), transparent 70%), radial-gradient(45% 55% at 12% 30%, rgba(16,185,129,0.10), transparent 70%), radial-gradient(45% 55% at 88% 30%, rgba(20,184,166,0.10), transparent 70%)",
        }}
      />

      <HeroSkyline />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-6 pb-28 sm:pb-36">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 py-2 text-sm font-medium text-pd-muted transition-colors hover:text-pd-ink cursor-pointer"
        >
          <ArrowLeft size={16} aria-hidden />
          Back
        </button>

        <div className="mx-auto mt-8 sm:mt-14 max-w-3xl text-center">
          <motion.h1
            {...rise(0.04)}
            className="pd-serif text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl font-medium tracking-[-0.02em] text-balance"
          >
            Be part of every family TPF helps.
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mx-auto mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-pd-muted text-balance"
          >
            Pledge ₹1,000 once a year and share in the reward of every case we verify, inshallah.
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-10 flex flex-col items-center gap-5">
            <button
              id="pd-hero-cta"
              type="button"
              onClick={onDonateClick}
              className="group h-14 px-9 rounded-full bg-pd-accent text-pd-onaccent font-bold text-base inline-flex items-center justify-center gap-2.5 shadow-[0_10px_24px_-10px_rgba(5,150,105,0.65)] hover:bg-pd-accent-hover hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              Become a Permanent Donor
              <ArrowRight size={18} aria-hidden className="text-pd-gold transition-transform group-hover:translate-x-1" />
            </button>

            <p className="text-[13px] text-pd-muted">
              No auto-debit <span aria-hidden>·</span> 100% of public donations reach families
            </p>

            {isPermanentMember && (
              <p className="inline-flex items-center gap-2 rounded-full border border-pd-gold/50 bg-pd-goldsoft px-4 py-2 text-sm font-medium text-pd-ink">
                <Sparkles size={15} aria-hidden className="text-pd-gold" />
                You’re already an active Permanent Member. Thank you.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
