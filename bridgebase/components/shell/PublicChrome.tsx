'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

const ease = [0.25, 0.1, 0.25, 1] as const;

const navLinks = [
  { href: '/help', label: 'Guided help' },
  { href: '/resources', label: 'Directory' },
  { href: '/reference', label: 'Reference' },
];

function navActive(pathname: string, href: string): boolean {
  if (href === '/resources') {
    return pathname === '/resources' || pathname.startsWith('/resource/');
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <motion.header
        className="sticky top-0 z-50 border-b border-border/80 bg-surface/90 backdrop-blur-md supports-[backdrop-filter]:bg-surface/75"
        initial={reduceMotion ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
      >
        <div className="max-w-6xl mx-auto w-full clt-page-x py-3 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 shrink-0 rounded-lg -m-1 p-1 hover:bg-surface-muted/80 transition-colors duration-200"
            >
              <Image src="/cltlogo.png" alt="Charlotte Connect" width={36} height={36} className="h-9 w-auto" />
              <span className="font-display font-semibold text-foreground hidden sm:block text-[1.02rem] tracking-tight">
                Charlotte Connect
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-0.5 text-sm font-medium" aria-label="Primary">
              {navLinks.map((item) => {
                const active = navActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'rounded-lg px-3.5 py-2 transition-colors duration-200',
                      active
                        ? 'text-foreground bg-surface-muted border border-border/90 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] dark:shadow-none'
                        : 'text-foreground-secondary hover:text-foreground hover:bg-surface-muted/70'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>

          <nav className="flex md:hidden flex-wrap gap-2 pb-1" aria-label="Primary mobile">
            {navLinks.map((item) => {
              const active = navActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-surface-muted text-foreground border border-border'
                      : 'text-foreground-secondary hover:bg-surface-muted/70'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.header>

      <motion.main
        key={pathname}
        className="flex-1 w-full clt-page-x py-8 sm:py-10"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease }}
      >
        {children}
      </motion.main>

      <footer className="border-t border-border mt-auto bg-surface-muted/50">
        <div className="max-w-6xl mx-auto w-full clt-page-x py-10 flex flex-col sm:flex-row justify-between gap-8 text-sm text-foreground-muted">
          <p className="max-w-md leading-relaxed">
            A community resource hub for Charlotte-area neighbors — food, housing, health, youth programs, and crisis
            support. Built for clarity first.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 sm:justify-end">
            {[
              { href: '/', label: 'Home' },
              { href: '/resources', label: 'Directory' },
              { href: '/reference', label: 'Reference' },
              { href: '/guides/emergency', label: 'Emergency' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-accent transition-colors duration-200 font-medium">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
