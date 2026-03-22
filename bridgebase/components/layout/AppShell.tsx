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
import { SIDEBAR_OVERLAY_INSET_PX, SIDEBAR_RAIL_PX } from '@/lib/appShellLayout';

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

  const isHome = pathname === '/home';

  return (
    <div className="relative flex min-h-screen min-h-0 w-full bg-background">
      <AppSidebar
        showExitDemo={isDemo && !user}
        onExitDemo={() => {
          setDemoMode(false);
          router.push('/');
        }}
      />

      {/* flex-1 + min-w-0: fill viewport beside fixed rail; avoids shrink-wrapped header under block layout */}
      <div
        className="flex min-h-screen min-h-0 flex-1 min-w-0 flex-col"
        style={{ marginLeft: SIDEBAR_RAIL_PX, paddingLeft: SIDEBAR_OVERLAY_INSET_PX }}
      >
        <header className="sticky top-0 z-40 w-full max-w-none min-w-0 shrink-0 border-b border-border bg-surface/80 backdrop-blur-xl box-border">
          <motion.div
            className={`flex w-full max-w-none min-w-0 items-center gap-3 clt-page-x py-3.5 ${isHome ? 'justify-between' : 'justify-end'}`}
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: pageEase }}
          >
            {isHome ? (
              <p className="min-w-0 flex-1 text-left text-sm sm:text-base font-display font-semibold text-foreground truncate pr-2">
                Welcome back, <span className="text-accent">{displayName}</span>
              </p>
            ) : null}
            <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </motion.div>
        </header>

        <motion.main
          key={pathname}
          className="flex-1 py-5 sm:py-6 lg:py-8 clt-page-x"
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
