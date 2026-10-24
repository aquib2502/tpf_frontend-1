"use client";

export default function GlobalLoader({ leaving = false }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading TPF Aid"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#f0f9f3] ${leaving ? "tpf-loader-out" : ""}`}
      style={{
        backgroundImage:
          'radial-gradient(55% 50% at 15% 0%, rgba(20,184,166,0.30), transparent 70%), radial-gradient(50% 50% at 90% 5%, rgba(251,191,36,0.26), transparent 70%), linear-gradient(180deg, #e3f4ea 0%, #f6fbf8 100%)',
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
        <div className="mt-7 h-1 w-48 overflow-hidden rounded-full bg-emerald-600/15 sm:w-64">
          <span className="tpf-loader-bar block h-full w-full rounded-full bg-emerald-600" />
        </div>
      </div>
    </div>
  );
}
