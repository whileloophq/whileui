import React, { type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import { tokenPx, typographyRecipe, type TypographyRole } from '../lib/recipes';

const textareaVariants = tv({
  base: 'w-full resize-y bg-muted text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    variant: {
      default: 'border-border focus:border-primary',
      error: 'border-destructive',
    },
  },
  defaultVariants: { variant: 'default' },
});

const TEXT_ROLE: Record<string, TypographyRole> = {
  default: 'label',
  sm: 'caption',
  lg: 'body',
};

const MIN_HEIGHT = {
  default: '--ui-textarea-min-height-default',
  sm: '--ui-textarea-min-height-sm',
  lg: '--ui-textarea-min-height-lg',
};

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaVariants> {
  size?: keyof typeof MIN_HEIGHT;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size = 'default', variant, style, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn('border', textareaVariants({ variant }), className)}
      style={{
        ...typographyRecipe(TEXT_ROLE[size] ?? 'label'),
        minHeight: tokenPx(MIN_HEIGHT[size]),
        borderWidth: tokenPx('--ui-border-width-control'),
        borderStyle: 'solid',
        borderRadius: tokenPx('--ui-radius-lg'),
        paddingInline: tokenPx('--ui-control-padding-x-default'),
        paddingBlock: tokenPx('--ui-control-padding-y-default'),
        ...style,
      }}
      {...props}
    />
  )
);

Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
