import React, { createContext, useContext, useMemo } from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type TextProps,
  type ViewProps,
} from 'react-native';
import { cn } from '../../lib/cn';
import { focusRing } from '../../lib/focus-ring';
import { tv, type VariantProps } from '../../lib/tv';
import { useResolveFontFamily } from '../../lib/font-context';
import { useInteractionTokens, withInteractivePressableStyle } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';
import { controlRecipe, typographyStyle, type TypographyRole } from '../../lib/recipes';

interface ButtonContextValue {
  variant: VariantProps<typeof buttonVariants>['variant'];
  size: VariantProps<typeof buttonVariants>['size'];
}

const ButtonContext = createContext<ButtonContextValue>({
  variant: 'default',
  size: 'default',
});

const buttonVariants = tv({
  base: 'flex-row items-center justify-center gap-2',
  variants: {
    variant: {
      default: 'bg-primary',
      destructive: 'bg-destructive',
      outline: 'border border-input bg-background',
      secondary: 'bg-secondary',
      ghost: 'bg-transparent',
      link: '',
    },
    size: {
      default: '',
      sm: '',
      lg: '',
      icon: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

function getButtonStyleTokens(
  visual: ReturnType<typeof useVisualTokens>,
  size: NonNullable<VariantProps<typeof buttonVariants>['size']>,
  variant: NonNullable<VariantProps<typeof buttonVariants>['variant']>
) {
  if (variant === 'link') {
    return undefined;
  }

  const recipe = controlRecipe(visual, size);
  if (variant === 'outline') {
    return { ...recipe, borderWidth: visual.borderWidthControl };
  }
  return recipe;
}

const BUTTON_TEXT_ROLE: Record<string, TypographyRole> = {
  default: 'label',
  sm: 'caption',
  lg: 'body',
  icon: 'label',
};

const buttonTextVariants = tv({
  base: 'font-medium text-center',
  variants: {
    variant: {
      default: 'text-primary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
      secondary: 'text-secondary-foreground',
      ghost: 'text-foreground',
      link: 'text-primary underline',
    },
    size: {
      default: '',
      sm: '',
      lg: '',
      icon: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps
  extends Omit<PressableProps, 'children'>, VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface ButtonTextProps extends TextProps {
  variant?: VariantProps<typeof buttonTextVariants>['variant'];
  size?: VariantProps<typeof buttonTextVariants>['size'];
  className?: string;
}

// Placement comes from where the icon sits among the button's children — React Native
// has no `order`, so a `position` prop could only ever have been decorative.
export interface ButtonIconProps extends ViewProps {
  className?: string;
}

const Button = React.forwardRef<React.ComponentRef<typeof Pressable>, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      disabled,
      children,
      style: styleProp,
      ...props
    },
    ref
  ) => {
    const interaction = useInteractionTokens();
    const visual = useVisualTokens();
    const interactiveStyle = withInteractivePressableStyle(styleProp, interaction, {
      disabled: Boolean(disabled),
      pressedVariant: variant === 'link' ? 'none' : 'strong',
    });
    const tokenStyle = getButtonStyleTokens(visual, size, variant);
    const contextValue = useMemo(() => ({ variant, size }), [size, variant]);

    return (
      <ButtonContext.Provider value={contextValue}>
        <Pressable
          ref={ref}
          accessibilityRole={variant === 'link' ? 'link' : 'button'}
          className={cn(buttonVariants({ variant, size }), focusRing, className)}
          style={(state) => {
            const baseStyle =
              typeof interactiveStyle === 'function' ? interactiveStyle(state) : interactiveStyle;
            return [baseStyle, tokenStyle ?? null];
          }}
          disabled={disabled}
          {...props}
        >
          {children}
        </Pressable>
      </ButtonContext.Provider>
    );
  }
);

Button.displayName = 'Button';

function ButtonText({
  className,
  variant: variantProp,
  size: sizeProp,
  style,
  ...props
}: ButtonTextProps) {
  const context = useContext(ButtonContext);
  const visual = useVisualTokens();
  const variant = variantProp ?? context.variant;
  const size = sizeProp ?? context.size;
  const resolved = cn(buttonTextVariants({ variant, size }), className);
  const font = useResolveFontFamily(resolved);
  const typography = typographyStyle(visual, BUTTON_TEXT_ROLE[size ?? 'default'] ?? 'label');

  return (
    <Text
      className={font ? font.className : resolved}
      style={font ? [typography, font.style, style] : [typography, style]}
      {...props}
    />
  );
}

ButtonText.displayName = 'ButtonText';

function ButtonIcon({ className, ...props }: ButtonIconProps) {
  return <View className={cn('items-center justify-center', className)} {...props} />;
}

ButtonIcon.displayName = 'ButtonIcon';

export { Button, ButtonText, ButtonIcon, buttonVariants, buttonTextVariants };
