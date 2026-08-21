'use client';

const LOGOS = [
  {
    name: 'Cashfree Payments',
    src: '/logoFolder/cashfreeLogo.webp',
    extraClass: '',
  },
  {
    name: 'NITI Aayog NGO Darpan',
    src: '/logoFolder/darpan.webp',
    extraClass: '',
  },
  {
    name: 'IDFC FIRST Bank',
    src: '/logoFolder/idfcFirst.webp',
    extraClass: '',
  },
  {
    name: 'Income Tax Department (80G)',
    src: '/logoFolder/incomeTax.webp',
    extraClass: '',
  },
  {
    name: 'Ministry of Corporate Affairs',
    src: '/logoFolder/ministryOfAffairs.webp',
    // Scale up and shift down to align dead-center horizontally with other logos
    extraClass: 'scale-[1.4] sm:scale-[1.5] md:scale-[1.55] origin-center translate-y-2 sm:translate-y-2.5',
  },
];

export default function TrustedLogosSection({ darkMode }) {
  // Quadruple items for infinite seamless horizontal marquee
  const marqueeItems = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <section className={`py-8 sm:py-10 border-y overflow-hidden relative ${
      darkMode ? 'bg-zinc-950/90 border-zinc-800/80' : 'bg-white border-gray-100'
    }`}>
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className={`h-[1px] w-12 sm:w-28 ${
            darkMode ? 'bg-gradient-to-r from-transparent to-emerald-500/40' : 'bg-gradient-to-r from-transparent to-emerald-500/30'
          }`} />
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Trusted & Recognized By
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </span>
          <div className={`h-[1px] w-12 sm:w-28 ${
            darkMode ? 'bg-gradient-to-l from-transparent to-emerald-500/40' : 'bg-gradient-to-l from-transparent to-emerald-500/30'
          }`} />
        </div>
      </div>

      {/* Edge Gradient Masks */}
      <div className={`absolute top-0 bottom-0 left-0 w-16 sm:w-32 z-10 pointer-events-none bg-gradient-to-r ${
        darkMode ? 'from-zinc-950 to-transparent' : 'from-white to-transparent'
      }`} />
      <div className={`absolute top-0 bottom-0 right-0 w-16 sm:w-32 z-10 pointer-events-none bg-gradient-to-l ${
        darkMode ? 'from-zinc-950 to-transparent' : 'from-white to-transparent'
      }`} />

      {/* Marquee Container */}
      <div className="flex overflow-hidden select-none py-2">
        <div className="animate-marquee-smooth flex items-center gap-8 sm:gap-14 md:gap-20">
          {marqueeItems.map((logo, idx) => (
            <div
              key={`${logo.name}-${idx}`}
              className="flex-shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-105 px-2"
              title={logo.name}
            >
              <img
                src={logo.src}
                alt={logo.name}
                className={`h-14 sm:h-18 md:h-20 w-auto max-w-[180px] sm:max-w-[240px] md:max-w-[280px] object-contain transition-all duration-300 ${logo.extraClass} ${
                  darkMode
                    ? 'filter brightness-110 contrast-125'
                    : 'mix-blend-multiply opacity-95 hover:opacity-100'
                }`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
