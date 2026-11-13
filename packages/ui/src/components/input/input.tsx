import React, { useState } from 'react';
import { View, TextInput, type TextInputInstance, type TextInputProps } from 'react-native';
import { cn } from '../../lib/cn';
import { focusFieldWrapper } from '../../lib/focus-ring';
import { useFieldFont } from '../../lib/font-context';
import { tv, type VariantProps } from '../../lib/tv';
import { useThemeColors } from '../../lib/theme-colors';
import { useInteractionTokens } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';
import { textCursorColors, typographyStyle } from '../../lib/recipes';
import type { ForwardRefComponent } from '../../lib/ref-types';
import { webAutofillField } from '../../lib/web-autofill';
import { fieldAccessibilityProps, useFormFieldState } from '../form-field/form-field';

const inputVariants = tv({
  base: 'w-full border-border bg-muted text-foreground',
  variants: {
    variant: {
      default: 'border-border',
      error: 'border-destructive',
      /** No border, no fill — for one large figure that is the screen's subject. */
      plain: 'border-transparent bg-transparent',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface InputProps extends TextInputProps, VariantProps<typeof inputVariants> {
  'aria-invalid'?: boolean;
  className?: string;
  /**
   * Shown before the text. A decorative icon here needs `aria-hidden`; screen readers
   * otherwise stop on it as a separate element and read out its glyph.
   */
  prefix?: React.ReactNode;
  /** Shown after the text: a unit, or a control such as a clear button. */
  suffix?: React.ReactNode;
  inputClassName?: string;
}

const Input: ForwardRefComponent<TextInputInstance, InputProps> = React.forwardRef(
  (
    {
      className,
      prefix,
      suffix,
      inputClassName,
      variant,
      editable,
      'aria-invalid': ariaInvalid,
      placeholderTextColor,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const colors = useThemeColors();
    const interaction = useInteractionTokens();
    const visual = useVisualTokens();
    const field = useFormFieldState();
    const font = useFieldFont();
    const effectiveEditable = editable ?? !field.disabled;
    const effectiveVariant = variant ?? (field.invalid ? 'error' : 'default');
    // The border is on this wrapper and the focus is on the TextInput inside it, so the
    // wrapper learns about focus from the events rather than a pseudo-class.
    const [focused, setFocused] = useState(false);
    const plain = effectiveVariant === 'plain';
    return (
      <View
        className={cn(
          'flex-row items-center border-border bg-muted',
          inputVariants({ variant: effectiveVariant }),
          focused && !plain && focusFieldWrapper,
          className
        )}
        style={[
          {
            minHeight: visual.controlHeightDefault,
            borderWidth: plain ? 0 : visual.borderWidthControl,
            borderRadius: visual.radiusLg,
            paddingHorizontal: plain ? 0 : visual.controlPaddingXDefault,
          },
          !effectiveEditable ? { opacity: interaction.disabledOpacity } : undefined,
        ]}
      >
        {prefix && (
          <View
            style={{ paddingRight: Math.max(8, Math.round(visual.controlPaddingXDefault * 0.5)) }}
          >
            {prefix}
          </View>
        )}
        <TextInput
          ref={ref}
          {...fieldAccessibilityProps(field, props)}
          className={cn(
            'flex-1 text-foreground placeholder:text-muted-foreground web:outline-none',
            !plain && webAutofillField,
            inputClassName
          )}
          style={{
            ...typographyStyle(visual, 'label'),
            ...font,
            minHeight: visual.controlHeightDefault - 2,
            paddingVertical: visual.controlPaddingYDefault,
          }}
          editable={effectiveEditable}
          aria-invalid={ariaInvalid ?? field.invalid}
          placeholderTextColor={placeholderTextColor ?? colors.placeholder}
          {...textCursorColors(colors)}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...props}
        />
        {suffix && (
          <View
            style={{ paddingLeft: Math.max(8, Math.round(visual.controlPaddingXDefault * 0.5)) }}
          >
            {suffix}
          </View>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
