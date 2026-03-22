'use client';

import { useEffect, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { useDemo } from '@/contexts/demo-context';
import { setDemoMode } from '@/lib/demoMode';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AIChatPanel } from '@/components/chat/AIChatPanel';

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { isDemo, hydrated } = useDemo();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated || loading) return;
    if (!user && !isDemo) router.replace('/');
  }, [user, isDemo, hydrated, loading, router]);

  if (!hydrated || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-foreground-secondary text-sm"
        >
          Loading…
        </motion.div>
      </div>
    );
  }

  if (!user && !isDemo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-foreground-secondary text-sm"
        >
          Redirecting…
        </motion.div>
      </div>
    );
  }

  const displayName =
    user?.displayName || user?.email?.split('@')[0] || (isDemo ? 'Guest (demo)' : 'there');

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar
        showExitDemo={isDemo && !user}
        onExitDemo={() => {
          setDemoMode(false);
          router.push('/');
        }}
        showSignOut={Boolean(user)}
        onSignOut={user ? () => logout().then(() => router.push('/')) : undefined}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
            <Link href="/home" className="flex items-center gap-2 shrink-0 motion-safe:transition-transform hover:scale-[1.02]">
              <Image src="/cltlogo.png" alt="Charlotte Connect" width={40} height={40} className="h-9 w-auto" />
            </Link>
            <p className="text-sm sm:text-base font-display font-semibold text-foreground truncate flex-1 text-center sm:text-left">
              Welcome back, {displayName}!
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      <AIChatPanel />
    </div>
  );
}
