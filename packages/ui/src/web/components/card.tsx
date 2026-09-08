import React, { type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import { surfacePadding, type SurfacePadding } from '../lib/recipes';

// DOM Card, mirroring `components/card/card.tsx`. No `frosted` yet: on the DOM a
// `backdrop-filter` also makes the element a containing block for fixed
// descendants, so overlays inside it must portal out.

const cardVariants = tv({
  base: 'border border-border bg-card text-card-foreground',
  variants: {
    padding: {
      none: '',
      sm: '',
      default: '',
      lg: '',
    },
    unstyled: {
      true: 'rounded-none border-0 bg-transparent shadow-none',
      false: '',
    },
  },
  defaultVariants: {
    padding: 'default',
    unstyled: false,
  },
});

export type ShadowTier = 'none' | 'sm' | 'md' | 'lg';

const SHADOW_CLASS: Record<ShadowTier, string> = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  /** Elevation tier; 'sm' by default, 'none' for flat cards. */
  shadow?: ShadowTier;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'default', unstyled, shadow = 'sm', style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ padding, unstyled }),
        !unstyled && SHADOW_CLASS[shadow],
        className
      )}
      style={{
        ...(unstyled ? {} : { borderRadius: 'calc(var(--ui-radius-xl) * 1px)' }),
        ...surfacePadding((padding ?? 'default') as SurfacePadding),
        ...style,
      }}
      {...props}
    />
  )
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props} />
  )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-semibold tracking-tight text-foreground', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn(className)} {...props} />
);

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-row items-center gap-2', className)} {...props} />
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
