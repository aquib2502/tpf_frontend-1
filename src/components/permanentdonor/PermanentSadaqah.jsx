"use client";

import {
  HeartHandshake,
  BookOpen,
  Users,
  Wallet,
  UserCheck,
  Home,
  Infinity as InfinityIcon,
  BadgeCheck,
  FileText,
  Sparkles,
} from "lucide-react";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const THREE_DEEDS = [
  { Icon: HeartHandshake, label: "Ongoing charity", mine: true },
  { Icon: BookOpen, label: "Knowledge that helps", mine: false },
  { Icon: Users, label: "A child who prays for you", mine: false },
];

const FLOW = [
  { Icon: Wallet, title: "You pledge once" },
  { Icon: UserCheck, title: "A verifier visits the family" },
  { Icon: Users, title: "Public donors fund the case" },
  { Icon: Home, title: "The family receives aid" },
  { Icon: Sparkles, title: "It joins your reward, inshallah", gold: true },
];

const BENEFITS = [
  { Icon: InfinityIcon, title: "Reward that keeps running", line: "Every case TPF helps adds to it, inshallah." },
  { Icon: Home, title: "A share in every family helped", line: "ICU bills, rations, rebuilt homes." },
  { Icon: BadgeCheck, title: "Permanent Donor badge", line: "On your profile the moment you pay." },
  { Icon: FileText, title: "Yearly audit shared", line: "See exactly how it was used." },
];

export default function PermanentSadaqah({ onDonateClick }) {
  return (
    <section id="sadaqah-jariyah" className="scroll-mt-24">
      <SectionHead eyebrow="Sadaqah Jariyah" title="A gift that keeps giving, even after you" />

      {/* Hadith */}
      <Reveal className="mx-auto mt-12 max-w-3xl rounded-3xl bg-pd-tint p-7 sm:p-10">
        <div className="grid grid-cols-3 gap-3 sm:gap-8">
          {THREE_DEEDS.map(({ Icon, label, mine }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <span
                className={`grid h-16 w-16 sm:h-20 sm:w-20 place-items-center rounded-full ${
                  mine
                    ? "bg-pd-gold text-pd-ongold pd-glow"
                    : "bg-pd-surface text-pd-muted border border-pd-line"
                }`}
              >
                <Icon aria-hidden className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={1.5} />
              </span>
              <p className={`mt-3 text-sm sm:text-[15px] font-semibold leading-snug ${mine ? "" : "text-pd-muted"}`}>
                {label}
              </p>
              {mine && (
                <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-pd-clay">
                  This is you
                </p>
              )}
            </div>
          ))}
        </div>

        <blockquote className="mt-8 border-t border-pd-ink/10 pt-6 text-center">
          <p className="pd-serif text-lg sm:text-xl italic leading-snug text-pd-ink/90 text-balance">
            “When a person dies, their deeds end, except three: ongoing charity, knowledge that
            benefits, and a righteous child who prays for them.”
          </p>
          <footer className="mt-3 text-xs font-medium text-pd-muted">
            Prophet Muhammad ﷺ · Sahih Muslim 1631
          </footer>
        </blockquote>
      </Reveal>

      {/* Flow */}
      <Reveal className="mx-auto mt-16 max-w-4xl">
        <ol className="relative grid grid-cols-1 md:grid-cols-5 gap-7 md:gap-3 before:absolute before:left-7 before:top-7 before:bottom-7 before:border-l-2 before:border-dashed before:border-pd-line md:before:left-[10%] md:before:right-[10%] md:before:bottom-auto md:before:border-l-0 md:before:border-t-2">
          {FLOW.map(({ Icon, title, gold }, i) => (
            <li key={title} className="relative flex md:flex-col items-center gap-4 md:gap-3 md:text-center">
              <span
                className={`relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border ${
                  gold
                    ? "bg-pd-gold text-pd-ongold border-pd-gold"
                    : "bg-pd-surface text-pd-ink border-pd-line shadow-sm"
                }`}
              >
                <Icon aria-hidden className="h-6 w-6" strokeWidth={1.6} />
                <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-pd-ink text-pd-paper text-[10px] font-bold tabular-nums">
                  {i + 1}
                </span>
              </span>
              <p className="text-[15px] font-semibold leading-snug md:max-w-[9.5rem]">{title}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* Benefits */}
      <ul className="mx-auto mt-16 grid max-w-4xl grid-cols-1 sm:grid-cols-2 gap-4">
        {BENEFITS.map(({ Icon, title, line }, i) => (
          <Reveal as="li" key={title} delay={i * 0.06}>
            <div className="flex h-full items-center gap-4 rounded-2xl border border-pd-line bg-pd-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(20,36,28,0.35)]">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-pd-tint text-pd-edge">
                <Icon aria-hidden className="h-6 w-6" strokeWidth={1.6} />
              </span>
              <div>
                <p className="text-base font-semibold leading-snug">{title}</p>
                <p className="mt-0.5 text-[13px] text-pd-muted">{line}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>

      <p className="mt-10 text-center text-[13px] text-pd-muted">
        Reward rests with Allah alone. We make dua that He accepts it.
      </p>
    </section>
  );
}
