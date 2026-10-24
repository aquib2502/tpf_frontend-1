import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFetchRecentDonationsQuery } from '@/utils/slices/donationApiSlice';
import { useFetchImpactStatsQuery } from '@/utils/slices/campaignApiSlice';
import { getCampaignHref, timeAgoShort, formatTimestamp } from '@/utils/donationStream';

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** Counts toward `value` only when it changes; the first real value animates once from 0. */
function useCountUp(value, duration = 900) {
  const [shown, setShown] = useState(0);
  const shownRef = useRef(0);
  shownRef.current = shown;

  useEffect(() => {
    const from = shownRef.current;
    if (from === value) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(value);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(from + (value - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return shown;
}

function StreamEntry({ donation, isNew, dark }) {
  const href = getCampaignHref(donation);
  const Wrapper = href ? Link : 'div';
  const wrapperProps = href ? { href, prefetch: false } : {};

  return (
    <li
      className={`shrink-0 snap-start min-w-0 w-[min(10.5rem,calc((100vw-4rem)/2))] sm:w-44 md:w-auto md:basis-[calc((100%-4*0.75rem)/5)] ${isNew ? 'stream-enter' : ''}`}
    >
      <Wrapper
        {...wrapperProps}
        className={`group flex h-full flex-col rounded-lg border px-3 py-2.5 outline-none
          transition-colors duration-150 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2
          ${dark ? 'border-emerald-700/40 bg-emerald-900/30 focus-visible:ring-offset-zinc-800' : 'border-emerald-200 bg-emerald-50 focus-visible:ring-offset-white'}
          ${href ? (dark ? 'cursor-pointer hover:border-emerald-500/60' : 'cursor-pointer hover:border-emerald-400 hover:bg-emerald-100/70 active:bg-emerald-100/70') : ''}`}
      >
        <div className="flex min-w-0 items-baseline gap-1.5 md:max-lg:flex-wrap">
          <span className={`min-w-0 flex-1 truncate md:max-lg:basis-full text-xs font-semibold ${dark ? 'text-white' : 'text-emerald-950'}`}>{donation.name}</span>
          <time
            dateTime={safeIso(donation.time)}
            title={formatTimestamp(donation.time)}
            className={`shrink-0 text-[10px] md:max-lg:order-last md:max-lg:w-full ${dark ? 'text-emerald-200/70' : 'text-emerald-800/60'}`}
          >
            {timeAgoShort(donation.time)}
          </time>
        </div>

        <div
          className={`mt-1 text-[22px] font-bold leading-none tabular-nums tracking-tight ${dark ? 'text-emerald-400' : 'text-emerald-700'}`}
          style={{ fontFamily: 'var(--font-source-serif), Georgia, serif' }}
        >
          ₹{inr.format(donation.amount)}
        </div>

        <div
          title={donation.campaignName}
          className={`mt-1.5 text-[11.5px] leading-[1.3] line-clamp-2 ${dark ? 'text-emerald-50/85' : 'text-zinc-700'} ${href ? 'group-hover:underline underline-offset-2 decoration-emerald-600/40' : ''}`}
        >
          {donation.campaignName}
        </div>
      </Wrapper>
    </li>
  );
}

function safeIso(v) {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export default function LiveImpactStream({ darkMode }) {
  const { data: recentData, isLoading, isError } = useFetchRecentDonationsQuery();
  const { data: statsData } = useFetchImpactStatsQuery();

  const donations = recentData?.donations ?? [];
  const totalRaised = Number(statsData?.stats?.totalRaised) || 0;
  const hasStats = statsData?.stats?.totalRaised != null;
  const shownTotal = useCountUp(totalRaised);

  // Entries seen on first load don't animate; ones arriving via polling do.
  const seenIds = useRef(null);
  const newIds = new Set();
  if (donations.length) {
    if (seenIds.current === null) {
      seenIds.current = new Set(donations.map((d) => d.id));
    } else {
      donations.forEach((d) => {
        if (!seenIds.current.has(d.id)) newIds.add(d.id);
      });
    }
  }
  useEffect(() => {
    donations.forEach((d) => seenIds.current?.add(d.id));
  }, [donations]);

  const rail = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: true });
  const updateEdges = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    updateEdges();
    el.addEventListener('scroll', updateEdges, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      ro.disconnect();
    };
  }, [updateEdges, donations.length]);

  const page = (dir) => {
    const el = rail.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
  };

  const heading = darkMode ? 'text-white' : 'text-zinc-900';
  const body = darkMode ? 'text-zinc-400' : 'text-zinc-600';
    const fadeFrom = darkMode ? 'from-zinc-800' : 'from-[#f8fcf9]';
  const arrow = `hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 h-11 w-11 items-center justify-center rounded-full border text-lg
    transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600
    ${darkMode ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-700' : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm'}`;

  return (
    <section aria-labelledby="faith-in-motion" className={`relative overflow-hidden py-14 md:py-20 ${darkMode ? 'bg-zinc-800' : 'bg-[#f8fcf9]'}`}>
      {/* quiet backdrop: pale wash plus ripples radiating from the heading */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: darkMode
            ? 'radial-gradient(55% 60% at 15% 0%, rgba(20,184,166,0.10), transparent 70%), radial-gradient(50% 55% at 90% 10%, rgba(52,211,153,0.08), transparent 70%)'
            : 'radial-gradient(55% 60% at 12% 0%, rgba(45,212,191,0.16), transparent 70%), radial-gradient(50% 55% at 92% 8%, rgba(253,230,138,0.20), transparent 70%), linear-gradient(180deg, #f1faf5 0%, #f8fcf9 55%, #fcfefd 100%)',
        }}
      />
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-full w-full"
        viewBox="0 0 1200 640"
        preserveAspectRatio="xMidYMin slice"
        style={{
          WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 45%, transparent 95%)',
          maskImage: 'linear-gradient(180deg, #000 0%, #000 45%, transparent 95%)',
        }}
      >
        <g fill="none" stroke={darkMode ? '#6ee7b7' : '#059669'} strokeWidth="1">
          <circle cx="600" cy="150" r="110" strokeOpacity={darkMode ? 0.112 : 0.16} />
          <circle cx="600" cy="150" r="200" strokeOpacity={darkMode ? 0.098 : 0.14} />
          <circle cx="600" cy="150" r="290" strokeOpacity={darkMode ? 0.084 : 0.12} />
          <circle cx="600" cy="150" r="380" strokeOpacity={darkMode ? 0.070 : 0.1} />
          <circle cx="600" cy="150" r="470" strokeOpacity={darkMode ? 0.059 : 0.085} />
          <circle cx="600" cy="150" r="560" strokeOpacity={darkMode ? 0.049 : 0.07} />
          <circle cx="600" cy="150" r="650" strokeOpacity={darkMode ? 0.038 : 0.055} />
          <circle cx="600" cy="150" r="740" strokeOpacity={darkMode ? 0.028 : 0.04} />
        </g>
      </svg>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Layer 1 — live summary */}
        <header className="text-center">
          <p className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] ${body}`}>
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
            </span>
            Live
          </p>
          <h2 id="faith-in-motion" className={`mt-3 text-3xl md:text-5xl font-bold tracking-tight ${heading}`}>Faith in Motion</h2>
          <p className={`mt-2 text-sm md:text-base ${body}`}>Live generosity snapshot</p>

          <div className="mt-8 md:mt-10" aria-live="polite">
            <div
              className={`font-bold tabular-nums tracking-tight leading-none text-5xl md:text-7xl ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
              aria-label={hasStats ? `₹${inr.format(totalRaised)} raised` : undefined}
            >
              <span className="mr-1 align-baseline text-[0.62em] font-semibold opacity-80">₹</span>
              {inr.format(shownTotal)}
            </div>
            <div className={`mx-auto mt-4 h-px w-16 ${darkMode ? 'bg-zinc-600' : 'bg-zinc-300'}`} />
            <div className={`mt-3 text-sm ${body}`}>Total raised</div>
          </div>
        </header>

        {/* Layer 2 — recent donations stream */}
        <div className="relative mt-10 md:mt-14">
          {isLoading ? (
            <ul className="flex gap-3 overflow-hidden" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <li key={i} className={`h-[6.25rem] w-40 shrink-0 md:w-auto md:basis-[calc((100%-4*0.75rem)/5)] rounded-md motion-safe:animate-pulse ${darkMode ? 'bg-zinc-700/60' : 'bg-zinc-100'}`} />
              ))}
            </ul>
          ) : donations.length === 0 ? (
            <p className={`py-10 text-center text-sm ${body}`}>
              {isError ? "Live donations couldn't be loaded right now. Please check back shortly." : 'No recent donations yet'}
            </p>
          ) : (
            <>
              <button
                type="button"
                aria-label="Show newer donations"
                onClick={() => page(-1)}
                disabled={edge.start}
                className={`${arrow} -left-3 lg:-left-5 ${edge.start ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Show older donations"
                onClick={() => page(1)}
                disabled={edge.end}
                className={`${arrow} -right-3 lg:-right-5 ${edge.end ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                →
              </button>

              <div className="relative -mx-4 sm:-mx-6 md:mx-0">
                <div
                  aria-hidden
                  className={`hidden md:block pointer-events-none absolute inset-y-0 left-0 z-[1] w-6 bg-gradient-to-r to-transparent transition-opacity ${fadeFrom} ${edge.start ? 'opacity-0' : 'opacity-100'}`}
                />
                <ul
                  ref={rail}
                  tabIndex={-1}
                  aria-label="Recent donations"
                  className="flex flex-nowrap gap-3 overflow-x-auto overscroll-x-contain snap-x snap-proximity scroll-px-4 md:scroll-px-1 scrollbar-hide px-4 md:px-1 py-1"
                >
                  {donations.map((d) => (
                    <StreamEntry key={d.id} donation={d} isNew={newIds.has(d.id)} dark={darkMode} />
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
