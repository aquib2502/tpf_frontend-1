import { useCMS } from '@/app/CMSContext';
import { useState, useEffect } from 'react';
import { getMediaUrl } from '@/utils/media';
import LiveImpactStream from './LiveImpactStream';
import { useRouter } from 'next/navigation';

export default function PulseSection({ darkMode }) {
  const router = useRouter();
  const COLORS = {
    neutralHeading: darkMode ? "text-white" : "text-zinc-900",
    neutralBody: darkMode ? "text-zinc-400" : "text-zinc-600",
  };

  const cms = useCMS();
  const cmsInfluencers = cms.filter(item => item.type === "influencers");
  /* Influencers slider (5 visible, auto-scroll left by 1 every second) */
  const VISIBLE_INFLUENCERS = 5;

  const influencerAvatars = cmsInfluencers.map(
    item => getMediaUrl(item.image)
  );


  const influencersExtended = [
    ...influencerAvatars,
    ...influencerAvatars.slice(0, VISIBLE_INFLUENCERS),
  ];

  const [infIndex, setInfIndex] = useState(0);
  const [infNoTransition, setInfNoTransition] = useState(false);



  useEffect(() => {
    const id = setInterval(() => setInfIndex((i) => i + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (infIndex === influencerAvatars.length) {
      const t = setTimeout(() => {
        setInfNoTransition(true);
        setInfIndex(0);
        requestAnimationFrame(() => setInfNoTransition(false));
      }, 520); // wait for the current slide transition to end
      return () => clearTimeout(t);
    }
  }, [infIndex, influencerAvatars.length]);

  return (
    <>
      <section id="influencers" className={`py-14 ${darkMode ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 items-stretch">

            {/* LEFT CARD */}
            <div
              className={`rounded-3xl p-6 md:p-8 border flex flex-col
    ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}
  `}
            >
              <div>
                <h3 className={`text-2xl sm:text-4xl font-bold leading-tight mb-3 ${COLORS.neutralHeading}`}>
                  Make a difference that lasts — with TPF Aid.

                </h3>
                <p className={`text-sm ${COLORS.neutralBody} mb-4`}>
                  Join a trusted network of givers who believe in impact without barriers. With no platform fees and access to a community of donors <span className='font-bold'>by India, for India, within India</span>, your campaign can reach hearts across the country. Start your journey toward change today.
                </p>
                <button className="px-6 py-2 rounded-full cursor-pointer font-semibold border transition-colors bg-white text-zinc-900 hover:bg-zinc-50 shadow-sm w-fit text-sm"
                onClick={() => router.push('/financial-aid')}>
                  Start fundraising today
                </button>
              </div>

              {/* IMAGE */}
              <div className="mt-5 flex items-center justify-center">
                <img
                  src="/funding.jpg"
                  alt="Funding Growth Visual"
                  className="w-full max-w-[240px] h-auto object-contain"
                />
              </div>
            </div>

            {/* RIGHT CARD */}
            <div
              className={`rounded-3xl p-8 md:p-10 border relative overflow-hidden flex flex-col transition-all duration-500
    ${darkMode
                  ? 'bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border-zinc-700/50 shadow-2xl shadow-emerald-500/5'
                  : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 border-purple-300/40 shadow-xl'
                }
  `}
            >
              {/* Animated gradient orbs */}
              <div className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-25 ${darkMode ? 'bg-emerald-600' : 'bg-indigo-300'}`}></div>
              <div className={`absolute -bottom-24 -left-12 w-80 h-80 rounded-full blur-3xl opacity-20 ${darkMode ? 'bg-purple-700' : 'bg-pink-300'}`}></div>

              <div className="relative z-10 mb-6">
                <h3 className="text-2xl sm:text-5xl font-bold leading-tight mb-4">
                  <span className={`inline-block transition-all duration-300 hover:scale-105 ${darkMode
                    ? 'text-emerald-400'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'
                    }`}>
                    Simple.
                  </span>
                  <br />
                  <span className={`inline-block transition-all duration-300 hover:scale-105 ${darkMode
                    ? 'text-emerald-500'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'
                    }`}>
                    Reliable.
                  </span>
                  <br />
                  <span className={`inline-block transition-all duration-300 hover:scale-105 ${darkMode
                    ? 'text-emerald-300'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'
                    }`}>
                    Impactful.
                  </span>
                </h3>

                <p className={`text-base ${COLORS.neutralBody} max-w-md leading-relaxed`}>
                  Join a trusted network of givers who believe in impact without barriers. With no platform fees and access to a community of donors <span className='font-bold'>by India, for India, within India</span>, your campaign can reach hearts across the country. Start your journey toward change today.{' '}
                  <span className="underline cursor-pointer hover:text-purple-600 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-1 group font-medium">
                    Learn more
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </p>
              </div>

              <div className="relative z-10 mt-auto pt-6 border-t border-zinc-200/50 dark:border-zinc-700/50">
                <div className={`text-xl font-semibold mb-5 ${COLORS.neutralHeading} flex items-center gap-2`}>
                  <span className={`inline-block w-2 h-2 rounded-full ${darkMode ? 'bg-emerald-400' : 'bg-purple-500'} animate-pulse`}></span>
                  Trusted by those you trust
                </div>

                {/* Slider viewport (exactly 5 visible) */}
                <div className="relative overflow-hidden rounded-2xl">
                  {/* moving track */}
                  <div
                    className="grid grid-flow-col auto-cols-[20%] items-center gap-0 py-2"
                    style={{
                      transform: `translateX(-${infIndex * 10}%)`,
                      transition: infNoTransition ? 'none' : 'transform 5000ms ease-out',
                    }}
                  >
                    {influencersExtended.map((src, i) => (
                      <div key={`influencer-${i}`} className="flex items-center justify-center px-1.5">
                        <img
                          src={src}
                          alt={`Influencer ${i + 1}`}
                          className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover shadow-xl
                         transition-all duration-300 hover:scale-110 hover:z-10
                         ${darkMode
                              ? 'ring-2 ring-emerald-500/40 hover:ring-4 hover:ring-emerald-400/60'
                              : 'ring-3 ring-white/80 hover:ring-4 hover:ring-purple-400/60'
                            }`}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Enhanced edge fades */}
                  <div className={`pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r ${darkMode ? 'from-zinc-900 via-zinc-900/90' : 'from-indigo-50 via-purple-50/90'} to-transparent`}></div>
                  <div className={`pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l ${darkMode ? 'from-zinc-950 via-zinc-900/90' : 'from-pink-100 via-purple-50/90'} to-transparent`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <LiveImpactStream darkMode={darkMode} />
    </>
  );
}