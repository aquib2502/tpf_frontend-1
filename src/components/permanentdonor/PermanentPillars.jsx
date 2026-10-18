"use client";

import {
  ArrowRight,
  Bus,
  Wallet,
  ClipboardCheck,
  Megaphone,
  Target,
  CreditCard,
  Landmark,
  BadgeCheck,
} from "lucide-react";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

// Everything that has to be paid for before one campaign can be completed.
const NEEDS = [
  { Icon: Bus, title: "Travelling costs", line: "Verifiers reach every family's door" },
  { Icon: Wallet, title: "Reimbursements", line: "Volunteers never pay out of pocket" },
  { Icon: ClipboardCheck, title: "Case verification", line: "Home, hospital and ID checked" },
  { Icon: Megaphone, title: "Influencers", line: "Voices that carry each case to donors" },
  { Icon: Target, title: "Running ads", line: "Paid reach to find new donors" },
  { Icon: CreditCard, title: "Payments & servers", line: "Secure checkout, no downtime" },
  { Icon: Landmark, title: "Audits & legal", line: "12A and Darpan kept active" },
  { Icon: BadgeCheck, title: "Volunteer ID & kits", line: "Verified badges, safety gear" },
];

export default function PermanentPillars({ onDonateClick }) {
  return (
    <section id="breakdown" className="scroll-mt-24">
      <SectionHead
        eyebrow="Behind every campaign"
        title="What it takes to complete one campaign"
        sub="None of it is taken from public donations."
      />

      <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4">
        {NEEDS.map(({ Icon, title, line }, i) => (
          <Reveal as="li" key={title} delay={(i % 4) * 0.06}>
            <div className="group h-full rounded-2xl border border-pd-line bg-pd-surface p-5 transition-all hover:-translate-y-1 hover:shadow-[0_18px_34px_-20px_rgba(20,36,28,0.4)]">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-pd-tint text-pd-edge transition-colors group-hover:bg-pd-gold group-hover:text-pd-ongold">
                <Icon aria-hidden className="h-6 w-6" strokeWidth={1.6} />
              </span>
              <p className="mt-4 text-base font-semibold leading-snug">{title}</p>
              <p className="mt-1 text-[13px] leading-snug text-pd-muted">{line}</p>
            </div>
          </Reveal>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onDonateClick?.(1000)}
        className="mx-auto mt-10 flex items-center gap-2 text-sm font-semibold underline decoration-pd-gold decoration-2 underline-offset-[6px] hover:gap-3 transition-all cursor-pointer"
      >
        Help pay for all of it
        <ArrowRight size={16} aria-hidden />
      </button>
    </section>
  );
}
