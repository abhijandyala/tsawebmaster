'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'accent' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium';

  const variants = {
    default: 'bg-background-alt text-foreground-secondary',
    success: 'bg-success/10 text-success',
    warning: 'bg-gold/10 text-gold',
    accent: 'bg-accent/15 text-accent',
    outline: 'border border-border text-foreground-secondary',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
