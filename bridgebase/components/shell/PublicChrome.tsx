'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function PublicChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-surface/75 backdrop-blur-xl shadow-sm">
        <div className="max-w-6xl mx-auto h-[4.25rem] px-4 sm:px-6 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Image
                src="/cltlogo.png"
                alt="Charlotte Connect"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
            </motion.div>
            <span className="font-display font-semibold text-foreground hidden sm:block tracking-tight">
              Charlotte Connect
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/help"
              className="px-3 py-2 rounded-xl text-foreground-secondary hover:text-accent hover:bg-accent-soft/30 transition-colors"
            >
              Help wizard
            </Link>
            <Link
              href="/home"
              className="px-3 py-2 rounded-xl text-foreground-secondary hover:text-accent hover:bg-accent-soft/30 transition-colors"
            >
              Open app
            </Link>
            <Link
              href="/auth"
              className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark shadow-sm transition-colors"
            >
              Sign in
            </Link>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">{children}</main>

      <footer className="border-t border-border bg-surface-muted/60 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row justify-between gap-6 text-sm text-foreground-muted">
          <p className="max-w-md">
            Connecting Charlotte-area neighbors with food, housing, health, and crisis resources.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <Link href="/auth" className="hover:text-accent transition-colors">
              Account
            </Link>
            <Link href="/guides/emergency" className="hover:text-accent transition-colors">
              Emergency
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
