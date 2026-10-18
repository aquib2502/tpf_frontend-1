"use client";

import { ArrowRight, CreditCard, BadgeCheck, FileText } from "lucide-react";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const STEPS = [
  { Icon: CreditCard, title: "Pay ₹1,000 or more, once", sub: "No auto-debit. No monthly mandate." },
  { Icon: BadgeCheck, title: "Get your 80G receipt", sub: "In your inbox instantly. Badge appears on your profile." },
  { Icon: FileText, title: "See the audit at year-end", sub: "Renew only if you want to." },
];

export default function PermanentWorkflow({ onDonateClick }) {
  return (
    <section>
      <SectionHead eyebrow="How it works" title="Three steps. One payment." />

      <ol className="mx-auto mt-12 grid max-w-4xl grid-cols-1 md:grid-cols-3 gap-4">
        {STEPS.map(({ Icon, title, sub }, i) => (
          <Reveal as="li" key={title} delay={i * 0.08} className="relative flex md:flex-col gap-4 rounded-2xl border border-pd-line bg-pd-surface p-5 sm:p-6">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-pd-tint text-pd-edge">
              <Icon aria-hidden className="h-6 w-6" strokeWidth={1.7} />
            </span>
            <div>
              <p className="pd-serif text-lg font-semibold leading-snug">{title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-pd-muted">{sub}</p>
            </div>
            <span
              aria-hidden
              className="pd-serif absolute right-4 top-3 text-5xl font-semibold leading-none text-transparent [-webkit-text-stroke:1.5px_var(--pd-gold)] select-none"
            >
              {i + 1}
            </span>
          </Reveal>
        ))}
      </ol>

      <button
        type="button"
        onClick={() => onDonateClick?.(1000)}
        className="mx-auto mt-8 flex items-center gap-2 text-sm font-semibold underline decoration-pd-gold decoration-2 underline-offset-[6px] hover:gap-3 transition-all cursor-pointer"
      >
        Start with ₹1,000
        <ArrowRight size={16} aria-hidden />
      </button>
    </section>
  );
}
