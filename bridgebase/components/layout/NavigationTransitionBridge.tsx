'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { usePageTransition } from '@/contexts/page-transition-context';

/**
 * Dismisses the overlay after navigation settles (Haptimize-style), including first paint.
 */
export function NavigationTransitionBridge() {
  const pathname = usePathname();
  const { endTransition } = usePageTransition();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      endTransition();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, endTransition]);

  return null;
}
