import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../../lib/cn';

// DOM AppShell, same slots as the native block. `loading` swaps only the
// content so chrome never pops in after data. Bottom nav is `sticky`, not
// `fixed`: iOS settles fixed elements only after a scroll ends, so a fixed dock
// drifts mid-flick. `safeArea` pads the nav rail; the Header owns the top inset.

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  bottomNav?: ReactNode;
  safeArea?: boolean;
  loading?: boolean;
  skeleton?: ReactNode;
  /** Classes for the content column — gutters, max width, vertical padding. */
  contentClassName?: string;
}

export function AppShell({
  header,
  footer,
  bottomNav,
  safeArea = true,
  loading = false,
  skeleton,
  contentClassName,
  className,
  children,
  ...props
}: AppShellProps) {
  return (
    <div
      className={cn('flex min-h-dvh flex-col bg-background text-foreground', className)}
      {...props}
    >
      {header}
      <main className={cn('min-w-0 flex-1', contentClassName)}>
        {loading ? (skeleton ?? null) : children}
      </main>
      {footer}
      {bottomNav && (
        <div
          className="sticky bottom-0 z-30"
          style={safeArea ? { paddingBottom: 'env(safe-area-inset-bottom)' } : undefined}
        >
          {bottomNav}
        </div>
      )}
    </div>
  );
}

AppShell.displayName = 'AppShell';
