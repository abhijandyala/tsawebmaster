'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LandingBelowFold, LandingScrollHint } from './LandingBelowFold';

export const LANDING_TAGLINE = "Charlotte's resources,";

const enterEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function LandingClient() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress: pageScroll } = useScroll();
  const pageBar = useSpring(pageScroll, { stiffness: 120, damping: 35, restDelta: 0.001 });

  return (
    <div className="relative min-h-0 bg-transparent">
      {!reduceMotion && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-gold origin-left pointer-events-none"
          style={{ scaleX: pageBar }}
          aria-hidden
        />
      )}

      <div className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-transparent">
        <header className="relative z-20 border-b border-white/[0.12]">
          <div className="max-w-6xl mx-auto w-full flex justify-end items-center gap-3 py-4 sm:py-5 clt-page-x">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </header>

        <main className="relative z-20 flex-1 flex flex-col items-center justify-start pt-6 sm:pt-10 min-h-0 clt-page-x pb-10 sm:pb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: enterEase }}
            className="flex flex-col items-center max-w-[34rem] w-full text-center"
          >
            <p className="text-[13px] sm:text-sm text-[#D4D8EC]/85 font-medium tracking-tight mb-6 leading-snug max-w-sm">
              Community resource hub — nonprofits, services, and programs across Mecklenburg and nearby counties.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? { duration: 0 } : { delay: 0.05, duration: 0.5, ease: enterEase }}
              className="mb-8 sm:mb-10"
            >
              <div className="inline-flex w-fit max-w-full items-center justify-center rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/[0.18] px-6 py-3 sm:px-8 sm:py-4 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                <Image
                  src="/cltlogotext.png"
                  alt="Charlotte Connect"
                  width={1515}
                  height={391}
                  sizes="(max-width: 640px) 88vw, 340px"
                  className="block w-full max-w-[280px] sm:max-w-[320px] h-auto mx-auto"
                  priority
                />
              </div>
            </motion.div>

            <h1 className="font-display text-[clamp(1.85rem,5.5vw,3.15rem)] font-semibold text-white text-balance leading-[1.12] mb-2 drop-shadow-sm tracking-tight">
              {LANDING_TAGLINE}{' '}
              <span className="italic font-normal text-[#f2f4f8]">all in one place.</span>
            </h1>
            <p className="text-sm text-[#c8cedd]/95 max-w-md mb-10 leading-relaxed">
              Search and filter trusted listings, save what matters on your device, and get guided help when you’re not
              sure where to start.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:justify-center"
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
              }}
            >
              <motion.button
                type="button"
                variants={{
                  hidden: reduceMotion ? {} : { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.38, ease: enterEase }}
                onClick={() => router.push('/home')}
                className="min-w-[200px] h-[3.25rem] px-8 rounded-lg font-semibold text-white bg-[#23361D] shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_8px_24px_rgba(0,0,0,0.25)] border border-black/20 hover:bg-[#1a2816] hover:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_12px_28px_rgba(0,0,0,0.28)] active:translate-y-px"
              >
                Enter the hub
              </motion.button>
              <motion.button
                type="button"
                variants={{
                  hidden: reduceMotion ? {} : { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.38, ease: enterEase }}
                onClick={() => router.push('/reference')}
                className="min-w-[200px] h-[3.25rem] px-8 rounded-lg font-semibold text-[#eef1ea] bg-transparent border border-[#D4D8EC]/45 hover:bg-white/[0.07] hover:border-[#D4D8EC]/65"
              >
                Competition reference
              </motion.button>
            </motion.div>

            <LandingScrollHint />
          </motion.div>
        </main>
      </div>

      <LandingBelowFold />
    </div>
  );
}
