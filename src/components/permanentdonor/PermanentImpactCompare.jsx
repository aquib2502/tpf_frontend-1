"use client";

import { Timer, HandCoins, Bus } from "lucide-react";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const POINTS = [
  { Icon: Timer, text: "Cases verified in 24–48 hours" },
  { Icon: HandCoins, text: "100% of every donation reaches the family" },
  { Icon: Bus, text: "Volunteer travel is paid for" },
];

export default function PermanentImpactCompare() {
  return (
    <section>
      <SectionHead eyebrow="Why a pledge matters" title="Your pledge covers the running costs" />

      <Reveal className="mx-auto mt-12 max-w-3xl rounded-3xl border border-pd-forest-soft/20 bg-pd-tint p-8 sm:p-12 text-center">
        <p className="pd-serif text-7xl sm:text-8xl font-medium leading-none tracking-tight text-pd-edge tabular-nums">
          0%
        </p>
        <p className="mt-3 text-base text-pd-muted">taken from public donations</p>

        <ul className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left sm:text-center">
          {POINTS.map(({ Icon, text }) => (
            <li key={text} className="flex sm:flex-col items-center gap-4 sm:gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-pd-surface text-pd-edge shadow-sm">
                <Icon aria-hidden className="h-6 w-6" strokeWidth={1.6} />
              </span>
              <p className="text-[15px] font-medium leading-snug">{text}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
