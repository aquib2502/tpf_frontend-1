"use client";

export default function GlobalLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading TPF Aid"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#f8fcf9]"
      style={{
        backgroundImage:
          'radial-gradient(55% 50% at 15% 0%, rgba(45,212,191,0.16), transparent 70%), radial-gradient(50% 50% at 90% 5%, rgba(253,230,138,0.18), transparent 70%), linear-gradient(180deg, #f1faf5 0%, #fcfefd 100%)',
      }}
    >
      {/* ripples echoing the "Faith in Motion" backdrop */}
      <span aria-hidden className="tpf-loader-ring" />
      <span aria-hidden className="tpf-loader-ring" style={{ animationDelay: '1.4s' }} />

      <div className="relative flex flex-col items-center px-6">
        <img
          src="/TPFAid-Logo.png"
          alt="TPF Aid"
          width={220}
          height={76}
          className="tpf-loader-logo h-auto w-[170px] select-none sm:w-[220px]"
          draggable={false}
        />
        <p className="tpf-loader-tag mt-3 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-800/70 sm:text-xs">
          Supporting those in need
        </p>
        <div className="mt-7 h-[3px] w-28 overflow-hidden rounded-full bg-emerald-600/15 sm:w-36">
          <span className="tpf-loader-bar block h-full w-1/2 rounded-full bg-emerald-600" />
        </div>
      </div>
    </div>
  );
}
