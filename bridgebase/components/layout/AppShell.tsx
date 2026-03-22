'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { useDemo } from '@/contexts/demo-context';
import { setDemoMode } from '@/lib/demoMode';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

/** Haptimize app layout: main uses fixed left margin (rail width); sidebar overlays when expanded */
const RAIL_MARGIN = 'ml-16';

const pageEase = [0.25, 0.1, 0.25, 1] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { isDemo, hydrated } = useDemo();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!hydrated || loading) return;
    if (!user && !isDemo) router.replace('/');
  }, [user, isDemo, hydrated, loading, router]);

  if (!hydrated || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: pageEase }}
        >
          <motion.div
            className="h-10 w-10 rounded-2xl border-2 border-accent border-t-transparent"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={reduceMotion ? undefined : { repeat: Infinity, duration: 1, ease: 'linear' }}
          />
          <span className="text-sm text-foreground-muted font-medium">Loading…</span>
        </motion.div>
      </div>
    );
  }

  if (!user && !isDemo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.p
          className="text-sm text-foreground-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: pageEase }}
        >
          Redirecting…
        </motion.p>
      </div>
    );
  }

  const displayName =
    user?.displayName || user?.email?.split('@')[0] || (isDemo ? 'Guest (demo)' : 'there');

  return (
    <div className="min-h-screen bg-background relative">
      <AppSidebar
        showExitDemo={isDemo && !user}
        onExitDemo={() => {
          setDemoMode(false);
          router.push('/');
        }}
      />

      <div className={`min-h-screen flex flex-col min-w-0 ${RAIL_MARGIN}`}>
        <motion.header
          className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-xl"
          initial={reduceMotion ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: pageEase }}
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:px-6 py-3.5">
            <div className="min-w-0" aria-hidden />
            <p className="text-sm sm:text-base font-display font-semibold text-foreground truncate text-center px-2 max-w-[min(100vw-12rem,28rem)]">
              Welcome back,{' '}
              <span className="text-accent">{displayName}</span>
            </p>
            <motion.div
              className="flex items-center justify-end gap-1 sm:gap-2 min-w-0"
              initial={reduceMotion ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: pageEase, delay: 0.05 }}
            >
              <LanguageSelector />
              <ThemeToggle />
            </motion.div>
          </div>
        </motion.header>

        <motion.main
          key={pathname}
          className="flex-1 p-4 sm:p-6 lg:p-10"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: pageEase }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
