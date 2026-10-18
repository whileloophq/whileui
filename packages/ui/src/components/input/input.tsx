import React from 'react';
import { View, TextInput, type TextInputInstance, type TextInputProps } from 'react-native';
import { cn } from '../../lib/cn';
import { focusRing } from '../../lib/focus-ring';
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
      ...props
    },
    ref
  ) => {
    const colors = useThemeColors();
    const interaction = useInteractionTokens();
    const visual = useVisualTokens();
    return (
      <View
        className={cn(
          'flex-row items-center border-border bg-muted',
          inputVariants({ variant }),
          className
        )}
        style={[
          {
            minHeight: visual.controlHeightDefault,
            borderWidth: visual.borderWidthControl,
            borderRadius: visual.radiusLg,
            paddingHorizontal: visual.controlPaddingXDefault,
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
            'flex-1 text-foreground placeholder:text-muted-foreground',
            focusRing,
            inputClassName
          )}
          style={{
            ...typographyStyle(visual, 'label'),
            minHeight: visual.controlHeightDefault - 2,
            paddingVertical: visual.controlPaddingYDefault,
          }}
          editable={editable}
          placeholderTextColor={placeholderTextColor ?? colors.placeholder}
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
