'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  LayoutGrid,
  Bookmark,
  Settings,
  LifeBuoy,
  LogOut,
  PanelLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/resources', label: 'Resource hub', icon: LayoutGrid },
  { href: '/your-resources', label: 'Your resources', icon: Bookmark },
  { href: '/request-resource', label: 'Request resource', icon: LifeBuoy },
  { href: '/settings', label: 'Settings', icon: Settings },
];

/** Match Haptimize sidebar: brief delay before collapsing when pointer leaves */
const COLLAPSE_DELAY_MS = 120;

type Props = {
  onSignOut?: () => void;
  showSignOut?: boolean;
  showExitDemo?: boolean;
  onExitDemo?: () => void;
};

export function AppSidebar({ onSignOut, showSignOut, showExitDemo, onExitDemo }: Props) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCollapseTimer = useCallback(() => {
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    }
  }, []);

  const handleEnter = useCallback(() => {
    clearCollapseTimer();
    setExpanded(true);
  }, [clearCollapseTimer]);

  const handleLeave = useCallback(() => {
    clearCollapseTimer();
    collapseTimer.current = setTimeout(() => {
      setExpanded(false);
      collapseTimer.current = null;
    }, COLLAPSE_DELAY_MS);
  }, [clearCollapseTimer]);

  useEffect(() => () => clearCollapseTimer(), [clearCollapseTimer]);

  return (
    <aside
      aria-label="Main navigation"
      aria-expanded={expanded}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        'shrink-0 flex flex-col min-h-screen border-r border-border bg-surface/90 backdrop-blur-xl shadow-[4px_0_24px_rgba(68,124,179,0.06)]',
        'transition-[width] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] overflow-hidden',
        expanded ? 'w-60' : 'w-[4.5rem]'
      )}
    >
      <div
        className={cn(
          'border-b border-border-light flex items-center min-h-[3.25rem]',
          expanded ? 'px-4 justify-start' : 'px-0 justify-center'
        )}
      >
        {expanded ? (
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Navigate</p>
        ) : (
          <PanelLeft className="w-5 h-5 text-accent/80" aria-hidden />
        )}
      </div>
      <nav className="p-2 flex flex-col gap-1 flex-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <motion.div key={href} whileHover={{ x: expanded ? 3 : 0 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={href}
                title={label}
                className={cn(
                  'flex items-center rounded-2xl text-sm font-semibold transition-colors relative',
                  expanded ? 'gap-3 px-3 py-3' : 'justify-center px-0 py-3 mx-1',
                  active
                    ? 'bg-accent-soft text-accent-dark border border-accent/25 shadow-sm'
                    : 'text-foreground-secondary hover:text-foreground hover:bg-surface-muted border border-transparent'
                )}
              >
                {active && expanded && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-accent" />
                )}
                <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-accent' : 'opacity-80')} />
                {expanded && <span className="pl-0.5 truncate">{label}</span>}
              </Link>
            </motion.div>
          );
        })}
      </nav>
      {(showExitDemo || (showSignOut && onSignOut)) && (
        <div className={cn('p-2 border-t border-border space-y-1 mt-auto', !expanded && 'flex flex-col items-stretch')}>
          {showExitDemo && onExitDemo && (
            <button
              type="button"
              onClick={onExitDemo}
              title="Exit demo"
              className={cn(
                'flex items-center text-sm font-medium text-foreground-secondary hover:text-gold hover:bg-gold/10 rounded-2xl transition-colors',
                expanded ? 'gap-2 w-full px-3 py-3' : 'justify-center py-3 mx-1'
              )}
            >
              <span className="text-lg leading-none" aria-hidden>
                ×
              </span>
              {expanded && 'Exit demo'}
            </button>
          )}
          {showSignOut && onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              title="Sign out"
              className={cn(
                'flex items-center text-sm font-medium text-foreground-secondary hover:text-accent rounded-2xl hover:bg-accent-soft/30 transition-colors',
                expanded ? 'gap-2 w-full px-3 py-3' : 'justify-center py-3 mx-1'
              )}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {expanded && 'Sign out'}
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
