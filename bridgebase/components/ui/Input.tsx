'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, icon, ...props }, ref) => {
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
        icon ? 'pl-11 pr-4' : 'px-4',
        className
      )}
      {...props}
    />
  );

  if (!icon) return input;

  return (
    <div className="relative w-full">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none">
        {icon}
      </span>
      {input}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
