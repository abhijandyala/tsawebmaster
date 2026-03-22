'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { setDemoMode } from '@/lib/demoMode';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export const LANDING_TAGLINE = "Charlotte's resources, all in one place.";

export function LandingClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (loading || !user) return;
    const demo = typeof window !== 'undefined' && sessionStorage.getItem('clt_demo') === '1';
    if (!demo) router.replace('/home');
  }, [user, loading, router]);

  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  return (
    <div className="relative h-[100dvh] min-h-0 max-h-[100dvh] flex flex-col overflow-hidden bg-[#0d1210]">
      {/* Ambient layer — blue / mustard / olive blobs (Haptimize-style motion) */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <div className="clt-blob clt-blob-a -top-20 -left-16 opacity-60 dark:opacity-50" />
        <div className="clt-blob clt-blob-b top-1/3 -right-20 opacity-50 dark:opacity-40" />
        <div className="clt-blob clt-blob-c bottom-0 left-1/3 opacity-45 dark:opacity-35" />
      </div>

      <div className="absolute inset-0 z-[2]">
        <Image
          src="/charlotte_nc.png"
          alt=""
          fill
          priority
          className="object-cover opacity-85"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#23361D]/88 via-[#447CB3]/42 to-[#23361D]/75"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1210]/90 via-transparent to-[#447CB3]/15" aria-hidden />
      </div>

      <header className="relative z-20 flex justify-end items-center gap-2 p-4 sm:p-5">
        <LanguageSelector />
        <ThemeToggle />
      </header>

      <main className="relative z-20 flex-1 flex flex-col items-center justify-center min-h-0 px-6 pb-6 sm:pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="flex flex-col items-center max-w-lg w-full -mt-6 sm:-mt-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08, type: 'spring', stiffness: 280, damping: 22 }}
            className="mb-5 sm:mb-6"
          >
            <div className="inline-flex w-fit max-w-full items-center justify-center rounded-xl bg-white px-2 py-0 shadow-[0_4px_28px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.06]">
              <div className="relative h-[44px] w-[min(268px,78vw)] sm:h-[48px] sm:w-[min(288px,78vw)]">
                <Image
                  src="/cltlogotext.png"
                  alt="Charlotte Connect"
                  fill
                  sizes="(max-width: 640px) 78vw, 288px"
                  className="object-cover object-center"
                  priority
                />
              </div>
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

          <p className="mt-6 sm:mt-8 text-sm text-[#D4D8EC]/90 flex flex-wrap justify-center gap-x-3 gap-y-1">
            <Link href="/help" className="underline underline-offset-4 hover:text-white transition-colors">
              Help wizard
            </Link>
            <span className="text-white/40">·</span>
            <Link href="/my-plan" className="underline underline-offset-4 hover:text-white transition-colors">
              My plan
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
