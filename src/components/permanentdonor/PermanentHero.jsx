"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Home, UserCheck, HeartHandshake, ShieldCheck } from "lucide-react";

const ARCH_RADII = [280, 230, 180, 130];

// Quiet floating icons that fill the empty sides of the hero on wide screens.
const FLOATERS = [
  { Icon: Home, pos: "left-[3%] top-[38%]", delay: 0 },
  { Icon: UserCheck, pos: "left-[11%] top-[62%]", delay: 0.8 },
  { Icon: HeartHandshake, pos: "right-[3%] top-[36%]", delay: 0.4 },
  { Icon: ShieldCheck, pos: "right-[11%] top-[62%]", delay: 1.2 },
];

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

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-6 pb-24 sm:pb-32">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 py-2 text-sm font-medium text-pd-muted transition-colors hover:text-pd-ink cursor-pointer"
        >
          <ArrowLeft size={16} aria-hidden />
          Back
        </button>

        {FLOATERS.map(({ Icon, pos, delay }) => (
          <motion.span
            key={pos}
            aria-hidden
            className={`pointer-events-none absolute ${pos} hidden lg:grid h-16 w-16 place-items-center rounded-full border border-pd-line bg-pd-surface text-pd-edge shadow-[0_14px_30px_-14px_rgba(20,36,28,0.35)]`}
            animate={reduce ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 5, delay, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon className="h-7 w-7" strokeWidth={1.5} />
          </motion.span>
        ))}

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
              className="group h-14 px-9 rounded-full bg-pd-gold text-pd-ongold font-bold text-base inline-flex items-center justify-center gap-2.5 shadow-[0_10px_24px_-8px_rgba(240,177,58,0.8)] hover:bg-pd-gold-hover hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              Become a Permanent Donor
              <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-1" />
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
