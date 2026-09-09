import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../../lib/cn';
import { hardwareBack } from '../../platform';
import { surfaceRadius, tokenPx, typographyRecipe } from '../../lib/recipes';

// A panel over the screen: `bottom` for a partial sheet, `full` for what a
// native app would push as a screen. Escape, the backdrop and the Android back
// button all dismiss, and the panel owns its safe-area padding — the reason
// every app was doing inset arithmetic by hand.

export type SheetPresentation = 'bottom' | 'full';

export interface SheetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  onClose: () => void;
  presentation?: SheetPresentation;
  /** Rendered in the sticky header beside the close control. */
  title?: ReactNode;
  /** Header slot on the trailing side — actions belonging to the panel. */
  actions?: ReactNode;
  children?: ReactNode;
}

export function Sheet({
  open,
  onClose,
  presentation = 'bottom',
  title,
  actions,
  className,
  children,
  ...props
}: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const releaseBack = hardwareBack.onBack(() => {
      onClose();
      return true;
    });
    // The page behind must not scroll under the panel.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      releaseBack();
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const full = presentation === 'full';

  return (
    <div className="fixed inset-0 z-40 flex flex-col" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={cn('absolute inset-0 cursor-default bg-overlay', full && 'bg-background')}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          'relative flex flex-col overflow-hidden bg-background outline-none',
          full
            ? 'h-full w-full'
            : 'mt-auto max-h-[90dvh] w-full border-t border-border shadow-lg sm:mx-auto sm:max-w-lg',
          className
        )}
        style={
          full
            ? { paddingTop: 'env(safe-area-inset-top)' }
            : {
                borderTopLeftRadius: surfaceRadius('xl'),
                borderTopRightRadius: surfaceRadius('xl'),
              }
        }
        {...props}
      >
        {(title || actions) && (
          <div
            className="flex shrink-0 flex-row items-center justify-between border-b border-border px-5 py-4"
            style={{ borderBottomWidth: tokenPx('--ui-border-width-hairline') }}
          >
            <p className="font-bold text-foreground" style={typographyRecipe('body')}>
              {title}
            </p>
            <div className="flex flex-row items-center gap-3">{actions}</div>
          </div>
        )}

        <div
          className="min-h-0 flex-1 overflow-y-auto"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

Sheet.displayName = 'Sheet';
