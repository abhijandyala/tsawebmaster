'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getDemoMode } from '@/lib/demoMode';

type DemoContextValue = {
  isDemo: boolean;
  hydrated: boolean;
};

const DemoContext = createContext<DemoContextValue>({
  isDemo: false,
  hydrated: false,
});

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemo, setIsDemo] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIsDemo(getDemoMode());
    setHydrated(true);
  }, []);

  const value = useMemo(() => ({ isDemo, hydrated }), [isDemo, hydrated]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  return useContext(DemoContext);
}
