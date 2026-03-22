'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';
import { Home, LayoutGrid, Bookmark, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { SIDEBAR_EXPANDED_PX, SIDEBAR_RAIL_PX } from '@/lib/appShellLayout';
import { cn } from '@/lib/utils';

const RAIL_PX = SIDEBAR_RAIL_PX;
const EXPANDED_PX = SIDEBAR_EXPANDED_PX;

const links = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/resources', label: 'Resource hub', icon: LayoutGrid },
  { href: '/your-resources', label: 'Your resources', icon: Bookmark },
  { href: '/settings', label: 'Settings', icon: Settings },
];

/** Haptimize Sidebar: short delay before collapse on pointer leave */
const COLLAPSE_DELAY_MS = 100;

const easeWidth = '0.4s cubic-bezier(0.4, 0, 0.2, 1)';

/** Horizontal inset so logo / icons stay on one vertical line — never center in the strip */
const RAIL_INSET = 'pl-2 pr-2';

type Props = {
  showExitDemo?: boolean;
  onExitDemo?: () => void;
};

export function AppSidebar({ showExitDemo, onExitDemo }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const reduceMotion = useReducedMotion();
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

  const handleSignOut = () => {
    logout().then(() => router.push('/'));
  };

  const displayInitial =
    (user?.displayName?.[0] ?? user?.email?.[0] ?? (showExitDemo ? 'D' : 'U')).toUpperCase();
  const displayName = user?.displayName || user?.email?.split('@')[0] || (showExitDemo ? 'Demo' : 'User');
  const displayEmail = user?.email ?? (showExitDemo ? 'Browsing without an account' : '');

  const labelReveal: CSSProperties = {
    opacity: expanded ? 1 : 0,
    maxWidth: expanded ? 220 : 0,
    overflow: 'hidden',
    transition: reduceMotion
      ? 'none'
      : 'opacity 0.22s ease, max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <aside
      aria-label="Main navigation"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        'fixed left-0 top-0 z-50 h-screen flex flex-col overflow-x-hidden overflow-y-hidden',
        'border-r border-accent/20 bg-surface/95 backdrop-blur-xl shadow-[4px_0_28px_rgba(68,124,179,0.08)]'
      )}
      style={{
        width: expanded ? EXPANDED_PX : RAIL_PX,
        transition: reduceMotion ? 'none' : `width ${easeWidth}`,
      }}
    >
      {/* Brand — logo fixed left; text only reveals to the right */}
      <div
        className={cn(
          'flex-shrink-0 flex items-center min-h-[3.25rem] border-b border-border-light overflow-hidden',
          RAIL_INSET
        )}
      >
        <Link
          href="/home"
          className="flex items-center gap-2 min-w-0 max-w-full rounded-xl p-1 -ml-1 transition-colors duration-200 hover:bg-accent-soft/25"
        >
          <Image
            src="/cltlogo.png"
            alt="Charlotte Connect"
            width={36}
            height={36}
            className="flex-shrink-0 h-9 w-9 object-contain"
            priority
          />
          <span
            className="font-display text-sm font-semibold text-foreground whitespace-nowrap"
            style={labelReveal}
          >
            Charlotte Connect
          </span>
        </Link>
      </div>

      <nav
        className={cn(
          'flex flex-col gap-0.5 py-2 flex-1 min-h-0 min-w-0',
          'overflow-x-hidden overflow-y-auto sidebar-rail-scroll',
          RAIL_INSET
        )}
      >
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                'group flex w-full min-w-0 items-center gap-2 rounded-xl py-1 pr-1 transition-colors duration-150',
                expanded && active && 'bg-accent-soft border border-accent/25 shadow-sm',
                expanded && !active && 'border border-transparent hover:bg-accent-soft/35',
                !expanded && 'border border-transparent'
              )}
            >
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-150',
                  !expanded && active && 'bg-accent-soft ring-1 ring-accent/25 shadow-sm',
                  !expanded && !active && 'group-hover:bg-accent-soft/35'
                )}
              >
                <Icon
                  className={cn(
                    'h-[18px] w-[18px] shrink-0 transition-transform duration-200',
                    active ? 'text-accent' : 'text-foreground-secondary opacity-90',
                    !reduceMotion && 'group-hover:scale-110'
                  )}
                  strokeWidth={2}
                />
              </div>
              <span
                className={cn(
                  'min-w-0 text-sm font-semibold whitespace-nowrap',
                  active ? 'text-accent-dark' : 'text-foreground-secondary group-hover:text-foreground'
                )}
                style={labelReveal}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className={cn('border-t border-border flex-shrink-0 overflow-x-hidden min-w-0 py-3 mt-auto', RAIL_INSET)}>
        {(user || showExitDemo) && (
          <div className="flex items-center gap-2 mb-2 min-w-0 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center text-sm font-bold text-accent shrink-0">
              {displayInitial}
            </div>
            <div className="min-w-0" style={labelReveal}>
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              {displayEmail ? (
                <p className="text-xs text-foreground-muted truncate">{displayEmail}</p>
              ) : null}
            </div>
          </div>
        )}

        {showExitDemo && onExitDemo && (
          <button
            type="button"
            onClick={onExitDemo}
            title="Exit demo"
            className="group flex w-full min-w-0 items-center gap-2 rounded-xl py-1.5 pr-1 mb-1 text-sm text-foreground-secondary hover:text-gold transition-colors duration-150"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg group-hover:bg-gold/10 text-base leading-none"
              aria-hidden
            >
              ×
            </span>
            <span className="min-w-0 whitespace-nowrap" style={labelReveal}>
              Exit demo
            </span>
          </button>
        )}

        {user ? (
          <button
            type="button"
            onClick={handleSignOut}
            title="Sign out"
            className="group flex w-full min-w-0 items-center gap-2 rounded-xl py-1.5 pr-1 text-sm text-foreground-secondary hover:text-error transition-colors duration-150"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg group-hover:bg-error/10">
              <LogOut className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
            </span>
            <span className="min-w-0 whitespace-nowrap" style={labelReveal}>
              Sign out
            </span>
          </button>
        ) : null}
      </div>
    </aside>
  );
}
