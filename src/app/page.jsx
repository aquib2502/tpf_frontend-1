'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import ProcessFlowSection from '@/components/home/ProcessFlow';
import ScrollToTop from '@/components/ui/ScrollToTop';

import { useCMS } from './CMSContext';
import { useFetchImpactStatsQuery } from '@/utils/slices/campaignApiSlice';

// 🔥 Lazy load ALL heavy sections
const TrustedLogosSection = dynamic(() => import('@/components/home/TrustedLogosSection'), { ssr: false });
const StoriesSection = dynamic(() => import('@/components/home/StoriesSection'), { ssr: false });
const CampaignsSection = dynamic(() => import('@/components/home/CampaignsSection'), { ssr: false });
const CuratedSection = dynamic(() => import('@/components/home/CuratedSection'), { ssr: false });
const ImpactBanner = dynamic(() => import('@/components/home/ImpactBanner'), { ssr: false });
const CommunitiesSection = dynamic(() => import('@/components/home/CommunitiesSection'), { ssr: false });
const PartnersSection = dynamic(() => import('@/components/home/PartnersSection'), { ssr: false });
const PulseSection = dynamic(() => import('@/components/home/PulseSection'), { ssr: false });
const StartFundraiserBanner = dynamic(() => import('@/components/home/FundraiserBanner'), { ssr: false });

// 🔥 Lazy Section Wrapper (Intersection Observer)
function LazySection({ children }) {
  const [visible, setVisible] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // preload slightly before visible
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref]);

  return <div ref={setRef}>{visible ? children : null}</div>;
}

export default function Page() {
  const cms = useCMS();

  // 🌙 Dark Mode (safe initialization)
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      if (saved) setDarkMode(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch {}
  }, [darkMode]);

  // 🔥 Optimized scroll listener (no spam re-renders)
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 🔥 Delay API call until user interacts
  const { data: statsData } = useFetchImpactStatsQuery(undefined, {
    skip: !scrolled,
  });

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'bg-zinc-900' : 'bg-white'}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} scrolled={scrolled} />

      {/* ✅ ABOVE THE FOLD ONLY */}
      <section id="hero">
        <HeroSection darkMode={darkMode} />
      </section>

      <section id="process-flow">
        <ProcessFlowSection darkMode={darkMode} />
      </section>

      {/* 🔥 BELOW THE FOLD (Lazy Loaded) */}

      <LazySection>
        <section id="trusted-logos">
          <TrustedLogosSection darkMode={darkMode} />
        </section>
      </LazySection>

      <LazySection>
        <section id="stories">
          <StoriesSection darkMode={darkMode} />
        </section>
      </LazySection>

      <LazySection>
        <section id="campaigns">
          <CampaignsSection darkMode={darkMode} />
        </section>
      </LazySection>

      <LazySection>
        <section id="curated">
          <CuratedSection darkMode={darkMode} cms={cms} />
        </section>
      </LazySection>

      <LazySection>
        <section id="impact-banner">
          <ImpactBanner darkMode={darkMode} />
        </section>
      </LazySection>

      <LazySection>
        <section id="communities">
          <CommunitiesSection darkMode={darkMode} />
        </section>
      </LazySection>

      <LazySection>
        <section id="partners">
          <PartnersSection darkMode={darkMode} />
        </section>
      </LazySection>

      <LazySection>
        <section id="pulse">
          <PulseSection darkMode={darkMode} />
        </section>
      </LazySection>

      <LazySection>
        <section id="fundraiser-banner">
          <StartFundraiserBanner darkMode={darkMode} />
        </section>
      </LazySection>

      <Footer darkMode={darkMode} />
      <ScrollToTop scrolled={scrolled} />
    </div>
  );
}