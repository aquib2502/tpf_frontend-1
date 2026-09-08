import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCMS } from "@/app/CMSContext";
import { getMediaUrl } from '@/utils/media';
import Link from 'next/link';

export default function CommunitiesSection({ darkMode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const cms = useCMS();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const cmsCommunities = cms.filter(item => item.type === "communities");
  if (!cmsCommunities || cmsCommunities.length === 0) {
    return null;
  }
  const COLORS = {
    neutralHeading: darkMode ? "text-white" : "text-zinc-900",
    neutralBody: darkMode ? "text-zinc-400" : "text-zinc-600",
  };

  const getCommunitySlug = (title) => {
    if (!title) return 'general';
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const isJoined = (title) => {
    if (!userInfo || !title) return false;
    const joinedList = userInfo.joinedCommunities || userInfo.communities || [];
    const normalizedTitle = title.toLowerCase().replace(/community/g, '').trim();
    const slugTitle = getCommunitySlug(title);

    const matchInList = joinedList.some(item => {
      if (!item) return false;
      if (typeof item === 'string') {
        const normItem = item.toLowerCase().replace(/community/g, '').trim();
        const slugItem = getCommunitySlug(item);
        return (
          normItem === normalizedTitle ||
          slugItem === slugTitle ||
          normItem.includes(normalizedTitle) ||
          normalizedTitle.includes(normItem) ||
          slugItem.includes(slugTitle) ||
          slugTitle.includes(slugItem)
        );
      }
      if (typeof item === 'object') {
        const itemTitle = (item.title || item.name || '').toLowerCase().replace(/community/g, '').trim();
        return itemTitle === normalizedTitle || itemTitle.includes(normalizedTitle);
      }
      return false;
    });

    if (matchInList) return true;

    // Special check: If user registered as volunteer with blood group or consent, match Blood Donors
    if ((slugTitle.includes('blood') || normalizedTitle.includes('blood')) && (userInfo.bloodGroup || userInfo.consentGiven)) {
      return true;
    }

    return false;
  };

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll for mobile only
  useEffect(() => {
    if (!isMobile || isUserScrolling) return;

    const interval = setInterval(() => {
      setScrollIndex(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [isMobile, isUserScrolling]);

  // Scroll communities container
  useEffect(() => {
    if (!isMobile) return;

    const container = document.getElementById('communities-container');
    if (!container) return;

    const cardWidth = container.children[0]?.offsetWidth || 0;
    const gap = 20; // 1.25rem = 20px
    const scrollTo = (cardWidth + gap) * scrollIndex;

    container.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });

    if (scrollIndex >= cmsCommunities.length) {
      setTimeout(() => {
        container.scrollTo({
          left: 0,
          behavior: 'auto'
        });
        setScrollIndex(0);
      }, 500);
    }
  }, [scrollIndex, isMobile, cmsCommunities.length]);

  // Handle user scrolling detection
  useEffect(() => {
    if (!isMobile) return;

    const container = document.getElementById('communities-container');
    if (!container) return;

    let scrollTimeout;
    let isScrolling = false;

    const handleScrollStart = () => {
      if (!isScrolling) {
        isScrolling = true;
        setIsUserScrolling(true);
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        setIsUserScrolling(false);
      }, 2000);
    };

    container.addEventListener('scroll', handleScrollStart, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScrollStart);
    };
  }, [isMobile]);

  // Handle seamless infinite loop for manual scrolling
  useEffect(() => {
    if (!isMobile) return;

    const container = document.getElementById('communities-container');
    if (!container) return;

    const handleScrollEnd = () => {
      const cardWidth = container.children[0]?.offsetWidth || 0;
      const gap = 20; // 1.25rem = 20px
      const scrollLeft = container.scrollLeft;
      const currentIndex = Math.round(scrollLeft / (cardWidth + gap));

      if (currentIndex >= cmsCommunities.length) {
        const equivalentIndex = currentIndex - cmsCommunities.length;
        container.scrollTo({
          left: equivalentIndex * (cardWidth + gap),
          behavior: 'auto'
        });
        setScrollIndex(equivalentIndex);
      } else if (currentIndex < 0) {
        container.scrollTo({
          left: (cmsCommunities.length + currentIndex) * (cardWidth + gap),
          behavior: 'auto'
        });
        setScrollIndex(cmsCommunities.length + currentIndex);
      }
    };

    let scrollTimeout;
    const onScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 150);
    };

    container.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', onScroll);
    };
  }, [isMobile, cmsCommunities.length]);

  return (
    <section id="communities" className={`py-14 ${darkMode ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${COLORS.neutralHeading}`}>
            Communities
          </h2>
          <p className={`text-sm ${COLORS.neutralBody}`}>
            Communities you would like to join
          </p>
        </div>

        <div
          id="communities-container"
          className="
            /* MOBILE */
            flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide
            /* DESKTOP */
            md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:snap-none md:pb-0
          "
        >
          {(isMobile ? [...cmsCommunities, ...cmsCommunities] : cmsCommunities).map((community, index) => {
            const joined = isJoined(community.title);
            const slug = getCommunitySlug(community.title);
            const targetHref = joined
              ? `/community/${slug}`
              : `/volunteer/register?community=${encodeURIComponent(community.title)}`;

            return (
              <div
                key={`community-${community.title}-${index}`}
                className="
                  flex-shrink-0 w-[280px] md:w-auto
                  snap-center rounded-2xl overflow-hidden 
                  group cursor-pointer transition-all duration-300 hover:scale-105
                  shadow-lg hover:shadow-2xl
                  bg-white dark:bg-zinc-800
                "
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getMediaUrl(community.image)}
                    alt={community.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="font-semibold text-white text-lg mb-2 drop-shadow-md">
                      {community.title}
                    </h3>
                    <Link href={targetHref}>
                      <button
                        className={`cursor-pointer text-xs flex items-center justify-center gap-1.5 px-4 py-1.5 font-bold rounded-2xl transition-all duration-200 ${
                          joined
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {joined ? 'View' : 'Join Now'}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}