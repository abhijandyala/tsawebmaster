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
  { href: '/request-resource', label: 'Request a resource', icon: LifeBuoy },
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
    <aside className="w-56 shrink-0 border-r border-border bg-surface/80 backdrop-blur-md flex flex-col min-h-screen sticky top-0">
      <nav className="p-3 flex flex-col gap-1 flex-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <motion.div key={href} whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground-secondary hover:bg-background-alt hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4 shrink-0 opacity-90" />
                {label}
              </Link>
            </motion.div>
          );
        })}
      </nav>
      {(showExitDemo || (showSignOut && onSignOut)) && (
        <div className="p-3 border-t border-border space-y-1">
          {showExitDemo && onExitDemo && (
            <button
              type="button"
              onClick={onExitDemo}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground-secondary hover:text-foreground rounded-xl hover:bg-background-alt transition-colors"
            >
              Exit demo
            </button>
          )}
          {showSignOut && onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground-secondary hover:text-foreground rounded-xl hover:bg-background-alt transition-colors"
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
