import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { Button, ButtonText } from './button';
import { hardwareBack } from '../platform';
import { surfacePadding, surfaceRadius, tokenPx, typographyRecipe } from '../lib/recipes';

// A decision, not a panel: it takes the whole screen's attention, Escape and
// the Android back button both cancel, and the backdrop does not — a stray tap
// should not answer the question for you.

interface AlertDialogContextValue {
  onOpenChange: (open: boolean) => void;
}

const AlertDialogContext = createContext<AlertDialogContextValue>({ onOpenChange: () => {} });

export interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
}

function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const releaseBack = hardwareBack.onBack(() => {
      onOpenChange(false);
      return true;
    });
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      releaseBack();
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <AlertDialogContext.Provider value={{ onOpenChange }}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-6"
        role="alertdialog"
        aria-modal="true"
      >
        <div ref={panelRef} tabIndex={-1} className="w-full max-w-sm outline-none">
          {children}
        </div>
      </div>
    </AlertDialogContext.Provider>
  );
}

export interface AlertDialogContentProps extends HTMLAttributes<HTMLDivElement> {}

function AlertDialogContent({ className, style, ...props }: AlertDialogContentProps) {
  return (
    <div
      className={cn('border border-border bg-card shadow-lg', className)}
      style={{
        ...surfacePadding('default'),
        borderRadius: surfaceRadius('xl'),
        borderWidth: tokenPx('--ui-border-width-hairline'),
        ...style,
      }}
      {...props}
    />
  );
}

function AlertDialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5', className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

function AlertDialogTitle({ className, style, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('font-semibold text-foreground', className)}
      style={{ ...typographyRecipe('emphasis'), ...style }}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  style,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-muted-foreground', className)}
      style={{ ...typographyRecipe('label'), ...style }}
      {...props}
    />
  );
}

export interface AlertDialogActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

function AlertDialogAction({ className, children, ...props }: AlertDialogActionProps) {
  return (
    <Button className={cn('w-full sm:w-auto', className)} {...props}>
      <ButtonText>{children}</ButtonText>
    </Button>
  );
}

function AlertDialogCancel({ className, children, onClick, ...props }: AlertDialogActionProps) {
  const { onOpenChange } = useContext(AlertDialogContext);

  const handleClick = useCallback<NonNullable<AlertDialogActionProps['onClick']>>(
    (event) => {
      onClick?.(event);
      if (!event.defaultPrevented) onOpenChange(false);
    },
    [onClick, onOpenChange]
  );

  return (
    <Button
      variant="outline"
      className={cn('w-full sm:w-auto', className)}
      onClick={handleClick}
      {...props}
    >
      <ButtonText>{children}</ButtonText>
    </Button>
  );
}

AlertDialog.displayName = 'AlertDialog';
AlertDialogContent.displayName = 'AlertDialogContent';
AlertDialogHeader.displayName = 'AlertDialogHeader';
AlertDialogFooter.displayName = 'AlertDialogFooter';
AlertDialogTitle.displayName = 'AlertDialogTitle';
AlertDialogDescription.displayName = 'AlertDialogDescription';
AlertDialogAction.displayName = 'AlertDialogAction';
AlertDialogCancel.displayName = 'AlertDialogCancel';

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
};
