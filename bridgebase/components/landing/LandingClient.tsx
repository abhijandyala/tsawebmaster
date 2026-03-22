'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { setDemoMode } from '@/lib/demoMode';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';

export const LANDING_TAGLINE =
  "Charlotte's resources, all in one place.";

export function LandingClient() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;
    const demo = typeof window !== 'undefined' && sessionStorage.getItem('clt_demo') === '1';
    if (!demo) router.replace('/home');
  }, [user, loading, router]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/charlotte_nc.png"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#23361D]/55" />
      </div>

      <header className="relative z-10 flex justify-end items-center gap-2 p-4">
        <LanguageSelector />
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="flex flex-col items-center max-w-xl"
        >
          <Image
            src="/cltlogotext.png"
            alt="Charlotte Connect"
            width={280}
            height={90}
            className="w-[min(280px,78vw)] h-auto drop-shadow-lg mb-8"
            priority
          />
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white text-balance drop-shadow-md mb-10">
            {LANDING_TAGLINE}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto min-w-[200px] bg-gold text-[#23361D] hover:bg-gold-light border-0 shadow-lg"
                onClick={() => router.push('/auth')}
              >
                Get started
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[200px] border-2 border-white/90 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
                onClick={() => {
                  setDemoMode(true);
                  router.push('/home');
                }}
              >
                Try demo
              </Button>
            </motion.div>
          </div>
          <p className="mt-10 text-sm text-white/80">
            <Link href="/help" className="underline underline-offset-2 hover:text-white">
              Help &amp; guides
            </Link>
            {' · '}
            <Link href="/my-plan" className="underline underline-offset-2 hover:text-white">
              Legacy My Plan
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
