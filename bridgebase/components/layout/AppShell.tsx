'use client';

import { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { useDemo } from '@/contexts/demo-context';
import { setDemoMode } from '@/lib/demoMode';
import { usePageTransition } from '@/contexts/page-transition-context';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SIDEBAR_OVERLAY_INSET_PX, SIDEBAR_RAIL_PX } from '@/lib/appShellLayout';

const pageEase = [0.25, 0.1, 0.25, 1] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isDemo, hydrated } = useDemo();
  const { startTransition } = usePageTransition();
  const reduceMotion = useReducedMotion();

  if (!hydrated) {
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

  const displayName =
    user?.displayName || user?.email?.split('@')[0] || (isDemo ? 'Guest (demo)' : 'Charlotte neighbor');

  const isHome = pathname === '/home';

  return (
    <div className="relative flex min-h-screen min-h-0 w-full bg-background">
      <AppSidebar
        showExitDemo={isDemo && !user}
        onExitDemo={() => {
          setDemoMode(false);
          startTransition('/');
        }}
      />

      <div
        className="box-border flex min-h-screen min-h-0 shrink-0 flex-col"
        style={{
          marginLeft: SIDEBAR_RAIL_PX,
          width: `calc(100% - ${SIDEBAR_RAIL_PX}px)`,
          maxWidth: `calc(100% - ${SIDEBAR_RAIL_PX}px)`,
          ['--clt-overlay-inset' as string]: `${SIDEBAR_OVERLAY_INSET_PX}px`,
          ['--clt-sidebar-rail' as string]: `${SIDEBAR_RAIL_PX}px`,
        }}
      >
        {isHome ? (
          <header className="sticky top-0 z-40 w-full min-w-0 shrink-0 border-b border-border bg-surface/80 backdrop-blur-xl box-border">
            <motion.div
              className="flex w-full min-w-0 max-w-none items-center justify-between gap-3 py-3.5 pl-[calc(var(--clt-overlay-inset)+1rem)] sm:pl-[calc(var(--clt-overlay-inset)+1.25rem)] lg:pl-[calc(var(--clt-overlay-inset)+1.5rem)] pr-[calc(var(--clt-overlay-inset)+var(--clt-sidebar-rail)+1rem)] sm:pr-[calc(var(--clt-overlay-inset)+var(--clt-sidebar-rail)+1.25rem)] lg:pr-[calc(var(--clt-overlay-inset)+var(--clt-sidebar-rail)+1.5rem)]"
              initial={reduceMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: pageEase }}
            >
              <p className="min-w-0 flex-1 text-left text-sm sm:text-base font-display font-semibold text-foreground truncate pr-2">
                Welcome, <span className="text-accent">{displayName}</span>
              </p>
              <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
                <LanguageSelector />
                <ThemeToggle />
              </div>
            </motion.div>
          </header>
        ) : null}

        <motion.main
          key={pathname}
          className="min-w-0 flex-1 py-5 sm:py-6 lg:py-8 pl-[calc(var(--clt-overlay-inset)+1rem)] sm:pl-[calc(var(--clt-overlay-inset)+1.25rem)] lg:pl-[calc(var(--clt-overlay-inset)+1.5rem)] pr-[calc(var(--clt-overlay-inset)+var(--clt-sidebar-rail)+1rem)] sm:pr-[calc(var(--clt-overlay-inset)+var(--clt-sidebar-rail)+1.25rem)] lg:pr-[calc(var(--clt-overlay-inset)+var(--clt-sidebar-rail)+1.5rem)]"
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
