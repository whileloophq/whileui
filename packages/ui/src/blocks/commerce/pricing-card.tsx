import { View, type ViewProps } from 'react-native';
import { Text } from '../../components/text';
import { Button, ButtonText } from '../../components/button';
import { Badge, BadgeText } from '../../components/badge';
import { Skeleton } from '../../components/skeleton';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';
import { useThemeColors } from '../../lib/theme-colors';
import { shadowStyle, surfacePadding, surfaceRadius, typographyStyle } from '../../lib/recipes';

export interface PricingFeature {
  label: string;
  included: boolean;
}

export interface PricingCardProps extends ViewProps {
  name: string;
  description?: string;
  price: string;
  period?: string;
  features: PricingFeature[];
  badge?: string;
  highlighted?: boolean;
  buttonLabel?: string;
  onPress?: () => void;
  /** Show a skeleton placeholder instead of content. */
  loading?: boolean;
}

function PricingCardSkeleton({
  highlighted = false,
  className,
}: {
  highlighted?: boolean;
  className?: string;
}) {
  const visual = useVisualTokens();
  return (
    <View
      className={cn(
        'overflow-hidden',
        highlighted ? 'border-primary bg-card' : 'border-border bg-card',
        className
      )}
      style={{
        borderRadius: surfaceRadius(visual, 'xl'),
        padding: surfacePadding(visual, 'lg'),
        borderWidth: highlighted ? visual.borderWidthEmphasis : visual.borderWidthHairline,
      }}
    >
      <View className="mb-4 flex-row items-center justify-between">
        <Skeleton className="h-5 w-1/3 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </View>
      <Skeleton className="mb-4 h-3 w-3/4 rounded-md" />
      <View className="mb-6 flex-row items-baseline gap-1">
        <Skeleton className="h-10 w-20 rounded-md" />
        <Skeleton className="h-3 w-12 rounded-md" />
      </View>
      <View className="mb-6 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <View key={i} className="flex-row items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-3 w-3/5 rounded-md" />
          </View>
        ))}
      </View>
      <Skeleton className="h-10 w-full rounded-lg" />
    </View>
  );
}

export function PricingCard({
  name,
  description,
  price,
  period = '/month',
  features,
  badge,
  highlighted = false,
  buttonLabel = 'Get Started',
  onPress,
  loading = false,
  className,
  style,
  ...props
}: PricingCardProps) {
  const visual = useVisualTokens();
  const colors = useThemeColors();

  if (loading) {
    return <PricingCardSkeleton highlighted={highlighted} className={className} />;
  }

  const emphasis = typographyStyle(visual, 'emphasis');
  const label = typographyStyle(visual, 'label');

  return (
    <View
      className={cn(
        'overflow-hidden',
        highlighted ? 'border-primary bg-card' : 'border-border bg-card',
        className
      )}
      style={[
        {
          borderRadius: surfaceRadius(visual, 'xl'),
          padding: surfacePadding(visual, 'lg'),
          borderWidth: highlighted ? visual.borderWidthEmphasis : visual.borderWidthHairline,
        },
        highlighted ? shadowStyle(visual, colors, 'md') : null,
        style,
      ]}
      {...props}
    >
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="font-semibold text-foreground" style={emphasis}>
          {name}
        </Text>
        {badge && (
          <Badge variant={highlighted ? 'default' : 'secondary'}>
            <BadgeText>{badge}</BadgeText>
          </Badge>
        )}
      </View>

      {description && (
        <Text className="mb-4 text-muted-foreground" style={label}>
          {description}
        </Text>
      )}

      <View className="mb-6 flex-row items-baseline">
        <Text className="text-4xl font-bold text-foreground">{price}</Text>
        <Text className="ml-1 text-muted-foreground">{period}</Text>
      </View>

      <View className="mb-6 gap-3">
        {features.map((feature) => (
          <View key={feature.label} className="flex-row items-center gap-3">
            <Text className={feature.included ? 'text-primary' : 'text-muted-foreground'}>
              {feature.included ? '✓' : '✕'}
            </Text>
            <Text
              className={cn(
                feature.included ? 'text-foreground' : 'text-muted-foreground line-through'
              )}
              style={label}
            >
              {feature.label}
            </Text>
          </View>
        ))}
      </View>

      <Button variant={highlighted ? 'default' : 'outline'} className="w-full" onPress={onPress}>
        <ButtonText>{buttonLabel}</ButtonText>
      </Button>
    </View>
  );
}
