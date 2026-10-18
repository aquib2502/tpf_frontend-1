"use client";

import { motion, useReducedMotion } from "framer-motion";

// Gentle fade-up when a block scrolls into view. Skipped for reduced-motion users.
export default function Reveal({ children, delay = 0, y = 18, as = "div", className = "" }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] ?? motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
