import React, { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import { surfacePadding, surfaceRadius, tokenPx, typographyRecipe } from '../lib/recipes';

const alertVariants = tv({
  base: 'w-full border',
  variants: {
    variant: {
      default: 'border-border bg-background',
      destructive: 'border-destructive-soft-border bg-destructive-soft',
      success: 'border-success-soft-border bg-success-soft',
      warning: 'border-warning-soft-border bg-warning-soft',
      info: 'border-info-soft-border bg-info-soft',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  /** Leading slot. Given one, the alert lays out icon and content itself. */
  icon?: ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, style, children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      style={{
        ...surfacePadding('sm'),
        borderRadius: surfaceRadius('lg'),
        borderWidth: tokenPx('--ui-border-width-hairline'),
        ...style,
      }}
      {...props}
    >
      {icon ? (
        <div className="flex flex-row items-center gap-2.5">
          <span className="flex shrink-0 items-center">{icon}</span>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      ) : (
        children
      )}
    </div>
  )
);

Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, style, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('mb-1 font-semibold text-foreground', className)}
      style={{ ...typographyRecipe('body'), ...style }}
      {...props}
    />
  )
);

AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, style, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-muted-foreground', className)}
    style={{ ...typographyRecipe('label'), ...style }}
    {...props}
  />
));

AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription, alertVariants };
