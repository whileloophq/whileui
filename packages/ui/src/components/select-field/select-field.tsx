import React from 'react';
import { FormField, FormHint, FormLabel, FormMessage } from '../form-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIcon,
  SelectTrigger,
  SelectValue,
} from '../select';

export interface SelectFieldOption {
  /** May be `''`, for a choice such as "None" or "All". */
  value: string;
  label: string;
  /** Leading icon in the list. */
  icon?: React.ReactNode;
}

export interface SelectFieldProps {
  /** Visible label over the trigger; also names it for screen readers. */
  label: string;
  /** The chosen option's value. */
  value: string;
  options: SelectFieldOption[];
  onValueChange: (value: string) => void;
  /** Shown when `value` matches no option. @default 'Choose' */
  placeholder?: string;
  /** Help under the field. */
  hint?: string;
  /** An error under the field; marks it invalid. */
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

/**
 * The Select primitive treats an empty value as "nothing chosen", so an option whose
 * value is `''` travels under this sentinel and comes back as `''`.
 */
const EMPTY = '__whileui_empty__';
const toInner = (value: string) => (value === '' ? EMPTY : value);
const fromInner = (value: string) => (value === EMPTY ? '' : value);

/** A labelled single choice from a list of `{ value, label }` options. */
export function SelectField({
  label,
  value,
  options,
  onValueChange,
  placeholder = 'Choose',
  hint,
  error,
  disabled = false,
  required = false,
  className,
}: SelectFieldProps) {
  const selected = options.find((option) => option.value === value);
  return (
    <FormField
      invalid={Boolean(error)}
      disabled={disabled}
      required={required}
      className={className}
    >
      <FormLabel>{label}</FormLabel>
      <Select
        value={selected ? { value: toInner(selected.value), label: selected.label } : undefined}
        onValueChange={(option) => option && onValueChange(fromInner(option.value))}
        disabled={disabled}
      >
        {/* Label and choice together: a label alone would replace the trigger's text,
            and a screen reader would never hear what is chosen. */}
        <SelectTrigger
          className="w-full"
          accessibilityLabel={`${label}, ${selected?.label ?? placeholder}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="w-full">
          {options.map((option) => (
            <SelectItem
              key={toInner(option.value)}
              value={toInner(option.value)}
              label={option.label}
            >
              {option.icon ? <SelectItemIcon>{option.icon}</SelectItemIcon> : null}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? <FormMessage>{error}</FormMessage> : hint ? <FormHint>{hint}</FormHint> : null}
    </FormField>
  );
}
