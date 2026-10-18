import React, { useState } from 'react';
import { View, type ViewInstance, type ViewProps } from 'react-native';
import { Image, type ImageProps } from 'expo-image';
import { Skeleton } from '../../components/skeleton';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import { useVisualTokens, type VisualTokens } from '../../lib/visual-tokens';
import type { ForwardRefComponent } from '../../lib/ref-types';

const smartImageVariants = tv({
  base: 'overflow-hidden',
  variants: {
    radius: {
      none: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
      full: 'rounded-full',
    },
    objectFit: {
      cover: 'object-cover',
      contain: 'object-contain',
      fill: 'object-fill',
      'scale-down': 'object-scale-down',
    },
  },
  defaultVariants: {
    radius: 'md',
    objectFit: 'cover',
  },
});

type SmartImageRadius = NonNullable<VariantProps<typeof smartImageVariants>['radius']>;

const FULL_RADIUS = 9999;

function resolveRadius(visual: VisualTokens, radius: SmartImageRadius): number {
  if (radius === 'none') return 0;
  if (radius === 'sm') return visual.radiusSm;
  if (radius === 'lg') return visual.radiusLg;
  if (radius === 'xl') return visual.radiusXl;
  if (radius === 'full') return FULL_RADIUS;
  return visual.radiusMd;
}

export interface SmartImageProps
  extends Omit<ViewProps, 'className'>, VariantProps<typeof smartImageVariants> {
  className?: string;
  source: ImageProps['source'];
  alt: string;
  skeleton?: boolean;
  skeletonClassName?: string;
  transition?: number;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSource?: ImageProps['source'];
}

const SmartImage: ForwardRefComponent<ViewInstance, SmartImageProps> = React.forwardRef(
  (
    {
      className,
      source,
      alt,
      skeleton = true,
      skeletonClassName,
      transition = 200,
      radius,
      objectFit,
      onLoad,
      onError,
      fallbackSource,
      style,
      ...props
    },
    ref
  ) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const visual = useVisualTokens();
    const borderRadius = resolveRadius(visual, radius ?? 'md');

    const handleLoad = () => {
      setLoading(false);
      onLoad?.();
    };

    const handleError = () => {
      setLoading(false);
      setError(true);
      onError?.();
    };

    const imageSource = error && fallbackSource ? fallbackSource : source;

    return (
      <View
        ref={ref}
        className={cn(smartImageVariants({ radius, objectFit }), className)}
        style={[{ borderRadius }, style]}
        {...props}
      >
        {skeleton && loading && (
          // Corner radius is inherited from the clipping container (overflow-hidden).
          <Skeleton className={cn('absolute inset-0', skeletonClassName)} />
        )}
        <Image
          source={imageSource}
          alt={alt}
          transition={transition}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'contain' && 'object-contain',
            objectFit === 'fill' && 'object-fill',
            objectFit === 'scale-down' && 'object-scale-down'
          )}
          style={{ opacity: loading && !error ? 0 : 1 }}
        />
      </View>
    );
  }
);

SmartImage.displayName = 'SmartImage';

export { SmartImage, smartImageVariants };
