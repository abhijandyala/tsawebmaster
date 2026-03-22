'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'gold' | 'forest' | 'outline' | 'success' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-surface-muted text-foreground-secondary border border-border',
    accent: 'bg-accent-soft text-accent-dark border border-accent/25',
    gold: 'bg-gold/20 text-foreground border border-gold/40',
    forest: 'bg-primary/10 text-primary border border-primary/20',
    outline: 'bg-transparent text-foreground-secondary border border-border',
    success: 'bg-success-light text-success border border-success/25',
    warning: 'bg-warning-light text-warning border border-warning/30',
  };
  const sizes: Record<NonNullable<BadgeProps['size']>, string> = {
    sm: 'px-2.5 py-0.5 text-xs rounded-lg',
    md: 'px-3 py-1 text-sm rounded-lg',
  };

  return (
    <span className={cn('inline-flex items-center font-semibold', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
