import React, { useState } from 'react';
import { View, TextInput, type TextInputInstance, type TextInputProps } from 'react-native';
import { cn } from '../../lib/cn';
import { focusFieldWrapper } from '../../lib/focus-ring';
import { tv, type VariantProps } from '../../lib/tv';
import { useThemeColors } from '../../lib/theme-colors';
import { useInteractionTokens } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';
import { typographyStyle } from '../../lib/recipes';
import type { ForwardRefComponent } from '../../lib/ref-types';

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
  className?: string;
  prefix?: React.ReactNode;
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
      editable = true,
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
    // The border is on this wrapper and the focus is on the TextInput inside it, so the
    // wrapper learns about focus from the events rather than a pseudo-class.
    const [focused, setFocused] = useState(false);
    const plain = variant === 'plain';
    return (
      <View
        className={cn(
          'flex-row items-center border-border bg-muted',
          inputVariants({ variant }),
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
          !editable ? { opacity: interaction.disabledOpacity } : undefined,
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
          className={cn(
            'flex-1 text-foreground placeholder:text-muted-foreground web:outline-none',
            inputClassName
          )}
          style={{
            ...typographyStyle(visual, 'label'),
            minHeight: visual.controlHeightDefault - 2,
            paddingVertical: visual.controlPaddingYDefault,
          }}
          editable={editable}
          placeholderTextColor={placeholderTextColor ?? colors.placeholder}
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
