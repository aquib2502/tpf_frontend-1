"use client";

import { ArrowRight, Sprout } from "lucide-react";
import Reveal from "./Reveal";

// A climbing vine, drawn once and mirrored for the other side.
function Vine({ className = "" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 320"
      className={`pointer-events-none absolute h-[19rem] w-28 text-pd-forest-soft ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M60 320 C60 250 30 220 40 150 C48 100 80 80 70 20" opacity="0.5" />
      {[
        [48, 262, -35],
        [70, 222, 40],
        [38, 176, -40],
        [66, 132, 38],
        [48, 92, -35],
        [70, 52, 35],
      ].map(([x, y, r]) => (
        <path
          key={`${x}-${y}`}
          d="M0 0 C10 -10 24 -10 30 0 C20 10 8 10 0 0 Z"
          transform={`translate(${x} ${y}) rotate(${r})`}
          fill="currentColor"
          fillOpacity="0.14"
          opacity="0.7"
        />
      ))}
    </svg>
  );
}

export default function GrowthBand({ onClick }) {
  return (
    <Reveal className="relative overflow-hidden rounded-[2rem] border border-pd-gold/40 bg-pd-goldsoft px-6 py-14 sm:px-20 sm:py-16 text-center">
      <Vine className="left-8 bottom-0 hidden md:block" />
      <Vine className="right-8 bottom-0 hidden -scale-x-100 md:block" />

      <div className="relative mx-auto max-w-xl">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-pd-surface text-pd-edge shadow-sm">
          <Sprout aria-hidden className="h-7 w-7" strokeWidth={1.5} />
        </span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-pd-clay">
          Sadaqah jariyah
        </p>
        <p className="pd-serif mt-3 text-3xl sm:text-4xl font-medium leading-[1.15] tracking-tight text-balance">
          Plant a gift that keeps growing
        </p>

        <blockquote className="mt-6">
          <p className="pd-serif text-lg italic leading-snug text-pd-ink/85 text-balance">
            “Allah takes it in His right hand and enlarges its reward for the giver, as one of you
            raises a foal, until it becomes as big as a mountain.”
          </p>
          <footer className="mt-2 text-xs font-medium text-pd-muted">
            Prophet Muhammad ﷺ · Sahih al-Bukhari 1410
          </footer>
        </blockquote>

        <button
          type="button"
          onClick={onClick}
          className="group mt-8 h-12 px-7 rounded-full bg-pd-forest text-pd-onforest font-semibold text-[15px] inline-flex items-center justify-center gap-2.5 hover:-translate-y-0.5 transition-transform cursor-pointer"
        >
          Start my sadaqah jariyah
          <ArrowRight size={17} aria-hidden className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </Reveal>
  );
}
