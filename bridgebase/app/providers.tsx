'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { DemoProvider } from '@/contexts/demo-context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <DemoProvider>{children}</DemoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
