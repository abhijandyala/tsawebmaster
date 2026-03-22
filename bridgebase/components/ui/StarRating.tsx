'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarRatingDisplay({
  value,
  className,
  size = 'sm',
}: {
  value: number;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const v = Math.min(5, Math.max(0, value));
  const full = Math.floor(v);
  const half = v - full >= 0.5 && full < 5;
  const s = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5" aria-label={`${v} out of 5 stars`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = i < full || (i === full && half);
          const onlyHalf = i === full && half;
          return (
            <span key={i} className="relative inline-flex">
              <Star className={cn(s, 'text-border')} strokeWidth={1.5} />
              {filled && (
                <Star
                  className={cn(s, 'absolute inset-0 text-gold fill-gold')}
                  strokeWidth={1.5}
                  style={onlyHalf ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
                />
              )}
            </span>
          );
        })}
      </div>
      <span className="text-sm font-medium text-foreground tabular-nums">
        {v.toFixed(1)}
      </span>
    </div>
  );
}

export function StarRatingInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}) {
  const steps = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  return (
    <div className="flex flex-wrap gap-1">
      {steps.map((step) => (
        <button
          key={step}
          type="button"
          disabled={disabled}
          onClick={() => onChange(step)}
          className={cn(
            'px-2 py-1 text-xs rounded-md border transition-colors',
            value === step
              ? 'bg-primary text-white border-primary'
              : 'bg-surface border-border text-foreground-secondary hover:border-accent'
          )}
        >
          {step}
        </button>
      ))}
    </div>
  );
}
