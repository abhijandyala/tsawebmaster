'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { DemoProvider } from '@/contexts/demo-context';
import { PageTransitionProvider } from '@/contexts/page-transition-context';
import { NavigationTransitionBridge } from '@/components/layout/NavigationTransitionBridge';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <DemoProvider>
          <PageTransitionProvider>
            <NavigationTransitionBridge />
            {children}
          </PageTransitionProvider>
        </DemoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
