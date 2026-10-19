import React from 'react';
import {
  TextInput,
  type TextInputInstance,
  type TextInputProps,
  type TextStyle,
} from 'react-native';
import { cn } from '../../lib/cn';
import { focusField } from '../../lib/focus-ring';
import { tv, type VariantProps } from '../../lib/tv';
import { useThemeColors } from '../../lib/theme-colors';
import { useInteractionTokens } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';
import { typographyStyle, type TypographyRole } from '../../lib/recipes';
import type { ForwardRefComponent } from '../../lib/ref-types';

const textareaVariants = tv({
  base: 'w-full border-border bg-muted text-foreground',
  variants: {
    size: {
      default: '',
      sm: '',
      lg: '',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const TEXTAREA_TEXT_ROLE: Record<string, TypographyRole> = {
  default: 'label',
  sm: 'caption',
  lg: 'body',
};

export interface TextareaProps
  extends Omit<TextInputProps, 'style'>, VariantProps<typeof textareaVariants> {
  className?: string;
}

const Textarea: ForwardRefComponent<TextInputInstance, TextareaProps> = React.forwardRef(
  ({ className, size = 'default', placeholderTextColor, ...props }, ref) => {
    const colors = useThemeColors();
    const interaction = useInteractionTokens();
    const visual = useVisualTokens();

    const minHeight =
      size === 'sm'
        ? visual.textareaMinHeightSm
        : size === 'lg'
          ? visual.textareaMinHeightLg
          : visual.textareaMinHeightDefault;

    const style: TextStyle = {
      ...typographyStyle(visual, TEXTAREA_TEXT_ROLE[size ?? 'default'] ?? 'label'),
      minHeight,
      borderWidth: visual.borderWidthControl,
      borderRadius: visual.radiusLg,
      paddingHorizontal: visual.controlPaddingXDefault,
      paddingVertical: visual.controlPaddingYDefault,
      ...(props.editable === false ? { opacity: interaction.disabledOpacity } : null),
    };

    return (
      <TextInput
        ref={ref}
        className={cn(textareaVariants({ size }), focusField, className)}
        style={style}
        multiline
        textAlignVertical="top"
        placeholderTextColor={placeholderTextColor ?? colors.placeholder}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
