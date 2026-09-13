import React, { createContext, useContext, useMemo } from 'react';
import { Pressable, Text, type PressableProps, type TextProps } from 'react-native';
import { cn } from '../../lib/cn';
import { focusRing } from '../../lib/focus-ring';
import { tv, type VariantProps } from '../../lib/tv';
import { useVisualTokens } from '../../lib/visual-tokens';
import { controlRecipe, typographyStyle, type TypographyRole } from '../../lib/recipes';

interface ToggleContextValue {
  pressed: boolean;
  variant: VariantProps<typeof toggleVariants>['variant'];
  size: VariantProps<typeof toggleVariants>['size'];
}

const ToggleContext = createContext<ToggleContextValue>({
  pressed: false,
  variant: 'default',
  size: 'default',
});

const toggleVariants = tv({
  base: 'inline-flex items-center justify-center active:bg-accent',
  variants: {
    variant: {
      default: 'bg-transparent',
      outline: 'border border-input bg-transparent',
    },
    size: {
      default: '',
      sm: '',
      lg: '',
    },
    pressed: {
      true: 'bg-accent',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    pressed: false,
  },
});

const TOGGLE_TEXT_ROLE: Record<string, TypographyRole> = {
  default: 'label',
  sm: 'caption',
  lg: 'body',
};

const toggleTextVariants = tv({
  base: 'font-medium',
  variants: {
    pressed: {
      true: 'text-accent-foreground',
      false: 'text-muted-foreground',
    },
    size: {
      default: '',
      sm: '',
      lg: '',
    },
  },
  defaultVariants: {
    pressed: false,
    size: 'default',
  },
});

export interface ToggleProps extends Omit<PressableProps, 'children'> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: VariantProps<typeof toggleVariants>['variant'];
  size?: VariantProps<typeof toggleVariants>['size'];
  className?: string;
  children?: React.ReactNode;
}

export interface ToggleTextProps extends TextProps {
  className?: string;
}

function Toggle({
  pressed: controlledPressed,
  defaultPressed = false,
  onPressedChange,
  variant = 'default',
  size = 'default',
  className,
  children,
  style: styleProp,
  ...props
}: ToggleProps) {
  const [internalPressed, setInternalPressed] = React.useState(defaultPressed);
  const pressed = controlledPressed ?? internalPressed;
  const visual = useVisualTokens();

  const handlePress = () => {
    const next = !pressed;
    setInternalPressed(next);
    onPressedChange?.(next);
  };

  const tokenStyle = {
    ...controlRecipe(visual, size ?? 'default'),
    ...(variant === 'outline' ? { borderWidth: visual.borderWidthControl } : null),
  };
  const contextValue = useMemo(() => ({ pressed, variant, size }), [pressed, size, variant]);

  return (
    <ToggleContext.Provider value={contextValue}>
      <Pressable
        className={cn(toggleVariants({ variant, size, pressed }), focusRing, className)}
        style={(state) => [
          tokenStyle,
          typeof styleProp === 'function' ? styleProp(state) : styleProp,
        ]}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityState={{ selected: pressed }}
        {...props}
      >
        {children}
      </Pressable>
    </ToggleContext.Provider>
  );
}

function ToggleText({ className, style, ...props }: ToggleTextProps) {
  const { pressed, size } = useContext(ToggleContext);
  const visual = useVisualTokens();
  const typography = typographyStyle(visual, TOGGLE_TEXT_ROLE[size ?? 'default'] ?? 'label');
  return (
    <Text
      className={cn(toggleTextVariants({ pressed, size }), className)}
      style={[typography, style]}
      {...props}
    />
  );
}

Toggle.displayName = 'Toggle';
ToggleText.displayName = 'ToggleText';

export { Toggle, ToggleText, toggleVariants, toggleTextVariants };
