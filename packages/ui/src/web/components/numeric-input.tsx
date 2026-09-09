import React, { type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { fieldRecipe, tokenPx, typographyRecipe } from '../lib/recipes';

// A number field, not a text field that happens to hold digits: `value` and
// `onValueChange` are numbers, and an empty field is `null` rather than "".
export interface NumericInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'type' | 'size' | 'prefix'
> {
  value?: number | null;
  defaultValue?: number;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: 'default' | 'compact';
  prefix?: ReactNode;
  suffix?: ReactNode;
  className?: string;
  inputClassName?: string;
  /** Drop the shell to embed inside another field. */
  unstyled?: boolean;
}

const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      min,
      max,
      step,
      size = 'default',
      prefix,
      suffix,
      className,
      inputClassName,
      unstyled = false,
      disabled,
      style,
      ...props
    },
    ref
  ) => (
    <div
      className={cn(
        'flex flex-row items-center',
        !unstyled && 'border border-border bg-muted focus-within:border-primary',
        disabled && 'opacity-50',
        className
      )}
      style={
        unstyled
          ? style
          : {
              ...fieldRecipe(size === 'compact' ? 'sm' : 'default'),
              paddingBlock: 0,
              borderStyle: 'solid',
              ...style,
            }
      }
    >
      {prefix && <span className="flex shrink-0 items-center pr-1.5">{prefix}</span>}
      <input
        ref={ref}
        type="number"
        inputMode="decimal"
        value={value == null ? '' : String(value)}
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(event) => {
          const raw = event.target.value;
          if (raw === '') {
            onValueChange?.(null);
            return;
          }
          const parsed = Number(raw);
          if (!Number.isNaN(parsed)) onValueChange?.(parsed);
        }}
        className={cn(
          // The spinners are noise next to a segmented unit control.
          'min-w-0 flex-1 bg-transparent text-foreground outline-none [appearance:textfield] placeholder:text-muted-foreground disabled:cursor-not-allowed [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          inputClassName
        )}
        style={{
          ...typographyRecipe('label'),
          paddingBlock: tokenPx('--ui-control-padding-y-default'),
        }}
        {...props}
      />
      {suffix && <span className="flex shrink-0 items-center pl-1.5">{suffix}</span>}
    </div>
  )
);

NumericInput.displayName = 'NumericInput';

export { NumericInput };
