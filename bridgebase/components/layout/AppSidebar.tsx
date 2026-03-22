'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';
import { Home, LayoutGrid, Bookmark, Settings, LifeBuoy, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

const RAIL_PX = 64;
const EXPANDED_PX = 220;

const links = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/resources', label: 'Resource hub', icon: LayoutGrid },
  { href: '/your-resources', label: 'Your resources', icon: Bookmark },
  { href: '/request-resource', label: 'Request resource', icon: LifeBuoy },
  { href: '/settings', label: 'Settings', icon: Settings },
];

/** Haptimize Sidebar: short delay before collapse on pointer leave */
const COLLAPSE_DELAY_MS = 100;

const easeWidth = '0.4s cubic-bezier(0.4, 0, 0.2, 1)';
const easeSpringish = 'transform 500ms cubic-bezier(0.25, 0.1, 0.25, 1), background-color 150ms ease, color 150ms ease';

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

  return (
    <aside
      aria-label="Main navigation"
      aria-expanded={expanded}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        'fixed left-0 top-0 z-50 h-screen flex flex-col overflow-hidden',
        'border-r border-accent/20 bg-surface/95 backdrop-blur-xl shadow-[4px_0_28px_rgba(68,124,179,0.08)]'
      )}
      style={{
        width: expanded ? EXPANDED_PX : RAIL_PX,
        transition: reduceMotion ? 'none' : `width ${easeWidth}`,
      }}
    >
      {/* Brand row — Haptimize: logo + title fades with width */}
      <div className="flex-shrink-0 flex items-center overflow-hidden pl-3 pr-2 pt-4 pb-3 gap-2 border-b border-border-light">
        <Link
          href="/home"
          className="flex items-center gap-2.5 min-w-0 rounded-xl -m-1 p-1"
          style={{
            transition: reduceMotion ? undefined : easeSpringish,
          }}
          onMouseEnter={(e) => {
            if (!reduceMotion) e.currentTarget.style.transform = 'scale(1.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Image
            src="/cltlogo.png"
            alt="Charlotte Connect"
            width={36}
            height={36}
            className="flex-shrink-0 h-9 w-auto"
            priority
          />
          <span
            className="font-display text-sm font-semibold text-foreground whitespace-nowrap transition-all duration-300"
            style={{
              opacity: expanded ? 1 : 0,
              maxWidth: expanded ? 200 : 0,
              overflow: 'hidden',
            }}
          >
            Charlotte Connect
          </span>
        </Link>
      </div>

      <nav className="flex flex-col gap-1 px-2.5 pt-3 flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className="flex items-center w-full py-2 min-w-0 group"
              onMouseEnter={(e) => {
                if (reduceMotion) return;
                const inner = e.currentTarget.firstElementChild as HTMLElement | null;
                if (inner) inner.style.transform = 'scale(1.06)';
              }}
              onMouseLeave={(e) => {
                const inner = e.currentTarget.firstElementChild as HTMLElement | null;
                if (inner) inner.style.transform = 'scale(1)';
              }}
            >
              <div
                className={cn(
                  'flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-semibold min-w-0',
                  expanded ? 'flex-1' : 'w-11 flex-none justify-center',
                  active
                    ? 'bg-accent-soft text-accent-dark border border-accent/25 shadow-sm'
                    : 'text-foreground-secondary border border-transparent group-hover:bg-accent-soft/35 group-hover:text-foreground'
                )}
                style={{ transition: reduceMotion ? 'background-color 150ms ease, color 150ms ease' : easeSpringish }}
              >
                <Icon className={cn('w-[18px] h-[18px] flex-shrink-0', active ? 'text-accent' : 'opacity-85')} />
                <span
                  className="whitespace-nowrap overflow-hidden transition-opacity duration-300"
                  style={{
                    opacity: expanded ? 1 : 0,
                    width: expanded ? 'auto' : 0,
                  }}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="flex-1 min-h-2" />

      <div className="border-t border-border flex-shrink-0 pl-2 pr-2.5 py-4">
        {(user || showExitDemo) && (
          <div className="flex items-center gap-2.5 mb-3 overflow-hidden min-w-0">
            <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center text-sm font-bold text-accent flex-shrink-0">
              {displayInitial}
            </div>
            <div
              className="flex-1 min-w-0 transition-opacity duration-300"
              style={{
                opacity: expanded ? 1 : 0,
                width: expanded ? 'auto' : 0,
                overflow: 'hidden',
              }}
            >
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
            className="flex items-center gap-2 py-2 pl-1.5 pr-2 w-full text-sm text-foreground-secondary hover:text-gold rounded-xl cursor-pointer min-w-0 mb-1"
            style={{
              transition: reduceMotion ? 'color 150ms ease' : easeSpringish,
            }}
            onMouseEnter={(e) => {
              if (!reduceMotion) e.currentTarget.style.transform = 'scale(1.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span className="text-base leading-none w-[18px] text-center flex-shrink-0" aria-hidden>
              ×
            </span>
            <span
              className="whitespace-nowrap overflow-hidden transition-opacity duration-300"
              style={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}
            >
              Exit demo
            </span>
          </button>
        )}

        {user ? (
          <button
            type="button"
            onClick={handleSignOut}
            title="Sign out"
            className="flex items-center gap-2 py-2 pl-1.5 pr-2 w-full text-sm text-foreground-secondary hover:text-error rounded-xl cursor-pointer min-w-0"
            style={{
              transition: reduceMotion ? 'color 150ms ease' : easeSpringish,
            }}
            onMouseEnter={(e) => {
              if (!reduceMotion) e.currentTarget.style.transform = 'scale(1.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            <span
              className="whitespace-nowrap overflow-hidden transition-opacity duration-300"
              style={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}
            >
              Sign out
            </span>
          </button>
        ) : null}
      </div>
    </aside>
  );
}
