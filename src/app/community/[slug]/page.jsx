"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Users, ShieldCheck, ArrowLeft, Construction, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommunityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug || '';

  const userInfo = useSelector((state) => state.auth.userInfo);

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
      } catch (error) {
        return false;
      }
    }
    return false;
  });

  const [scrolled, setScrolled] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [darkMode]);

  const communityTitleMap = {
    'blood-donors': 'Blood Donors Community',
    'medical-professionals': 'Medical Professionals Community',
    'law-professionals': 'Law Professionals Community',
    'intellectuals': 'Intellectuals Community',
  };

  const communityTitle = communityTitleMap[slug] || (slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Community');

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} scrolled={scrolled} />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <button
          onClick={() => router.push('/#communities')}
          className={`group flex items-center gap-2 px-4 py-2 rounded-full mb-8 border transition-all ${
            darkMode
              ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
              : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 shadow-sm'
          }`}
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-xs font-bold uppercase tracking-wider">Back to Communities</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-3xl p-8 sm:p-12 border relative overflow-hidden text-center ${
            darkMode
              ? 'bg-zinc-900/80 border-zinc-800 shadow-2xl'
              : 'bg-white border-gray-100 shadow-xl'
          }`}
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Member Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck size={16} />
            Verified Active Member
          </div>

          <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight">
            {communityTitle}
          </h1>

          <p className={`text-base sm:text-lg max-w-xl mx-auto font-medium mb-10 ${
            darkMode ? 'text-zinc-400' : 'text-gray-600'
          }`}>
            Thank you for standing with TPF Aid to drive impactful change in society.
          </p>

          {/* Community Building Card */}
          <div className={`p-8 sm:p-10 rounded-2xl border text-left max-w-2xl mx-auto space-y-6 ${
            darkMode
              ? 'bg-zinc-800/60 border-zinc-700/60'
              : 'bg-emerald-50/50 border-emerald-100'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Community Hub Under Construction</h3>
                <p className={`text-xs ${darkMode ? 'text-zinc-400' : 'text-gray-500'}`}>Building the future of collective action</p>
              </div>
            </div>

            <p className={`text-sm sm:text-base leading-relaxed font-medium ${
              darkMode ? 'text-zinc-300' : 'text-gray-700'
            }`}>
              We are currently building this community and will show the full details, directory, and interactive features once we have reached our initial member goal in this community.
            </p>

            <div className="pt-4 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-emerald-600">
              <span className="flex items-center gap-2">
                <Heart size={14} className="fill-emerald-500 text-emerald-500" /> Member Registration Confirmed
              </span>
              <span className="text-gray-400">TPF Aid Communities</span>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}
