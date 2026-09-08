import React, { type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';

const progressVariants = tv({
  base: 'w-full overflow-hidden rounded-full bg-secondary',
  variants: {
    size: { sm: 'h-1.5', default: 'h-3', lg: 'h-5' },
  },
  defaultVariants: { size: 'default' },
});

export interface ProgressProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof progressVariants> {
  /** 0–100; clamped. */
  value?: number;
  indicatorClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, size, indicatorClassName, ...props }, ref) => {
    const clamped = Math.max(0, Math.min(100, value));

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        className={cn(progressVariants({ size }), className)}
        {...props}
      >
        <div
          className={cn('h-full rounded-full bg-primary transition-[width]', indicatorClassName)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress, progressVariants };
