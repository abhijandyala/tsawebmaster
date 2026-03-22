'use client';

import { useEffect, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useDemo } from '@/contexts/demo-context';
import { setDemoMode } from '@/lib/demoMode';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';

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
          className="flex flex-col items-center gap-3"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        >
          <div className="h-10 w-10 rounded-2xl border-2 border-accent border-t-transparent animate-spin" />
          <span className="text-sm text-foreground-muted font-medium">Loading…</span>
        </motion.div>
      </div>
    );
  }

  if (!user && !isDemo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-foreground-muted">Redirecting…</p>
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
        <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5">
            <Link
              href="/home"
              className="flex items-center gap-3 shrink-0 group rounded-xl p-1 -m-1 hover:bg-accent-soft/25 transition-colors"
            >
              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
                <Image src="/cltlogo.png" alt="Home" width={36} height={36} className="h-9 w-auto" />
              </motion.div>
              <span className="hidden sm:block text-xs font-bold uppercase tracking-wider text-accent">
                Charlotte Connect
              </span>
            </Link>
            <p className="text-sm sm:text-base font-display font-semibold text-foreground truncate flex-1 text-center px-2">
              Welcome back,{' '}
              <span className="text-accent">{displayName}</span>
            </p>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  className="gap-1.5 text-foreground-secondary hover:text-accent"
                  onClick={() => logout().then(() => router.push('/'))}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              )}
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
