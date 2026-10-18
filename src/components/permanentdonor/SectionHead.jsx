"use client";

import Reveal from "./Reveal";

export default function SectionHead({ eyebrow, title, sub }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pd-clay">{eyebrow}</p>
      <h2 className="pd-serif mt-4 text-3xl sm:text-5xl font-medium leading-[1.1] tracking-tight text-balance">
        {title}
      </h2>
      {sub && <p className="mt-4 text-base sm:text-lg text-pd-muted text-balance">{sub}</p>}
    </Reveal>
  );
}
