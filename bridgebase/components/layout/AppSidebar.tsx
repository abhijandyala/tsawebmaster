'use client';

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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/resources', label: 'Resource hub', icon: LayoutGrid },
  { href: '/your-resources', label: 'Your resources', icon: Bookmark },
  { href: '/request-resource', label: 'Request resource', icon: LifeBuoy },
  { href: '/settings', label: 'Settings', icon: Settings },
];

type Props = {
  onSignOut?: () => void;
  showSignOut?: boolean;
  showExitDemo?: boolean;
  onExitDemo?: () => void;
};

export function AppSidebar({ onSignOut, showSignOut, showExitDemo, onExitDemo }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 flex flex-col min-h-screen border-r border-border bg-surface/90 backdrop-blur-xl shadow-[4px_0_24px_rgba(68,124,179,0.06)]">
      <div className="p-4 border-b border-border-light">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Navigate</p>
      </div>
      <nav className="p-3 flex flex-col gap-1 flex-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <motion.div key={href} whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold transition-colors relative',
                  active
                    ? 'bg-accent-soft text-accent-dark border border-accent/25 shadow-sm'
                    : 'text-foreground-secondary hover:text-foreground hover:bg-surface-muted border border-transparent'
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-accent" />
                )}
                <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-accent' : 'opacity-80')} />
                <span className="pl-0.5">{label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
      {(showExitDemo || (showSignOut && onSignOut)) && (
        <div className="p-3 border-t border-border space-y-1 mt-auto">
          {showExitDemo && onExitDemo && (
            <button
              type="button"
              onClick={onExitDemo}
              className="flex items-center gap-2 w-full px-3 py-3 text-sm font-medium text-foreground-secondary hover:text-gold hover:bg-gold/10 rounded-2xl transition-colors"
            >
              Exit demo
            </button>
          )}
          {showSignOut && onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="flex items-center gap-2 w-full px-3 py-3 text-sm font-medium text-foreground-secondary hover:text-accent rounded-2xl hover:bg-accent-soft/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
