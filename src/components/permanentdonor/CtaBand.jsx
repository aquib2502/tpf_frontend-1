"use client";

import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

const ARCHES = [150, 115, 80];

// Eight-pointed star + arches: quiet ornaments that fill the sides of the band.
function SideOrnament({ className = "" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 320 320"
      className={`pointer-events-none absolute h-[19rem] w-[19rem] text-pd-gold ${className}`}
      fill="none"
      stroke="currentColor"
    >
      {ARCHES.map((r) => (
        <path key={r} d={`M${160 - r} 320 V${200} A${r} ${r} 0 0 1 ${160 + r} 200 V320`} strokeWidth="1.5" opacity="0.28" />
      ))}
      <g transform="translate(160 118)" strokeWidth="1.5" opacity="0.5">
        <rect x="-34" y="-34" width="68" height="68" />
        <rect x="-34" y="-34" width="68" height="68" transform="rotate(45)" />
        <circle r="8" fill="currentColor" stroke="none" opacity="0.7" />
      </g>
    </svg>
  );
}

export default function CtaBand({ eyebrow, title, sub, cta, onClick }) {
  return (
    <Reveal className="relative overflow-hidden rounded-[2rem] bg-pd-forest text-pd-onforest px-6 py-14 sm:px-16 sm:py-20 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(240,177,58,0.18),transparent)]"
      />
      <SideOrnament className="-left-24 -bottom-20 sm:-left-10" />
      <SideOrnament className="-right-24 -bottom-20 sm:-right-10" />

      <div className="relative mx-auto max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pd-gold">{eyebrow}</p>
        <p className="pd-serif mt-4 text-3xl sm:text-5xl font-medium leading-[1.1] tracking-tight text-balance">
          {title}
        </p>
        {sub && <p className="mt-4 text-base text-pd-onforest-muted text-balance">{sub}</p>}

        <button
          type="button"
          onClick={onClick}
          className="pd-glow group mt-9 h-14 px-9 rounded-full bg-pd-gold text-pd-ongold font-bold text-base inline-flex items-center justify-center gap-2.5 hover:bg-pd-gold-hover hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          {cta}
          <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </Reveal>
  );
}
