'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, isLoading, disabled, type = 'button', ...props }, ref) => {
    const base = cn(
      'inline-flex items-center justify-center font-semibold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-45 disabled:pointer-events-none',
      variant !== 'link' &&
        'transition-[transform,box-shadow,background-color] duration-200 ease-out enabled:hover:-translate-y-px enabled:hover:shadow-md enabled:active:translate-y-0'
    );

    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary:
        'bg-primary text-white shadow-md hover:bg-primary-dark border border-transparent',
      secondary:
        'bg-surface-muted text-foreground border border-border hover:border-accent/40 hover:bg-accent-soft/30',
      accent:
        'bg-accent text-white shadow-md hover:bg-accent-dark border border-transparent',
      outline:
        'bg-transparent text-foreground border-2 border-accent/50 hover:bg-accent-soft/40 hover:border-accent',
      ghost: 'bg-transparent text-foreground-secondary hover:text-accent hover:bg-accent-soft/25',
      danger: 'bg-error text-white hover:opacity-90 border border-transparent shadow-sm',
      link: 'bg-transparent text-accent underline-offset-4 hover:underline p-0 h-auto shadow-none border-0',
    };

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'h-9 px-4 text-sm gap-1.5 rounded-lg',
      md: 'h-11 px-6 text-sm gap-2 rounded-lg',
      lg: 'h-14 px-8 text-base gap-2 rounded-lg',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(base, variants[variant], variant !== 'link' && sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
