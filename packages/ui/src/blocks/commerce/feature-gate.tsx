import { type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { Card } from '../../components/card';
import { Button, ButtonText } from '../../components/button';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';
import { surfacePadding, surfaceRadius, typographyStyle } from '../../lib/recipes';

export interface FeatureGateProps extends ViewProps {
  title: string;
  description: string;
  icon?: ReactNode;
  buttonLabel?: string;
  onUpgrade?: () => void;
  children?: ReactNode;
  className?: string;
}

export function FeatureGate({
  title,
  description,
  icon,
  buttonLabel = 'Upgrade',
  onUpgrade,
  children,
  className,
  style,
  ...props
}: FeatureGateProps) {
  const visual = useVisualTokens();
  const body = typographyStyle(visual, 'body');
  const label = typographyStyle(visual, 'label');

  if (!children) {
    return (
      <Card
        className={cn('border-dashed border-border', className)}
        padding="lg"
        style={style}
        {...props}
      >
        <View className="items-start gap-3">
          {icon ? <View aria-hidden>{icon}</View> : null}
          <View className="gap-1">
            <Text className="font-semibold text-foreground" style={body}>
              {title}
            </Text>
            <Text className="text-muted-foreground" style={label}>
              {description}
            </Text>
          </View>
          <Button onPress={onUpgrade} disabled={!onUpgrade}>
            <ButtonText>{buttonLabel}</ButtonText>
          </Button>
        </View>
      </Card>
    );
  }

  return (
    <View
      className={cn('overflow-hidden border border-border', className)}
      style={[
        {
          borderRadius: surfaceRadius(visual, 'xl'),
          borderWidth: visual.borderWidthHairline,
        },
        style,
      ]}
      {...props}
    >
      {/* Preview is decorative background; the lock overlay drives the height so the CTA can never clip. */}
      <View className="absolute inset-0 justify-center opacity-45">{children}</View>
      <View
        className="items-center justify-center bg-background/70 px-6"
        style={{ paddingVertical: surfacePadding(visual, 'default') }}
      >
        {icon ? (
          <View aria-hidden className="mb-3">
            {icon}
          </View>
        ) : null}
        <Text className="text-center font-semibold text-foreground" style={body}>
          {title}
        </Text>
        <Text className="mt-1 text-center text-muted-foreground" style={label}>
          {description}
        </Text>
        <Button className="mt-4" onPress={onUpgrade} disabled={!onUpgrade}>
          <ButtonText>{buttonLabel}</ButtonText>
        </Button>
      </View>
    </View>
  );
}
