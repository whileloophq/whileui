import React from 'react';
import { View, Pressable, type ViewProps, type PressableProps } from 'react-native';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { useInteractionTokens, withInteractivePressableStyle } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';
import { typographyStyle } from '../../lib/recipes';

export interface HeaderAction {
  key: string;
  icon: React.ReactNode;
  onPress: () => void;
}

export interface HeaderProps extends ViewProps {
  title?: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightActions?: HeaderAction[];
  centerContent?: React.ReactNode;
  transparent?: boolean;
  border?: boolean;
}

export function Header({
  title,
  subtitle,
  leftAction,
  rightActions,
  centerContent,
  transparent = false,
  border = true,
  className,
  style,
  ...props
}: HeaderProps) {
  const interaction = useInteractionTokens();
  const visual = useVisualTokens();

  return (
    <View
      className={cn(
        'flex-row items-center',
        !transparent && 'bg-background',
        border && 'border-b border-border',
        className
      )}
      style={[
        {
          paddingHorizontal: visual.controlPaddingXDefault,
          paddingVertical: visual.controlPaddingYDefault,
        },
        style,
      ]}
      {...props}
    >
      <View className="min-w-12">{leftAction}</View>

      <View className="flex-1 items-center">
        {centerContent || (
          <View className="items-center">
            {title && (
              <Text
                className="font-semibold text-foreground"
                style={typographyStyle(visual, 'body')}
                numberOfLines={1}
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text
                className="text-muted-foreground"
                style={typographyStyle(visual, 'caption')}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>
        )}
      </View>

      <View className="min-w-12 flex-row items-center justify-end gap-2">
        {rightActions?.map((action) => (
          <Pressable
            key={action.key}
            accessibilityRole="button"
            onPress={action.onPress}
            className="rounded-full p-2 active:bg-accent"
            style={withInteractivePressableStyle(undefined, interaction, {
              pressedVariant: 'default',
            })}
          >
            {action.icon}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export interface HeaderBackButtonProps extends Omit<PressableProps, 'children'> {
  icon?: React.ReactNode;
  label?: string;
}

export function HeaderBackButton({
  icon,
  label,
  className,
  style: styleProp,
  ...props
}: HeaderBackButtonProps) {
  const interaction = useInteractionTokens();
  const visual = useVisualTokens();
  const interactiveStyle = withInteractivePressableStyle(styleProp, interaction, {
    disabled: Boolean(props.disabled),
    pressedVariant: 'default',
  });

  return (
    <Pressable
      className={cn('flex-row items-center gap-1 rounded-full py-1', className)}
      style={interactiveStyle}
      {...props}
    >
      {icon || (
        <Text className="text-primary" style={typographyStyle(visual, 'title')}>
          ‹
        </Text>
      )}
      {label && (
        <Text className="text-primary" style={typographyStyle(visual, 'body')}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
