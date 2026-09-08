import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { tokenPx } from '../lib/recipes';

// Pulse only. The native Skeleton also has a shimmer band because Reanimated
// gives it one for free; a DOM shimmer needs a keyframe in a stylesheet, and
// the package deliberately ships no CSS. Add it when a screen asks for it.

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function Skeleton({ className, style, ...props }: SkeletonProps) {
  // A circular skeleton keeps its class-driven radius.
  const circular = className?.includes('rounded-full') ?? false;

  return (
    <div
      aria-hidden
      className={cn('animate-pulse bg-muted', className)}
      style={{ ...(circular ? null : { borderRadius: tokenPx('--ui-radius-md') }), ...style }}
      {...props}
    />
  );
}

Skeleton.displayName = 'Skeleton';

export { Skeleton };
