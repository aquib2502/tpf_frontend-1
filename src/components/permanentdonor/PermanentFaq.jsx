"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

const FAQS = [
  {
    q: "Why a separate Permanent Donor fund?",
    a: "So nothing is cut from public donations. Pledges pay for verifiers, travel, servers and audits. Campaign money goes 100% to the family.",
  },
  {
    q: "How much, and for how long?",
    a: "₹1,000 or more, once per financial year (April 1 to March 31).",
  },
  {
    q: "Will my account be debited automatically?",
    a: "No. It is one payment. We invite you to renew next year, only if you wish.",
  },
  {
    q: "Is it tax-exempt under 80G?",
    a: "Yes. Your 80G receipt is emailed as soon as the payment completes.",
  },
];

export default function PermanentFaq() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section>
      <SectionHead eyebrow="Questions" title="Quick answers" />

      <Reveal className="mx-auto mt-12 max-w-3xl border-t border-pd-line">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={faq.q} className="border-b border-pd-line">
              <h3>
                <button
                  type="button"
                  id={`faq-btn-${idx}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${idx}`}
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-6 py-5 sm:py-6 text-left cursor-pointer group"
                >
                  <span className="pd-serif text-lg sm:text-xl font-medium leading-snug">
                    {faq.q}
                  </span>
                  <span
                    aria-hidden
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-pd-line"
                  >
                    {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-panel-${idx}`}
                    role="region"
                    aria-labelledby={`faq-btn-${idx}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pr-10 max-w-2xl text-[15px] leading-relaxed text-pd-muted">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </Reveal>

    </section>
  );
}
