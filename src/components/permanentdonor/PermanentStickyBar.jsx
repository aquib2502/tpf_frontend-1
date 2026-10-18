"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

// Slim, quiet pill. Shown only once the visitor has scrolled past the hero and
// no donate banner is already on screen. Leaves room for the voice assistant on phones.
export default function PermanentStickyBar({ isVisible, onDonateClick }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="pointer-events-none fixed inset-x-0 z-40 flex justify-center pl-3 pr-[5.25rem] sm:px-6 bottom-[max(0.75rem,env(safe-area-inset-bottom))] sm:bottom-5"
        >
          <div className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-pd-gold/30 bg-pd-forest py-1.5 pl-4 pr-1.5 text-pd-onforest shadow-[0_10px_28px_-12px_rgba(0,0,0,0.5)] backdrop-blur">
            <span className="text-[13px] font-medium whitespace-nowrap opacity-80">
              From ₹1,000 / year
            </span>
            <button
              type="button"
              onClick={onDonateClick}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-pd-gold px-4 text-sm font-semibold text-pd-ongold transition-colors hover:bg-pd-gold-hover active:scale-[0.98] cursor-pointer"
            >
              <Heart aria-hidden className="h-3.5 w-3.5" fill="currentColor" />
              Donate
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
