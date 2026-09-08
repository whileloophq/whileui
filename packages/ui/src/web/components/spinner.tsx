import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

// The native Spinner asks the theme for a colour because `ActivityIndicator`
// takes one. In the DOM it inherits `currentColor`, so a spinner inside a
// primary button is already the right colour with nothing passed.

const SIZES = { sm: 'size-4 border-2', default: 'size-5 border-2', lg: 'size-8 border-[3px]' };

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  size?: keyof typeof SIZES;
  /** Overrides the inherited colour. */
  color?: string;
  label?: string;
}

function Spinner({
  className,
  size = 'default',
  color,
  label = 'Loading',
  ...props
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block animate-spin rounded-full border-current border-t-transparent',
        SIZES[size],
        className
      )}
      style={color ? { color } : undefined}
      {...props}
    />
  );
}

Spinner.displayName = 'Spinner';

export { Spinner };
