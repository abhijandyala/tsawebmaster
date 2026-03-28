import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Editorial section label — bar + sentence case (not shouty all-caps). */
export function SectionEyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 text-sm font-medium tracking-tight text-foreground-secondary',
        className
      )}
    >
      <span className="h-px w-10 shrink-0 bg-gold" aria-hidden />
      {children}
    </p>
  );
}
