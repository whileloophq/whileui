import React, { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { typographyRecipe } from '../lib/recipes';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Rendered centred in the rule — "or" between a form and social sign-in. */
  label?: ReactNode;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', label, ...props }, ref) => {
    if (label !== undefined && orientation === 'horizontal') {
      return (
        <div ref={ref} className={cn('flex w-full items-center gap-3', className)} {...props}>
          <span className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground" style={typographyRecipe('label')}>
            {label}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          'bg-border',
          orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';

export { Separator };
