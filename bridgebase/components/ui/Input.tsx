'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  /** Trailing control (e.g. password visibility toggle); input gets extra right padding. */
  suffix?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, icon, suffix, ...props }, ref) => {
  const padLeft = icon ? 'pl-11' : 'pl-4';
  const padRight = suffix ? 'pr-11' : 'pr-4';

  const input = (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex w-full rounded-xl border-2 border-border bg-surface py-3 text-sm text-foreground placeholder:text-foreground-muted',
        'transition-shadow duration-200',
        'hover:border-accent/35',
        'focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--clt-blue)_22%,transparent)] focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        padLeft,
        padRight,
        className
      )}
      {...props}
    />
  );

  if (!icon && !suffix) return input;

  return (
    <div className="relative w-full">
      {icon ? (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none z-[1]">
          {icon}
        </span>
      ) : null}
      {input}
      {suffix ? (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center text-foreground-muted z-[1]">
          {suffix}
        </span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
