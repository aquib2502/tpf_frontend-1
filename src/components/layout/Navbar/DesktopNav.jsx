'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Moon, Sun, Building2, TrendingUp, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getMediaUrl } from '@/utils/media';

export default function DesktopNav({
  darkMode,
  setDarkMode,
  userInfo,
  isAuthReady,       // ✅ NEW — true once we know auth state (from localStorage or API)
  isOrganization,
  initials,
  searchQuery,
  setSearchQuery,
  showDropdown,
  setShowDropdown,
  filteredCampaigns,
  handleSearchCommit,
  checkNavigation,
  onMenuOpen,
}) {
  const router = useRouter();

  return (
    <>
      {/* CENTER – Search */}
      <div className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl xl:max-w-3xl md:mx-4 lg:mx-6 xl:mx-8 search-container">
        <div className="relative w-full group">
          {/* Glow */}
          <div className={`absolute inset-0 rounded-full opacity-0 group-focus-within:opacity-100 transition-all duration-500 blur-xl -z-10
            ${darkMode
              ? 'bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30'
              : 'bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20'
            }`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleSearchCommit}
            placeholder="Find causes that matter"
            className={`w-full px-4 py-2 pl-11 pr-4 rounded-full border transition-all duration-300
              ${darkMode
                ? 'bg-zinc-800/90 text-white placeholder-zinc-400 border-zinc-700/50 focus:bg-zinc-900/95 focus:border-emerald-500/60 focus:shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                : 'bg-white/90 text-zinc-900 placeholder-zinc-500 border-zinc-300/50 focus:bg-white focus:border-emerald-500/60 focus:shadow-[0_0_20px_rgba(16,185,129,0.12)]'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500/30 hover:border-emerald-400/40 text-sm`}
          />
          <svg
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors group-focus-within:text-emerald-500
              ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          {showDropdown && searchQuery && (
            <div className={`absolute top-full left-0 right-0 mt-2.5 rounded-2xl overflow-hidden shadow-2xl border z-[60]
              ${darkMode ? 'bg-zinc-900/95 border-zinc-800 backdrop-blur-xl' : 'bg-white/95 border-zinc-100 backdrop-blur-xl'}`}>
              <div className="p-2">
                {filteredCampaigns.length > 0 ? (
                  <>
                    <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      Suggested Causes
                    </div>
                    {filteredCampaigns.map((campaign) => (
                      <div
                        key={campaign._id}
                        onClick={() => {
                          router.push(`/campaign/${campaign.slug}`);
                          setShowDropdown(false);
                          setSearchQuery('');
                        }}
                        className={`group flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors
                          ${darkMode ? 'hover:bg-zinc-800/80' : 'hover:bg-emerald-50/50'}`}
                      >
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={campaign.imageUrl ? getMediaUrl(campaign.imageUrl) : '/placeholder-campaign.jpg'}
                            alt={campaign.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-semibold truncate group-hover:text-emerald-500 transition-colors
                            ${darkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>{campaign.title}</h4>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className={`flex items-center gap-1 text-[11px] ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                              <Building2 className="w-3 h-3" />{campaign.organization}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-500">
                              <TrendingUp className="w-3 h-3" />
                              {campaign.targetAmount > 0 ? Math.round((campaign.raisedAmount / campaign.targetAmount) * 100) : 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-6 text-center">
                    <p className={`text-sm font-medium ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      No causes found for "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT – Actions */}
      <div className="flex items-center gap-2">
        {/* Start Fundraising - desktop only, hide while auth is resolving */}
        {isAuthReady && !isOrganization && (
          <button
            className="hidden md:flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
            onClick={() => router.push('/financial-aid')}
          >
            Start fundraising
          </button>
        )}

        {/* Permanent Donor — emotional call to action, visible to everyone */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => router.push('/permanent-donor')}
            title="Become a Permanent Donor"
            aria-label="Be the Lifeline. Become a Permanent Donor"
            className="lifeline-btn group h-9 inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 lg:px-4 bg-gradient-to-br from-white via-[#fff0f3] to-[#ffd3de] text-[#064e3b] font-semibold text-sm border border-[#f4a9bb] shadow-md shadow-rose-400/25 hover:brightness-[1.03] hover:-translate-y-px active:translate-y-0 transition-all cursor-pointer whitespace-nowrap"
          >
            <Heart className="w-4 h-4 text-[#e11d48] transition-transform group-hover:scale-110" fill="currentColor" />
            <span className="hidden lg:inline">Be the Lifeline</span>
          </button>

          {/* twinkling stars around the button */}
          {[
            { cls: '-top-1.5 right-3', size: 10, delay: '0s' },
            { cls: '-bottom-1 left-4', size: 8, delay: '0.9s' },
            { cls: 'top-0.5 -left-1.5', size: 7, delay: '1.6s' },
          ].map((s) => (
            <svg
              key={s.cls}
              aria-hidden
              viewBox="0 0 24 24"
              width={s.size}
              height={s.size}
              className={`lifeline-spark ${s.cls} text-rose-300 drop-shadow-[0_0_3px_rgba(251,113,133,0.95)]`}
              style={{ animationDelay: s.delay }}
              fill="currentColor"
            >
              <path d="M12 0 14.5 9.5 24 12 14.5 14.5 12 24 9.5 14.5 0 12 9.5 9.5Z" />
            </svg>
          ))}
        </div>

        {/* Icon Buttons - equal size 36x36 */}
        {/* Zakat Calculator — previously shown to everyone, kept here for reference:
        <button
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer flex-shrink-0
            ${darkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white/80 hover:bg-zinc-100'}`}
          onClick={() => router.push('/zakat-calculator')}
          title="Zakat Calculator"
        >
          <Image src="/TPFAid-Icon-Zakat-1.svg" alt="Zakat" width={20} height={20} />
        </button>
        */}
        {/* Zakat Calculator — opens for logged-in users, guests are asked to log in first */}
        <button
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer flex-shrink-0
            ${darkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white/80 hover:bg-zinc-100'}`}
          onClick={() => router.push(isAuthReady && !userInfo ? '/login' : '/zakat-calculator')}
          title={isAuthReady && !userInfo ? 'Log in to use the Zakat Calculator' : 'Zakat Calculator'}
        >
          <Image src="/TPFAid-Icon-Zakat-1.svg" alt="Zakat" width={20} height={20} />
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer flex-shrink-0
            ${darkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white/80 hover:bg-zinc-100'}`}
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode
            ? <Sun className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            : <Moon className="w-4.5 h-4.5 text-zinc-900" style={{ width: 18, height: 18 }} />}
        </button>

        {/* Avatar / Hamburger / Skeleton */}
        {!isAuthReady ? (
          // ── Still resolving auth → pulse skeleton, no flash ──
          <div
            className={`w-9 h-9 rounded-full flex-shrink-0 animate-pulse
              ${darkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`}
          />
        ) : (
          // ── Auth resolved → show real button ──
          <button
            onClick={onMenuOpen}
            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors font-bold text-sm
              ${userInfo
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md'
                : darkMode
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  : 'bg-white hover:bg-zinc-100 text-zinc-900'}`}
          >
            {userInfo && initials
              ? initials
              : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
          </button>
        )}
      </div>
    </>
  );
}