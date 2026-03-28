'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { DemoProvider } from '@/contexts/demo-context';
import { PageTransitionProvider } from '@/contexts/page-transition-context';
import { NavigationTransitionBridge } from '@/components/layout/NavigationTransitionBridge';
import { GoogleTranslateMount } from '@/components/translate/GoogleTranslateMount';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <DemoProvider>
          <PageTransitionProvider>
            <GoogleTranslateMount />
            <NavigationTransitionBridge />
            {children}
          </PageTransitionProvider>
        </DemoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
