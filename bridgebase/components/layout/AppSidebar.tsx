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
        'fixed left-0 top-0 z-50 h-screen flex flex-col overflow-x-hidden overflow-y-hidden',
        'border-r border-accent/20 bg-surface/95 backdrop-blur-xl shadow-[4px_0_28px_rgba(68,124,179,0.08)]'
      )}
      style={{
        width: expanded ? EXPANDED_PX : RAIL_PX,
        transition: reduceMotion ? 'none' : `width ${easeWidth}`,
      }}
    >
      {/* Brand — keep within rail when collapsed (no horizontal overflow) */}
      <div className="flex-shrink-0 flex items-center justify-center min-h-[3.25rem] border-b border-border-light overflow-hidden px-1.5">
        <Link
          href="/home"
          className={cn(
            'flex items-center rounded-xl p-1 min-w-0 max-w-full',
            expanded ? 'gap-2 justify-start w-full' : 'justify-center'
          )}
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
            className="flex-shrink-0 h-9 w-9 object-contain"
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

      <nav
        className={cn(
          'flex flex-col gap-1 py-2 flex-1 min-h-0 min-w-0',
          'overflow-x-hidden overflow-y-auto sidebar-rail-scroll',
          expanded ? 'px-2' : 'px-1'
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
                'group flex w-full min-w-0 max-w-full',
                expanded ? 'justify-stretch px-0' : 'justify-center'
              )}
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
                  'flex items-center rounded-xl text-sm font-semibold box-border border',
                  expanded
                    ? 'min-h-10 w-full min-w-0 gap-2.5 px-3 py-2'
                    : 'h-10 w-10 shrink-0 justify-center p-0 mx-auto',
                  active
                    ? 'bg-accent-soft text-accent-dark border-accent/25 shadow-sm'
                    : 'text-foreground-secondary border-transparent group-hover:bg-accent-soft/35 group-hover:text-foreground'
                )}
                style={{ transition: reduceMotion ? 'background-color 150ms ease, color 150ms ease' : easeSpringish }}
              >
                <Icon className={cn('w-[18px] h-[18px] shrink-0', active ? 'text-accent' : 'opacity-85')} strokeWidth={2} />
                <span
                  className="whitespace-nowrap overflow-hidden transition-opacity duration-300"
                  style={{
                    opacity: expanded ? 1 : 0,
                    maxWidth: expanded ? 200 : 0,
                  }}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border flex-shrink-0 overflow-x-hidden min-w-0 py-3 px-1.5 mt-auto">
        {(user || showExitDemo) && (
          <div
            className={cn(
              'flex items-center gap-2 mb-2 min-w-0 overflow-hidden',
              expanded ? 'justify-start' : 'justify-center'
            )}
          >
            <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center text-sm font-bold text-accent shrink-0">
              {displayInitial}
            </div>
            <div
              className="flex-1 min-w-0 transition-opacity duration-300"
              style={{
                opacity: expanded ? 1 : 0,
                maxWidth: expanded ? 200 : 0,
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
            className={cn(
              'flex items-center text-sm text-foreground-secondary hover:text-gold rounded-xl cursor-pointer min-w-0 w-full mb-1',
              expanded ? 'gap-2 py-2 px-2 justify-start' : 'h-10 justify-center p-0'
            )}
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
            <span className="text-base leading-none w-[18px] text-center shrink-0" aria-hidden>
              ×
            </span>
            <span
              className="whitespace-nowrap overflow-hidden transition-opacity duration-300"
              style={{ opacity: expanded ? 1 : 0, maxWidth: expanded ? 200 : 0 }}
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
            className={cn(
              'flex items-center text-sm text-foreground-secondary hover:text-error rounded-xl cursor-pointer min-w-0 w-full',
              expanded ? 'gap-2 py-2 px-2 justify-start' : 'h-10 justify-center p-0'
            )}
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
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <span
              className="whitespace-nowrap overflow-hidden transition-opacity duration-300"
              style={{ opacity: expanded ? 1 : 0, maxWidth: expanded ? 200 : 0 }}
            >
              Sign out
            </span>
          </button>
        ) : null}
      </div>
    </aside>
  );
}
