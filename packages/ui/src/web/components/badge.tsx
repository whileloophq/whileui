import { createContext, useContext, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import { tokenPx, typographyRecipe } from '../lib/recipes';

const badgeVariants = tv({
  base: 'inline-flex items-center',
  variants: {
    variant: {
      default: 'bg-primary',
      secondary: 'bg-secondary',
      destructive: 'bg-destructive',
      outline: 'border border-border bg-transparent',
      success: 'bg-success',
      warning: 'bg-warning',
      info: 'bg-info',
      soft: 'bg-primary-soft',
      'soft-secondary': 'bg-secondary-soft',
      'soft-destructive': 'bg-destructive-soft',
      'soft-success': 'bg-success-soft',
      'soft-warning': 'bg-warning-soft',
      'soft-info': 'bg-info-soft',
    },
  },
  defaultVariants: { variant: 'default' },
});

const badgeTextVariants = tv({
  base: 'font-semibold',
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
      success: 'text-success-foreground',
      warning: 'text-warning-foreground',
      info: 'text-info-foreground',
      soft: 'text-primary',
      'soft-secondary': 'text-secondary-foreground',
      'soft-destructive': 'text-destructive',
      'soft-success': 'text-success',
      'soft-warning': 'text-warning',
      'soft-info': 'text-info',
    },
  },
  defaultVariants: { variant: 'default' },
});

interface BadgeContextValue {
  variant: VariantProps<typeof badgeVariants>['variant'];
}

const BadgeContext = createContext<BadgeContextValue>({ variant: 'default' });

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export interface BadgeTextProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeTextVariants> {}

function Badge({ className, variant = 'default', children, style, ...props }: BadgeProps) {
  return (
    <BadgeContext.Provider value={{ variant }}>
      <span
        className={cn(badgeVariants({ variant }), className)}
        style={{
          borderRadius: tokenPx('--ui-badge-radius'),
          paddingInline: tokenPx('--ui-badge-padding-x'),
          paddingBlock: tokenPx('--ui-badge-padding-y'),
          ...style,
        }}
        {...props}
      >
        {children}
      </span>
    </BadgeContext.Provider>
  );
}

function BadgeText({ className, variant: variantProp, style, ...props }: BadgeTextProps) {
  const context = useContext(BadgeContext);
  const variant = variantProp ?? context.variant;

  return (
    <span
      className={cn(badgeTextVariants({ variant }), className)}
      style={{ ...typographyRecipe('caption'), ...style }}
      {...props}
    />
  );
}

Badge.displayName = 'Badge';
BadgeText.displayName = 'BadgeText';

export { Badge, BadgeText, badgeVariants, badgeTextVariants };
