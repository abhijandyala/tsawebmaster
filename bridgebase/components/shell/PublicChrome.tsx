'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const ease = [0.25, 0.1, 0.25, 1] as const;

const navLinks = [
  { href: '/help', label: 'Help wizard', variant: 'ghost' as const },
  { href: '/home', label: 'Open app', variant: 'ghost' as const },
  { href: '/auth', label: 'Sign in', variant: 'primary' as const },
];

export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <motion.header
        className="sticky top-0 z-50 border-b border-border bg-surface/75 backdrop-blur-xl shadow-sm"
        initial={reduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease }}
      >
        <div className="max-w-6xl mx-auto h-[4.25rem] px-4 sm:px-6 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0 group rounded-xl -m-1 p-1">
            <motion.div
              whileHover={reduceMotion ? undefined : { scale: 1.05 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            >
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
            {navLinks.map((item, i) => (
              <motion.div
                key={item.href}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease, delay: 0.06 * (i + 1) }}
              >
                <Link
                  href={item.href}
                  className={
                    item.variant === 'primary'
                      ? 'inline-flex px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark shadow-sm transition-colors duration-200'
                      : 'inline-flex px-3 py-2 rounded-xl text-foreground-secondary hover:text-accent hover:bg-accent-soft/30 transition-colors duration-200'
                  }
                >
                  <motion.span
                    className="inline-block"
                    whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div
            className="flex items-center gap-1 sm:gap-2"
            initial={reduceMotion ? false : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.12 }}
          >
            <LanguageSelector />
            <ThemeToggle />
          </motion.div>
        </div>
      </motion.header>

      <motion.main
        key={pathname}
        className="flex-1 w-full"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
      >
        {children}
      </motion.main>

      <motion.footer
        className="border-t border-border bg-surface-muted/60 mt-auto"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.12 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row justify-between gap-6 text-sm text-foreground-muted">
          <p className="max-w-md">
            Connecting Charlotte-area neighbors with food, housing, health, and crisis resources.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { href: '/', label: 'Home' },
              { href: '/auth', label: 'Account' },
              { href: '/guides/emergency', label: 'Emergency' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-accent transition-colors duration-200 relative"
              >
                <motion.span
                  className="inline-block"
                  whileHover={reduceMotion ? undefined : { y: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {l.label}
                </motion.span>
              </Link>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
