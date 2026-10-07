'use client';

import { CheckCircle, Heart, ArrowRight, Award, Download, Home, Mail } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(8);
  const [campaignSlug, setCampaignSlug] = useState(null);

  useEffect(() => {
    const slugParam = searchParams?.get('campaignSlug');
    if (slugParam) {
      setCampaignSlug(slugParam);
    } else if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('last_donated_campaign_slug');
      if (cached) setCampaignSlug(cached);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      router.push('/');
    }
  }, [countdown, router]);

  const donateAgainHref = campaignSlug ? `/campaign/${campaignSlug}` : '/all-campaigns';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-3 sm:p-4">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Decorative top border */}
          <div className="h-1.5 sm:h-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />

          <div className="grid lg:grid-cols-2">
            {/* Left Column - Success & Actions */}
            <div className="p-5 sm:p-6 lg:p-8 flex flex-col justify-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-20" />
              
              <div className="relative z-10 space-y-4 sm:space-y-5">
                {/* Success Icon */}
                <div className="flex justify-center lg:justify-start">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-30" />
                    <div className="relative bg-emerald-50 rounded-full p-3 sm:p-4">
                      <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-600" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center lg:text-left">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-1.5">
                    Donation Successful
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    Thank you for making a difference
                  </p>
                </div>

                {/* Impact Visual Cards */}
                <div className="flex gap-2 sm:gap-2.5">
                  <div className="flex-1 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg sm:rounded-xl p-2.5 sm:p-3.5 text-center border border-emerald-200/50">
                    <div className="bg-emerald-500 rounded-md sm:rounded-lg w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center mx-auto mb-1 sm:mb-1.5">
                      <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-emerald-900">Making Impact</p>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg sm:rounded-xl p-2.5 sm:p-3.5 text-center border border-blue-200/50">
                    <div className="bg-blue-500 rounded-md sm:rounded-lg w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center mx-auto mb-1 sm:mb-1.5">
                      <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-blue-900">Champion</p>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg sm:rounded-xl p-2.5 sm:p-3.5 text-center border border-purple-200/50">
                    <div className="bg-purple-500 rounded-md sm:rounded-lg w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center mx-auto mb-1 sm:mb-1.5">
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-purple-900">Verified</p>
                  </div>
                </div>

                {/* Countdown */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm text-gray-600">Redirecting in</span>
                    <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md">
                      {countdown}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 8, ease: 'linear' }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
                  <Link
                    href={donateAgainHref}
                    className="group flex-1 py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                    <span>Donate Again</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform duration-200" strokeWidth={2.5} />
                  </Link>

                  <Link
                    href="/"
                    className="flex-1 py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg sm:rounded-xl bg-white border-2 border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm hover:shadow"
                  >
                    <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                    <span>Go Home</span>
                  </Link>
                </div>

                {/* Footer Info - Compact */}
                <div className="text-center lg:text-left space-y-0.5 sm:space-y-1">
                  <p className="text-[11px] sm:text-xs text-gray-500 flex items-center justify-center lg:justify-start gap-1 sm:gap-1.5">
                    <Mail className="w-3 h-3" />
                    Receipt sent to your email
                  </p>
                  <Link 
                    href="/profile/downloads" 
                    className="text-[11px] sm:text-xs text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1 font-medium"
                  >
                    <Download className="w-3 h-3" />
                    Download invoice & certificate
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Motivation */}
            <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-5 sm:p-6 lg:p-8 flex flex-col justify-center text-white relative overflow-hidden min-h-[400px] lg:min-h-0">
              {/* Decorative Circles */}
              <div className="absolute top-10 right-10 w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-full opacity-10 blur-3xl" />
              <div className="absolute bottom-10 left-10 w-40 h-40 sm:w-48 sm:h-48 bg-teal-400 rounded-full opacity-20 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-emerald-300 rounded-full opacity-10 blur-3xl" />
              
              <div className="relative z-10 space-y-5 sm:space-y-6 lg:space-y-7">
                {/* Main Message */}
                <div className="space-y-2.5 sm:space-y-3.5">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 sm:px-3.5 py-1 sm:py-1.5 border border-white/20">
                    <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2.5} />
                    <span className="text-[10px] sm:text-xs font-semibold">Thank You</span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                    Champion of
                    <br />
                    Change
                  </h2>
                </div>

                {/* Visual Impact Icons */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 text-center hover:bg-white/15 transition-colors duration-200">
                    <div className="bg-white/20 rounded-lg sm:rounded-xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-1.5 sm:mb-2.5">
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                    </div>
                    <p className="font-semibold text-xs sm:text-sm">Real Impact</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 text-center hover:bg-white/15 transition-colors duration-200">
                    <div className="bg-white/20 rounded-lg sm:rounded-xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-1.5 sm:mb-2.5">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                    </div>
                    <p className="font-semibold text-xs sm:text-sm">You're Amazing</p>
                  </div>
                </div>

                {/* Quote */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                  <p className="text-sm sm:text-base italic leading-relaxed mb-1.5 sm:mb-2">
                    "Charity does not in any way decrease the wealth and the servant who forgives, Allah adds to his respect; and the one who shows humility, Allah elevates him in the estimation (of the people)"
                  </p>
                  <p className="text-emerald-100 text-xs sm:text-sm font-medium">— Prophet Muhammad (SAW)</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}