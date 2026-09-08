import { useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { tv } from '../../lib/tv';
import { tokenPx, typographyRecipe } from '../lib/recipes';

// Same construction as the native OTPInput: the cells are presentation and one
// transparent field over them takes the typing, so autofill and the OS code
// suggestion work. The error shake runs through the Web Animations API rather
// than a keyframe, because the package ships no stylesheet.

const otpCellVariants = tv({
  base: 'flex items-center justify-center border bg-muted',
  variants: {
    size: { default: 'w-11', compact: 'w-9' },
    state: {
      idle: 'border-border',
      focused: 'border-primary',
      error: 'border-destructive',
      errorFocused: 'border-destructive',
    },
  },
  defaultVariants: { size: 'default', state: 'idle' },
});

export interface OTPInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  length?: number;
  value?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (code: string) => void;
  variant?: 'default' | 'error';
  size?: 'default' | 'compact';
  secure?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

function OTPInput({
  length = 6,
  value: controlledValue,
  onValueChange,
  onComplete,
  variant = 'default',
  size = 'default',
  secure = false,
  disabled = false,
  autoFocus = false,
  className,
  ...props
}: OTPInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = controlledValue !== undefined;
  const val = isControlled ? controlledValue : internalValue;
  const [focused, setFocused] = useState(false);
  const cellsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant !== 'error') return;
    cellsRef.current?.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 250, easing: 'linear' }
    );
  }, [variant]);

  const update = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, length);
    if (!isControlled) setInternalValue(cleaned);
    onValueChange?.(cleaned);
    if (cleaned.length === length) onComplete?.(cleaned);
  };

  const isError = variant === 'error';
  const cursorAt = focused ? Math.min(val.length, length - 1) : -1;

  return (
    <div className={cn('relative', className)} {...props}>
      <div ref={cellsRef} className="flex flex-row items-center justify-center gap-2">
        {Array.from({ length }).map((_, i) => {
          const digit = val[i];
          const isCursor = cursorAt === i;
          const state = isError
            ? isCursor
              ? 'errorFocused'
              : 'error'
            : isCursor
              ? 'focused'
              : 'idle';

          return (
            <div
              key={i}
              className={cn(otpCellVariants({ size, state }), disabled && 'opacity-50')}
              style={{
                height: tokenPx(
                  size === 'compact' ? '--ui-control-height-default' : '--ui-control-height-lg'
                ),
                borderRadius: tokenPx('--ui-radius-md'),
                borderWidth: tokenPx(
                  isCursor ? '--ui-border-width-emphasis' : '--ui-border-width-control'
                ),
                borderStyle: 'solid',
              }}
            >
              {digit ? (
                <span
                  className="font-semibold text-foreground"
                  style={typographyRecipe(size === 'compact' ? 'body' : 'emphasis')}
                >
                  {secure ? '●' : digit}
                </span>
              ) : isCursor ? (
                <span
                  className={cn(
                    'h-5 w-0.5 animate-pulse rounded-sm',
                    isError ? 'bg-destructive' : 'bg-primary'
                  )}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      <input
        // Invisible, full-size and on top: taps anywhere focus the field.
        value={val}
        onChange={(event) => update(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={length}
        autoFocus={autoFocus}
        disabled={disabled}
        aria-label={`Enter ${length}-digit verification code`}
        className="absolute inset-0 h-full w-full cursor-default bg-transparent text-center tracking-[1em] text-transparent caret-transparent outline-none disabled:cursor-not-allowed"
      />
    </div>
  );
}

OTPInput.displayName = 'OTPInput';

export { OTPInput, otpCellVariants };
