"use client";

import { motion, useReducedMotion } from "framer-motion";

// A quiet horizon that runs from the Nile to the Gulf: pyramids, an obelisk and a felucca
// on the left; a mosque, a tower and a dhow on the right. Flat silhouettes in the page's
// greens, with gold kept for the sun and crescent only.

const FAR = "var(--pd-sky-far)";
const NEAR = "var(--pd-sky-near)";
const DEEP = "var(--pd-sky-deep)";
const GOLD = "var(--pd-gold)";

function Palm({ x, y, h, dir = 1, scale = 1 }) {
  const topX = dir * 2;
  const fronds = [
    [-165, 40],
    [-135, 46],
    [-105, 36],
    [-75, 36],
    [-45, 46],
    [-15, 40],
  ].map(([deg, len]) => {
    const r = (deg * Math.PI) / 180;
    const tx = +(Math.cos(r) * len * scale).toFixed(1);
    const ty = +(Math.sin(r) * len * scale + 15 * scale).toFixed(1);
    const cx = +(Math.cos(r) * len * 0.55 * scale).toFixed(1);
    const cy = +(Math.sin(r) * len * 0.55 * scale - 12 * scale).toFixed(1);
    return `M0 0 Q${cx} ${cy} ${tx} ${ty}`;
  });
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={NEAR} strokeLinecap="round">
      <path d={`M0 0 Q${dir * 4} ${-h * 0.5} ${topX} ${-h}`} strokeWidth={3 * scale} />
      <g transform={`translate(${topX} ${-h})`} strokeWidth={3.2 * scale}>
        {fronds.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </g>
  );
}

// small repeating wave for the Nile and the Gulf waters
const wave = (x0, x1, y, amp = 3, step = 24) => {
  let d = `M${x0} ${y}`;
  for (let x = x0; x < x1; x += step) d += ` q${step / 4} ${-amp} ${step / 2} 0 t${step / 2} 0`;
  return `${d} V220 H${x0}Z`;
};

export default function HeroSkyline() {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 1200 220"
      preserveAspectRatio="xMidYMax meet"
      className="pointer-events-none absolute bottom-0 left-1/2 w-full max-w-[1700px] -translate-x-1/2"
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* sun, rising between the pyramids */}
      <circle cx="338" cy="128" r="24" fill={GOLD} opacity="0.85" />

      {/* far layer: dunes and distant shapes */}
      <g fill={FAR}>
        <path d="M0 196 C120 174 230 190 350 180 S570 200 720 190 S990 172 1200 188 V220 H0Z" />
        <polygon points="150,190 218,134 286,190" />
        <rect x="1010" y="150" width="20" height="60" />
        <rect x="1036" y="166" width="16" height="44" />
        <rect x="690" y="168" width="14" height="40" />
      </g>

      {/* Egypt: pyramids, obelisk, palms */}
      <g fill={NEAR}>
        <polygon points="0,220 58,152 116,220" />
        <polygon points="70,220 215,72 360,220" />
        <polygon points="292,220 388,130 484,220" />
        <polygon points="498,220 502,100 508,86 514,100 518,220" />
        <rect x="492" y="208" width="32" height="12" />
      </g>
      <g fill={DEEP}>
        <polygon points="215,72 360,220 262,220" />
        <polygon points="388,130 484,220 428,220" />
        <polygon points="58,152 116,220 84,220" />
      </g>
      <Palm x={452} y={218} h={72} dir={-1} />
      <Palm x={470} y={218} h={56} dir={1} scale={0.85} />

      {/* the Nile with a felucca */}
      <path d={wave(0, 600, 210, 3)} fill={FAR} />
      <g transform="translate(318 0)">
        <path d="M232 208 H284 L276 216 H240Z" fill={DEEP} />
        <path d="M258 206 V158 L302 206Z" fill={NEAR} opacity="0.85" />
        <line x1="258" y1="206" x2="258" y2="156" stroke={DEEP} strokeWidth="2" />
      </g>

      {/* the Gulf: mosque, tower, towers, dhow, palm */}
      <g fill={NEAR}>
        {/* mosque */}
        <rect x="766" y="188" width="84" height="32" />
        <path d="M772 188 A36 36 0 0 1 844 188Z" />
        <rect x="806" y="140" width="3" height="12" />
        <path d="M740 220 V122 L747 106 L754 122 V220Z" />
        <rect x="738" y="146" width="18" height="4" />
        <path d="M862 220 V132 L869 116 L876 132 V220Z" />
        <rect x="860" y="156" width="18" height="4" />
        {/* tall spire tower */}
        <polygon points="924,220 928,128 932,98 936,40 940,98 944,128 948,220" />
        <rect x="908" y="166" width="16" height="54" />
        <rect x="948" y="180" width="14" height="40" />
        {/* slanted-top tower and neighbour */}
        <polygon points="980,220 980,118 1006,102 1006,220" />
        <rect x="1010" y="150" width="20" height="70" />
        <rect x="1034" y="170" width="16" height="50" />
      </g>
      <g fill={DEEP}>
        <polygon points="936,40 940,98 944,128 948,220 936,220" />
        <polygon points="993,110 1006,102 1006,220 993,220" />
      </g>
      {/* mosque crescent, in gold */}
      <g transform="translate(807 132)" fill={GOLD}>
        <path d="M2.5 -7 A7 7 0 1 0 2.5 7 A5.4 5.4 0 1 1 2.5 -7Z" />
      </g>

      {/* the sea with a dhow */}
      <path d={wave(700, 1200, 210, 3)} fill={FAR} />
      <g transform="translate(-24 0)">
        <path d="M1066 200 H1170 Q1176 192 1188 184 L1182 204 Q1126 220 1076 210Z" fill={DEEP} />
        <line x1="1100" y1="200" x2="1100" y2="140" stroke={DEEP} strokeWidth="2" />
        <line x1="1140" y1="200" x2="1140" y2="152" stroke={DEEP} strokeWidth="2" />
        <path d="M1102 142 V196 H1150Z" fill={NEAR} opacity="0.85" />
        <path d="M1142 154 V196 H1182Z" fill={NEAR} opacity="0.85" />
      </g>
      <Palm x={1176} y={218} h={64} dir={1} scale={0.9} />
      <Palm x={706} y={218} h={52} dir={-1} scale={0.8} />
    </motion.svg>
  );
}
