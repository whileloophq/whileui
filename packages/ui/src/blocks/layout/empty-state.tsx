import React from 'react';
import { View, type ViewProps } from 'react-native';
import { Text } from '../../components/text';
import { Button, ButtonText } from '../../components/button';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';
import { surfacePadding, typographyStyle } from '../../lib/recipes';

export interface EmptyStateProps extends ViewProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
}

function DefaultEmptyIcon() {
  const visual = useVisualTokens();

  return (
    <View
      className="mb-6 h-14 w-14 items-center justify-center border-dashed border-muted"
      style={{
        borderRadius: visual.radiusLg,
        borderWidth: visual.borderWidthEmphasis,
      }}
    >
      <View
        className="h-4 w-5 rounded-sm border-muted-foreground"
        style={{ borderWidth: visual.borderWidthHairline }}
      />
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  style,
  ...props
}: EmptyStateProps) {
  const visual = useVisualTokens();

  return (
    <View
      className={cn('flex-1 items-center justify-center', className)}
      style={[{ padding: surfacePadding(visual, 'lg') }, style]}
      {...props}
    >
      <View className="mb-6">
        {icon ? <View className="text-muted-foreground">{icon}</View> : <DefaultEmptyIcon />}
      </View>

      <Text
        className="mb-2 text-center font-semibold text-foreground"
        style={typographyStyle(visual, 'title')}
      >
        {title}
      </Text>

      {description && (
        <Text className="mb-6 max-w-xs text-center text-muted-foreground">{description}</Text>
      )}

      {action && (
        <Button onPress={action.onPress} className="mb-3">
          <ButtonText>{action.label}</ButtonText>
        </Button>
      )}

      {secondaryAction && (
        <Button variant="ghost" onPress={secondaryAction.onPress}>
          <ButtonText>{secondaryAction.label}</ButtonText>
        </Button>
      )}
    </View>
  );
}
