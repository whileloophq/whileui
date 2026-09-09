import {
  createContext,
  useContext,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { tokenPx, typographyRecipe } from '../lib/recipes';

interface SegmentedControlContextValue {
  value: string;
  setValue: (value: string) => void;
  size: 'default' | 'compact';
  disabled: boolean;
}

const SegmentedControlContext = createContext<SegmentedControlContextValue>({
  value: '',
  setValue: () => {},
  size: 'default',
  disabled: false,
});

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: 'default' | 'pill';
  size?: 'default' | 'compact';
  disabled?: boolean;
  children?: ReactNode;
}

function SegmentedControl({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  variant = 'default',
  size = 'default',
  disabled = false,
  className,
  style,
  children,
  ...props
}: SegmentedControlProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;

  const setValue = (next: string) => {
    if (controlledValue === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <SegmentedControlContext.Provider value={{ value, setValue, size, disabled }}>
      <div
        role="tablist"
        className={cn('inline-flex flex-row bg-muted p-0.5', className)}
        style={{
          borderRadius: variant === 'pill' ? 9999 : tokenPx('--ui-radius-lg'),
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </SegmentedControlContext.Provider>
  );
}

export interface SegmentedControlItemProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'value'
> {
  value: string;
}

function SegmentedControlItem({
  value,
  className,
  children,
  onClick,
  style,
  ...props
}: SegmentedControlItemProps) {
  const context = useContext(SegmentedControlContext);
  const selected = context.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      disabled={context.disabled || props.disabled}
      className={cn(
        'flex min-w-0 flex-1 items-center justify-center transition-colors disabled:opacity-50',
        selected ? 'bg-background shadow-sm' : 'bg-transparent',
        className
      )}
      style={{
        minHeight: tokenPx(
          context.size === 'compact' ? '--ui-control-height-sm' : '--ui-control-height-default'
        ),
        borderRadius: tokenPx('--ui-radius-md'),
        paddingInline: tokenPx('--ui-control-padding-x-sm'),
        ...style,
      }}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) context.setValue(value);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export interface SegmentedControlItemTextProps extends HTMLAttributes<HTMLSpanElement> {}

function SegmentedControlItemText({ className, style, ...props }: SegmentedControlItemTextProps) {
  return (
    <span
      className={cn('truncate font-medium text-foreground', className)}
      style={{ ...typographyRecipe('label'), ...style }}
      {...props}
    />
  );
}

SegmentedControl.displayName = 'SegmentedControl';
SegmentedControlItem.displayName = 'SegmentedControlItem';
SegmentedControlItemText.displayName = 'SegmentedControlItemText';

export { SegmentedControl, SegmentedControlItem, SegmentedControlItemText };
