"use client";

import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

// Arabian evening: dunes, a dallah and palms on one side, a mosque on the other, a fanous
// lantern and a crescent above. Soft, low-contrast silhouettes in the band's own greens,
// with gold used sparingly for the details.

const DUNE_FAR = "#17503b";
const DUNE_NEAR = "#0a2e22";
const SHAPE = "#1c5f47";
const GOLD = "var(--pd-gold)";

function Palm({ x, y, h, dir = 1, scale = 1 }) {
  const topX = dir * 2;
  const fronds = [
    [-165, 38],
    [-135, 44],
    [-105, 34],
    [-75, 34],
    [-45, 44],
    [-15, 38],
  ].map(([deg, len]) => {
    const r = (deg * Math.PI) / 180;
    const tx = +(Math.cos(r) * len * scale).toFixed(1);
    const ty = +(Math.sin(r) * len * scale + 14 * scale).toFixed(1);
    const cx = +(Math.cos(r) * len * 0.55 * scale).toFixed(1);
    const cy = +(Math.sin(r) * len * 0.55 * scale - 11 * scale).toFixed(1);
    return `M0 0 Q${cx} ${cy} ${tx} ${ty}`;
  });
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={SHAPE} strokeLinecap="round">
      <path d={`M0 0 Q${dir * 4} ${-h * 0.5} ${topX} ${-h}`} strokeWidth={3 * scale} />
      <g transform={`translate(${topX} ${-h})`} strokeWidth={3.2 * scale}>
        {fronds.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </g>
  );
}

function Landscape() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 220"
      preserveAspectRatio="xMidYMax meet"
      className="pointer-events-none absolute bottom-0 left-1/2 w-full max-w-[1500px] -translate-x-1/2"
    >
      <path d="M0 168 C150 138 300 174 450 158 S750 184 900 156 S1100 148 1200 166 V220 H0Z" fill={DUNE_FAR} />

      {/* left: dallah, the Arabic coffee pot, and a palm */}
      <g transform="translate(120 4)">
        <path d="M74 186 H128 L120 152 Q101 143 82 152Z" fill={SHAPE} />
        <path d="M92 150 L97 118 H107 L112 150Z" fill={SHAPE} />
        <path d="M94 118 Q102 102 110 118Z" fill={SHAPE} />
        <circle cx="102" cy="99" r="3.2" fill={GOLD} opacity="0.9" />
        <path d="M78 164 Q48 148 38 108 L45 106 Q55 142 84 154Z" fill={SHAPE} />
        <path d="M122 160 Q152 154 148 126 Q146 118 134 124" fill="none" stroke={SHAPE} strokeWidth="5" strokeLinecap="round" />
        <path d="M84 160 H120" stroke={GOLD} strokeWidth="1.4" opacity="0.7" />
        <path d="M86 170 H118" stroke={GOLD} strokeWidth="1" opacity="0.5" />
      </g>
      <Palm x={330} y={196} h={78} dir={-1} />
      <Palm x={352} y={200} h={56} dir={1} scale={0.82} />

      {/* right: mosque with a dome and minarets */}
      <g>
        <rect x="868" y="176" width="130" height="44" fill={SHAPE} />
        <path d="M886 176 A44 44 0 0 1 974 176Z" fill={SHAPE} />
        <rect x="929" y="118" width="2.4" height="16" fill={GOLD} opacity="0.9" />
        <path d="M932 110 A7 7 0 1 0 932 124 A5.4 5.4 0 1 1 932 110Z" fill={GOLD} opacity="0.95" />
        <path d="M1006 220 V112 L1014 92 L1022 112 V220Z" fill={SHAPE} />
        <rect x="1003" y="140" width="22" height="4" fill={SHAPE} />
        <path d="M842 220 V138 L848 122 L854 138 V220Z" fill={SHAPE} />
        <rect x="839" y="160" width="18" height="3.5" fill={SHAPE} />
        {/* lit windows */}
        {[900, 925, 950].map((x) => (
          <path key={x} d={`M${x} 214 V196 A5 5 0 0 1 ${x + 10} 196 V214Z`} fill={GOLD} opacity="0.4" />
        ))}
      </g>
      <Palm x={1100} y={200} h={70} dir={1} />
      <Palm x={1124} y={204} h={50} dir={-1} scale={0.8} />

      <path d="M0 196 C200 176 380 202 560 190 S900 206 1200 186 V220 H0Z" fill={DUNE_NEAR} />
    </svg>
  );
}

// A fanous: the lantern that hangs through the evenings of Ramadan.
function Lantern({ className = "" }) {
  return (
    <svg aria-hidden viewBox="0 0 60 150" className={`pointer-events-none absolute ${className}`} fill="none">
      <defs>
        <radialGradient id="pd-fanous-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0b13a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f0b13a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="30" cy="84" r="34" fill="url(#pd-fanous-glow)" />
      <g stroke={GOLD} strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round">
        <path d="M30 0 V30" opacity="0.6" />
        <path d="M18 42 L30 28 L42 42Z" fill="rgba(240,177,58,0.25)" opacity="0.9" />
        <path d="M15 42 H45 L51 80 L45 108 H15 L9 80Z" fill="rgba(240,177,58,0.12)" opacity="0.85" />
        <path d="M30 42 V108 M22 44 Q19 76 22 106 M38 44 Q41 76 38 106" opacity="0.5" />
        <path d="M23 108 L30 126 L37 108" fill="rgba(240,177,58,0.25)" opacity="0.9" />
        <circle cx="30" cy="130" r="2.2" fill={GOLD} />
      </g>
    </svg>
  );
}

function Moon({ className = "" }) {
  return (
    <svg aria-hidden viewBox="0 0 80 60" className={`pointer-events-none absolute ${className}`}>
      <path d="M44 6 A24 24 0 1 0 44 52 A19 19 0 1 1 44 6Z" fill={GOLD} opacity="0.85" />
      <g fill={GOLD} opacity="0.7">
        <circle cx="64" cy="14" r="1.6" />
        <circle cx="72" cy="30" r="1.1" />
        <circle cx="58" cy="44" r="1.3" />
      </g>
    </svg>
  );
}

export default function CtaBand({ eyebrow, title, sub, cta, onClick }) {
  return (
    <Reveal className="relative overflow-hidden rounded-[2rem] bg-pd-forest text-pd-onforest px-6 pt-14 pb-24 sm:px-16 sm:pt-20 sm:pb-32 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(240,177,58,0.18),transparent)]"
      />
      <Moon className="right-[7%] top-6 h-10 w-14 sm:right-[9%] sm:top-9 sm:h-14 sm:w-20" />
      <Lantern className="left-[6%] top-0 h-28 w-11 sm:left-[9%] sm:h-36 sm:w-14" />
      <Landscape />

      <div className="relative mx-auto max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pd-gold">{eyebrow}</p>
        <p className="pd-serif mt-4 text-3xl sm:text-5xl font-medium leading-[1.1] tracking-tight text-balance">
          {title}
        </p>
        {sub && <p className="mt-4 text-base text-pd-onforest-muted text-balance">{sub}</p>}

        <button
          type="button"
          onClick={onClick}
          className="pd-glow group mt-9 h-14 px-6 sm:px-9 rounded-full bg-pd-gold text-pd-ongold font-bold text-base inline-flex items-center justify-center gap-2.5 whitespace-nowrap hover:bg-pd-gold-hover hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          {cta}
          <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </Reveal>
  );
}
