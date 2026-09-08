import React, { type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import { fieldRecipe, tokenPx, typographyRecipe } from '../lib/recipes';

const inputVariants = tv({
  base: 'flex w-full flex-row items-center bg-muted text-foreground',
  variants: {
    variant: {
      default: 'border-border focus-within:border-primary',
      error: 'border-destructive',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>,
    VariantProps<typeof inputVariants> {
  /** Leading slot — usually an icon. */
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Applied to the shell; `inputClassName` reaches the field itself. */
  className?: string;
  inputClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputClassName, prefix, suffix, variant, disabled, style, ...props }, ref) => {
    const slotPadding = `max(8px, calc(var(--ui-control-padding-x-default) * 0.5px))`;

    return (
      <div
        className={cn(inputVariants({ variant }), disabled && 'opacity-50', className)}
        style={{
          ...fieldRecipe('default'),
          paddingBlock: 0,
          borderRadius: tokenPx('--ui-radius-lg'),
          borderStyle: 'solid',
          ...style,
        }}
      >
        {prefix && (
          <span className="flex shrink-0 items-center" style={{ paddingRight: slotPadding }}>
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
            inputClassName
          )}
          style={{
            ...typographyRecipe('label'),
            paddingBlock: tokenPx('--ui-control-padding-y-default'),
          }}
          {...props}
        />
        {suffix && (
          <span className="flex shrink-0 items-center" style={{ paddingLeft: slotPadding }}>
            {suffix}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
