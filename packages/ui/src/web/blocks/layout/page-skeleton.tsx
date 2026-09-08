import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../../lib/cn';
import { Skeleton } from '../../components/skeleton';
import { surfacePadding, surfaceRadius, tokenPx, type SurfacePadding } from '../../lib/recipes';

// DOM mirror of `blocks/layout/page-skeleton.tsx`. The native one composes
// Stack and Row because React Native has no block layout; here flex classes
// do that job, so only the leaves are shared vocabulary.

export type PageSkeletonVariant = 'dashboard' | 'list' | 'settings' | 'card' | 'generic';
export type PageSkeletonHeaderPlaceholder = 'compact' | 'default';

export interface PageSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant: PageSkeletonVariant;
  /** Rows for the list (default 3) and settings (default 4) variants. */
  count?: number;
  padding?: SurfacePadding;
  /** Real header, rendered above the placeholder content. */
  header?: ReactNode;
  /** Placeholder header, for when there is no real one to show yet. */
  headerPlaceholder?: boolean | PageSkeletonHeaderPlaceholder;
}

const cardSurface = {
  borderRadius: surfaceRadius('xl'),
  borderWidth: tokenPx('--ui-border-width-hairline'),
  borderStyle: 'solid' as const,
  ...surfacePadding('sm'),
};

const rowDivider = {
  borderBottomWidth: tokenPx('--ui-border-width-hairline'),
  borderBottomStyle: 'solid' as const,
};

function HeaderPlaceholder({ variant }: { variant: PageSkeletonHeaderPlaceholder }) {
  const compact = variant === 'compact';

  return (
    <div
      className={cn('flex items-center justify-between', compact ? 'pt-3 pb-2' : 'pt-4 pb-3')}
      style={{ paddingInline: tokenPx('--ui-surface-padding-sm') }}
    >
      <div className="flex items-center gap-3">
        <Skeleton className={cn('rounded-full', compact ? 'size-8' : 'size-10')} />
        <div className="flex flex-col gap-1">
          <Skeleton className={cn('h-3 rounded-full', compact ? 'w-24' : 'w-28')} />
          <Skeleton className={cn('h-3 rounded-full', compact ? 'w-16' : 'w-20')} />
        </div>
      </div>
      <Skeleton className={cn('rounded-full', compact ? 'size-8' : 'size-10')} />
    </div>
  );
}

function Body({ variant, count }: { variant: PageSkeletonVariant; count?: number }) {
  if (variant === 'dashboard') {
    return (
      <div className="flex flex-col gap-4">
        <div className="border-border bg-card" style={cardSurface}>
          <div className="mb-3 flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-4/5" />
        </div>

        <div className="flex items-stretch gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 border-border bg-card" style={cardSurface}>
              <Skeleton className="mb-2 h-3 w-2/3" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ))}
        </div>

        <Skeleton className="h-4 w-1/3" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3"
            style={{ paddingBlock: tokenPx('--ui-control-padding-y-default') }}
          >
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-5 w-1/3" />
        {Array.from({ length: count ?? 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-border"
            style={{ ...rowDivider, paddingBottom: tokenPx('--ui-surface-padding-sm') }}
          >
            <Skeleton className="size-12 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'settings') {
    return (
      <div className="flex flex-col">
        {Array.from({ length: count ?? 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-border"
            style={{ ...rowDivider, paddingBlock: tokenPx('--ui-surface-padding-sm') }}
          >
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className="overflow-hidden border-border bg-card"
        style={{
          borderRadius: surfaceRadius('xl'),
          borderWidth: tokenPx('--ui-border-width-hairline'),
          borderStyle: 'solid',
          ...surfacePadding('sm'),
        }}
      >
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-6 w-1/2" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

export function PageSkeleton({
  variant,
  count,
  padding = 'default',
  header,
  headerPlaceholder = false,
  className,
  ...props
}: PageSkeletonProps) {
  return (
    <div className={cn('w-full', className)} {...props}>
      {header}
      {!header && headerPlaceholder && (
        <HeaderPlaceholder variant={headerPlaceholder === 'compact' ? 'compact' : 'default'} />
      )}
      <div style={surfacePadding(padding)}>
        <Body variant={variant} count={count} />
      </div>
    </div>
  );
}

PageSkeleton.displayName = 'PageSkeleton';
