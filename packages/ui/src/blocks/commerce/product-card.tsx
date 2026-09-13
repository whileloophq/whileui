import { Image } from 'expo-image';
import { View, Pressable, type PressableProps } from 'react-native';
import { Text } from '../../components/text';
import { Badge, BadgeText } from '../../components/badge';
import { Skeleton } from '../../components/skeleton';
import { cn } from '../../lib/cn';
import { useInteractionTokens, withInteractivePressableStyle } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';
import { surfacePadding, surfaceRadius, typographyStyle } from '../../lib/recipes';

export interface ProductCardProps extends Omit<PressableProps, 'children'> {
  imageUrl?: string;
  title: string;
  description?: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  variant?: 'vertical' | 'horizontal';
  /** Show a skeleton placeholder instead of content. */
  loading?: boolean;
}

function ProductCardSkeleton({
  variant = 'vertical',
  className,
}: {
  variant?: 'vertical' | 'horizontal';
  className?: string;
}) {
  const visual = useVisualTokens();
  const isHorizontal = variant === 'horizontal';
  return (
    <View
      className={cn(
        'overflow-hidden border border-border bg-card',
        isHorizontal ? 'flex-row' : 'flex-col',
        className
      )}
      style={{
        borderRadius: surfaceRadius(visual, 'xl'),
        borderWidth: visual.borderWidthHairline,
      }}
    >
      <Skeleton className={cn(isHorizontal ? 'h-28 w-28' : 'aspect-square w-full rounded-none')} />
      <View
        className={cn('flex-1 gap-2', isHorizontal && 'justify-center')}
        style={{ padding: surfacePadding(visual, 'sm') }}
      >
        <Skeleton className="h-4 w-3/4 rounded-md" />
        {!isHorizontal && <Skeleton className="h-3 w-full rounded-md" />}
        <Skeleton className="h-3 w-1/3 rounded-md" />
        <Skeleton className="h-5 w-1/4 rounded-md" />
      </View>
    </View>
  );
}

export function ProductCard({
  imageUrl,
  title,
  description,
  price,
  originalPrice,
  badge,
  rating,
  reviewCount,
  inStock = true,
  variant = 'vertical',
  loading = false,
  className,
  style: styleProp,
  ...props
}: ProductCardProps) {
  const isHorizontal = variant === 'horizontal';
  const interaction = useInteractionTokens();
  const visual = useVisualTokens();

  if (loading) {
    return <ProductCardSkeleton variant={variant} className={className} />;
  }

  const label = typographyStyle(visual, 'label');
  const interactiveStyle = withInteractivePressableStyle(styleProp, interaction, {
    disabled: Boolean(props.disabled),
    pressedVariant: 'strong',
  });
  const surfaceStyle = {
    borderRadius: surfaceRadius(visual, 'xl'),
    borderWidth: visual.borderWidthHairline,
  };

  return (
    <Pressable
      className={cn(
        'overflow-hidden border border-border bg-card',
        isHorizontal ? 'flex-row' : 'flex-col',
        className
      )}
      style={(state) => {
        const baseStyle =
          typeof interactiveStyle === 'function' ? interactiveStyle(state) : interactiveStyle;
        return [surfaceStyle, baseStyle];
      }}
      {...props}
    >
      <View
        className={cn(
          'items-center justify-center bg-muted',
          isHorizontal ? 'h-28 w-28' : 'aspect-square w-full'
        )}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} className="h-full w-full" contentFit="cover" />
        ) : (
          <View className="items-center justify-center gap-2">
            <View
              className="h-10 w-10 bg-muted-soft items-center justify-center"
              style={{ borderRadius: visual.radiusSm }}
            >
              <Text className="text-muted-foreground text-lg">📦</Text>
            </View>
          </View>
        )}
        {badge && (
          <View className="absolute left-2 top-2">
            <Badge variant="destructive">
              <BadgeText>{badge}</BadgeText>
            </Badge>
          </View>
        )}
      </View>

      <View
        className={cn('flex-1', isHorizontal && 'justify-center')}
        style={{ padding: surfacePadding(visual, 'sm') }}
      >
        <Text className="font-medium text-foreground" numberOfLines={2}>
          {title}
        </Text>

        {description && !isHorizontal && (
          <Text className="mt-1 text-muted-foreground" style={label} numberOfLines={2}>
            {description}
          </Text>
        )}

        {rating !== undefined && (
          <View className="mt-1 flex-row items-center gap-1">
            <Text className="text-accent" style={label}>
              ★
            </Text>
            <Text className="text-muted-foreground" style={label}>
              {rating.toFixed(1)}
              {reviewCount !== undefined && ` (${reviewCount})`}
            </Text>
          </View>
        )}

        <View className="mt-2 flex-row items-center gap-2">
          <Text className="text-lg font-bold text-foreground">{price}</Text>
          {originalPrice && (
            <Text className="text-muted-foreground line-through" style={label}>
              {originalPrice}
            </Text>
          )}
        </View>

        {!inStock && (
          <Text className="mt-1 text-destructive" style={label}>
            Out of stock
          </Text>
        )}
      </View>
    </Pressable>
  );
}
