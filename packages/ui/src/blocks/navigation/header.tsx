import React from 'react';
import { View, type ViewProps } from 'react-native';
import { Pressable, type PressableProps } from '../../components/pressable';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { ChevronGlyph } from '../../lib/chevron-glyph';
import { useVisualTokens } from '../../lib/visual-tokens';
import { typographyStyle } from '../../lib/recipes';

export interface HeaderAction {
  key: string;
  icon: React.ReactNode;
  onPress: () => void;
  /** Required in practice: an icon-only button has no other accessible name. */
  accessibilityLabel?: string;
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
            accessibilityLabel={action.accessibilityLabel}
            onPress={action.onPress}
            hitSlop={4}
            className="rounded-full p-2 active:bg-state-pressed"
          >
            {action.icon}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export interface HeaderBackButtonProps extends Omit<PressableProps, 'children'> {
  /** Replaces the drawn chevron, for an app with its own icon set. */
  icon?: React.ReactNode;
  /** Visible text after the chevron. The button is named "Back" without it. */
  label?: string;
}

export function HeaderBackButton({
  icon,
  label,
  className,
  style: styleProp,
  ...props
}: HeaderBackButtonProps) {
  const visual = useVisualTokens();

  return (
    // The name is set before `props` so a caller can override it. Without it VoiceOver
    // read the chevron glyph.
    <Pressable
      accessibilityLabel={label ?? 'Back'}
      hitSlop={8}
      feedback="default"
      className={cn('flex-row items-center justify-center gap-1 rounded-full py-1', className)}
      style={(state) => [
        { minHeight: visual.touchTargetMinSize, minWidth: visual.touchTargetMinSize },
        typeof styleProp === 'function' ? styleProp(state) : styleProp,
      ]}
      {...props}
    >
      {icon || <ChevronGlyph direction="left" size={14} className="border-primary" />}
      {label && (
        <Text className="text-primary" style={typographyStyle(visual, 'body')}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
