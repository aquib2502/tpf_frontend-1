'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import HijriDate from "hijri-date";
import { hijriMonths } from '@/lib/constants';
import Link from 'next/link';
import { useAppToast } from '@/app/AppToastContext';

import { useGetHijriCalendarQuery } from '@/utils/slices/apiSlice';
import { Heart } from 'lucide-react';
export default function Footer({ darkMode }) {
  const { showToast } = useAppToast();
  const today = new Date();
  const { data: calendar } = useGetHijriCalendarQuery({
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  });

  let hijriFromApi = null;

  if (calendar) {
    const todayData = calendar.find(
      (d) => Number(d.gregorian.day) === today.getDate()
    );

    if (todayData) {
      const { hijri, gregorian } = todayData;

      const monthName = hijri.month.en;

      const gregDate = new Date(
        gregorian.year,
        gregorian.month.number - 1,
        gregorian.day
      );

      const day = gregDate.getDate();
      const month = gregDate.toLocaleString("en-GB", { month: "long" });
      const year = gregDate.getFullYear();

      const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
      };

      const formattedGreg = `${day}${getOrdinal(day)} ${month} ${year}`;

      const adjustedDay = Math.max(1, Number(hijri.day) - 1);

      hijriFromApi = `${monthName} ${adjustedDay}, ${hijri.year} (${gregorian.weekday.en}, ${formattedGreg})`;
    }
  }

  const handleComingSoon = (feature) => {
    if (showToast) {
      showToast({
        type: "info",
        title: "Coming Soon",
        message: `${feature} will be available soon!`,
        duration: 2000,
      });
    }
  };

  return (
    <footer className={`py-12 border-t z-30 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-neutral-100 border-zinc-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Logo and Tagline */}
          {/* Logo and Tagline */}
          <div className="md:col-span-1">
            <img
              src={darkMode ? "/TPFAid-Logo1.png" : "/TPFAid-Logo.png"}
              alt="TPF Aid Logo"
              width={160}
              height={45}
              className="h-9 w-auto cursor-pointer mb-4 object-contain"
            />
            <p className={`text-sm font-semibold ${darkMode ? 'text-zinc-400' : 'text-gray-600'} leading-relaxed mb-3`}>
              Making a difference through community-funded projects and transparent impact.
            </p>

            {/* Expense CTA */}
            <div className={`rounded-xl p-3 border ${darkMode
                ? 'bg-zinc-800/60 border-zinc-700'
                : 'bg-rose-50 border-rose-100'
              }`}>
              <p className={`text-xs leading-relaxed mb-2.5 ${darkMode ? 'text-zinc-400' : 'text-gray-600'
                }`}>
                Every campaign & every family we support involves real costs —{' '}
                <span className={`font-bold ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
                  salaries, transport, tools, & essential services.
                </span>{' '} 
              Help us keep going.
              </p>
              <Link
                href="/expenses"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 ${darkMode
                    ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30'
                    : 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm shadow-rose-500/20'
                  }`}
              >
                <Heart className="w-3 h-3" fill="currentColor" />
                Donate for our survival
              </Link>
            </div>
          </div>

          {/* 1️⃣ Ways To Jannah (moved up) */}
          <div>
            <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
              Ways To Jannah
            </div>

            <ul className="space-y-1.5 text-sm">
              {[
                { name: 'Daily Giver', path: '/permanent-donor/daily', comingSoon: true },
                { name: 'Donate Weekly (Friday)', path: '/permanent-donor/weekly', comingSoon: true },
                { name: 'Donate Monthly', path: '/permanent-donor/monthly', comingSoon: true },
                { name: 'Donate Your Zakat', path: '/zakat-calculator' },
                { name: 'Discover Fundraiser', path: '/all-campaigns' },
                { name: 'Donate in Emergency Funds', path: '/', comingSoon: true }
              ].map((item, idx) => (
                <li key={idx}>
                  {item.comingSoon ? (
                    <button
                      onClick={() => handleComingSoon(item.name)}
                      className={`${darkMode ? 'text-zinc-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                        } transition-colors text-left bg-transparent border-none p-0 cursor-pointer`}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      href={item.path || '#'}
                      className={`${darkMode ? 'text-zinc-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                        } transition-colors`}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>


          {/* 2️⃣ About Us (moved to middle) */}
          <div>
            <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
              About Us
            </div>
            <ul className="space-y-1.5 text-sm mb-6">
              {[
                { name: 'About TPF', path: '/about' },
                { name: 'FAQs', path: '/faqs' },
                { name: 'Legal Aid Centre', path: '/legalaid' },
                { name: 'Contact Us', path: '/contactus' },
                { name: 'Policies', path: '/policies' }

              ].map(link => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className={`${darkMode
                      ? 'text-zinc-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                      } transition-colors`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* 3️⃣ Get Involve (was at Ways to Jannah position) */}
          <div>
            <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Get Involve</div>
            <ul className="space-y-1.5 text-sm">
              {[
                { name: 'Careers', path: '/careers' },
                { name: 'Join TPF Aid', comingSoon: true },
                { name: 'Volunteer Now', path: '/volunteer/register' },
                { name: 'TPF Aid in News', comingSoon: true },
                { name: 'Blogs', path: '/blogs' },
                { name: 'Notices', path: '/notices' }
              ].map(item => (
                <li key={item.name}>
                  {item.comingSoon ? (
                    <button
                      onClick={() => handleComingSoon(item.name)}
                      className={`${darkMode ? 'text-zinc-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors text-left bg-transparent border-none p-0 cursor-pointer`}
                    >
                      {item.name}
                    </button>
                  ) : item.path ? (
                    <Link
                      href={item.path}
                      className={`${darkMode ? 'text-zinc-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <a
                      href="#"
                      className={`${darkMode ? 'text-zinc-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                    >
                      {item.name}
                    </a>
                  )}
                </li>
              ))}

            </ul>
          </div>

          {/* 4️⃣ Policies Section */}
          {/* <div>
  <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
    Policies
  </div>
  <ul className="space-y-1.5 text-sm">
    {[
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Terms & Conditions', path: '/terms' },
      { name: 'Use of Cookies', path: '/cookies' },
      { name: 'Legal', path: '/legal' },
    ].map(link => (
      <li key={link.name}>
        <a
          href={link.path}
          className={`${darkMode
            ? 'text-zinc-400 hover:text-white'
            : 'text-gray-600 hover:text-gray-900'
          } transition-colors`}
        >
          {link.name}
        </a>
      </li>
    ))}
  </ul>
</div> */}

        </div>

        {/* Islamic Calendar */}
        <div className={`mb-6 py-1 px-2`}>
          <div className="flex flex-col items-center justify-center gap-3 text-sm text-center">
            <div className="flex flex-col sm:flex-row items-center gap-2 flex-wrap justify-center">
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Today's Date:
              </span>
              <span className={`${darkMode ? 'text-zinc-300' : 'text-gray-700'} break-words`}>
                {hijriFromApi || '...'}
              </span>
            </div>
          </div>
        </div>

        {/* Quranic Quote */}
        <div className={`mb-6 text-center`}>
          <p className={`text-sm font-bold italic ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
            "Those who give charity—men and women—will have a noble reward." — (Mafoom) Quran 57:18
          </p>
        </div>

        {/* Newsletter Section */}
        <div className={`mb-8 px-6`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Stay inspired — join our journey beyond this life
              </h3>
              <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                Plant in this dunya, to bloom in the akhirah.
              </p>
            </div>

            <div className="flex flex-col w-full md:w-auto md:min-w-[400px]">
              <p className={`text-sm md:text-base font-medium italic mb-2 text-center md:text-left ${darkMode ? 'text-zinc-300' : 'text-gray-700'
                }`}>
                Join our newsletter now & stay inspired
              </p>

              <div className="flex">
                <input
                  type="email"
                  placeholder="Email address"
                  className={`flex-1 px-1 py-3 -ml-5 border rounded-lg focus:outline-gray-500 focus:ring-2 ${darkMode
                    ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                />
                <button
                  onClick={() => handleComingSoon('Newsletter subscription')}
                  className="px-6 ml-2 py-3 bg-black hover:bg-gray-900 text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-center gap-4 pt-6 border-t border-zinc-200/50 dark:border-zinc-800">
          
          {/* Centered LemontaKode Credit with Mono Typography */}
          <div className="w-full flex justify-center items-center">
            <div className="flex flex-wrap items-center justify-center gap-2.5 text-center">
              <span className={`text-[10px] sm:text-xs font-mono font-medium uppercase tracking-[0.2em] ${
                darkMode ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                Developed & Maintained by
              </span>
              <a
                href="https://lemontakode.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 bg-black text-white px-3.5 py-1 rounded-md font-mono font-bold text-xs uppercase tracking-[0.22em] border border-yellow-400/50 hover:border-yellow-400 shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-95"
              >
                <span className="text-white group-hover:text-yellow-400 transition-colors duration-200">
                  LEMONTAKODE
                </span>
                <span className="text-yellow-400 text-[10px] font-bold transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </a>
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className={`text-xs md:text-sm ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
              © {new Date().getFullYear()} True Path Foundation. All rights reserved.
            </span>

            {/* Social icons (custom SVG silver icons) */}
            <div className="flex items-center gap-3 mr-0 sm:mr-6">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/17zgwH9Ma2/"
                className="social-icon-link group"
                aria-label="Visit our Facebook page"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-all duration-300"
                >
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    fill={darkMode ? "#b8b8b8" : "#4a4a4a"}
                    className="group-hover:fill-[#6a6a6a] dark:group-hover:fill-[#e8e8e8] transition-colors duration-300"
                    strokeWidth={darkMode ? "0" : "0.5"}
                    stroke={darkMode ? "none" : "#4a4a4a"}
                  />
                </svg>
              </a>

              {/* Threads */}
              <a
                href="https://www.threads.com/@tpf_aid"
                className="social-icon-link group"
                aria-label="Visit our Threads page"
              >
                <Image
                  src="/Threads.png"
                  alt="Threads"
                  width={24}
                  height={24}
                  className={`transition-all duration-300 
        ${darkMode ? "invert opacity-80 group-hover:opacity-100" : "opacity-80 group-hover:opacity-100"}`}
                />
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@tpfaid?si=P1WQRtDiBftO0uc3"
                className="social-icon-link group"
                aria-label="Visit our YouTube channel"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-all duration-300"
                >
                  <path
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    fill={darkMode ? "#b8b8b8" : "#4a4a4a"}
                    className="group-hover:fill-[#6a6a6a] dark:group-hover:fill-[#e8e8e8] transition-colors duration-300"
                    strokeWidth={darkMode ? "0" : "0.5"}
                    stroke={darkMode ? "none" : "#4a4a4a"}
                  />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/tpf_aid?igsh=MTgyZG8weHdncmI1Yw=="
                className="social-icon-link group"
                aria-label="Visit our Instagram page"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-all duration-300"
                >
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
                    fill={darkMode ? "#b8b8b8" : "#4a4a4a"}
                    className="group-hover:fill-[#6a6a6a] dark:group-hover:fill-[#e8e8e8] transition-colors duration-300"
                    strokeWidth={darkMode ? "0" : "0.5"}
                    stroke={darkMode ? "none" : "#4a4a4a"}
                  />
                </svg>
              </a>
            </div>
          </div>

          <style jsx>{`
  .social-icon-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  .social-icon-link:hover {
    transform: translateY(-2px);
    filter: drop-shadow(0 4px 8px rgba(192, 192, 192, 0.3));
  }
  
  .social-icon-link:focus-visible {
    outline: 2px solid ${darkMode ? '#c0c0c0' : '#808080'};
    outline-offset: 3px;
    border-radius: 6px;
  }
  
  .social-icon-link:active {
    transform: translateY(0);
  }
`}</style>

        </div>
      </div>
    </footer>
  );
}