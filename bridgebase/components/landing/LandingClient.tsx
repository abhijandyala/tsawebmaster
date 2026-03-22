'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { setDemoMode } from '@/lib/demoMode';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LandingBelowFold, LandingScrollHint } from './LandingBelowFold';

export const LANDING_TAGLINE = "Charlotte's resources, all in one place.";

export function LandingClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  /** Document scroll only — avoid `useScroll({ target: ref })` (can throw if ref hydrates late; breaks Next). */
  const { scrollYProgress: pageScroll } = useScroll();
  const pageBar = useSpring(pageScroll, { stiffness: 120, damping: 35, restDelta: 0.001 });

  useEffect(() => {
    if (loading || !user) return;
    const demo = typeof window !== 'undefined' && sessionStorage.getItem('clt_demo') === '1';
    if (!demo) router.replace('/home');
  }, [user, loading, router]);

  return (
    <div className="relative min-h-0 bg-transparent">
      {/* Page scroll progress */}
      {!reduceMotion && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] h-1 bg-accent origin-left pointer-events-none"
          style={{ scaleX: pageBar }}
          aria-hidden
        />
      )}

      <div className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-transparent">
        <header className="relative z-20 flex justify-end items-center gap-2 p-4 sm:p-5">
          <LanguageSelector />
          <ThemeToggle />
        </header>

        <main className="relative z-20 flex-1 flex flex-col items-center justify-start pt-4 sm:pt-6 min-h-0 px-6 pb-8 sm:pb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="flex flex-col items-center max-w-2xl w-full"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08, type: 'spring', stiffness: 280, damping: 22 }}
              className="mb-5 sm:mb-6"
            >
              <div className="inline-flex w-fit max-w-full items-center justify-center rounded-2xl bg-white/12 backdrop-blur-md border-2 border-[#D4D8EC]/55 px-5 py-2.5 sm:px-7 sm:py-3.5">
                <Image
                  src="/cltlogotext.png"
                  alt="Charlotte Connect"
                  width={1515}
                  height={391}
                  sizes="(max-width: 640px) 88vw, 360px"
                  className="block w-[min(300px,86vw)] sm:w-[min(360px,82vw)] h-auto max-w-full"
                  priority
                />
              </div>
            </motion.div>

            <h1 className="font-display text-[clamp(1.75rem,5vw,3rem)] font-bold text-white text-balance leading-tight mb-6 sm:mb-7 drop-shadow-md">
              {LANDING_TAGLINE}
            </h1>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto sm:justify-center"
              variants={{
                show: {
                  transition: reduceMotion ? undefined : { staggerChildren: 0.1, delayChildren: 0.15 },
                },
              }}
              initial="hidden"
              animate="show"
            >
              <motion.button
                type="button"
                variants={{
                  hidden: reduceMotion ? {} : { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                onClick={() => router.push('/auth')}
                className="min-w-[200px] h-14 px-8 rounded-2xl font-semibold text-[#23361D] bg-[#BBB857] shadow-lg hover:bg-[#c9c46a] border border-[#d4d080]/50"
              >
                Get started
              </motion.button>
              <motion.button
                type="button"
                variants={{
                  hidden: reduceMotion ? {} : { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                onClick={() => {
                  setDemoMode(true);
                  router.push('/home');
                }}
                className="min-w-[200px] h-14 px-8 rounded-2xl font-semibold text-white bg-white/12 backdrop-blur-md border-2 border-[#D4D8EC]/55 hover:bg-white/20 hover:border-[#D4D8EC]/80"
              >
                Try demo
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
