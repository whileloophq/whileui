import React, { useMemo, useState } from 'react';
import {
  View,
  Image,
  Text,
  type ViewInstance,
  type ViewProps,
  type ImageProps,
} from 'react-native';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import { useVisualTokens } from '../../lib/visual-tokens';
import { typographyStyle } from '../../lib/recipes';
import type { ForwardRefComponent } from '../../lib/ref-types';

const avatarVariants = tv({
  base: 'relative flex shrink-0 overflow-hidden rounded-full',
  variants: {
    size: {
      default: 'h-10 w-10',
      sm: 'h-8 w-8',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface AvatarProps extends ViewProps, VariantProps<typeof avatarVariants> {
  className?: string;
}

export interface AvatarImageProps extends Omit<ImageProps, 'style'> {
  className?: string;
  onLoadingStatusChange?: (status: 'loading' | 'loaded' | 'error') => void;
}

export interface AvatarFallbackProps extends ViewProps {
  className?: string;
}

const AvatarContext = React.createContext<{
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
}>({
  imageLoaded: false,
  setImageLoaded: () => {},
});

const Avatar: ForwardRefComponent<ViewInstance, AvatarProps> = React.forwardRef(
  ({ className, size, ...props }, ref) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const contextValue = useMemo(() => ({ imageLoaded, setImageLoaded }), [imageLoaded]);

    return (
      <AvatarContext.Provider value={contextValue}>
        <View ref={ref} className={cn(avatarVariants({ size }), className)} {...props} />
      </AvatarContext.Provider>
    );
  }
);

Avatar.displayName = 'Avatar';

function AvatarImage({ className, onLoadingStatusChange, ...props }: AvatarImageProps) {
  const { setImageLoaded } = React.useContext(AvatarContext);

  return (
    <Image
      className={cn('aspect-square h-full w-full rounded-full', className)}
      onLoad={() => {
        setImageLoaded(true);
        onLoadingStatusChange?.('loaded');
      }}
      onError={() => {
        setImageLoaded(false);
        onLoadingStatusChange?.('error');
      }}
      {...props}
    />
  );
}

AvatarImage.displayName = 'AvatarImage';

function AvatarFallback({ className, children, ...props }: AvatarFallbackProps) {
  const { imageLoaded } = React.useContext(AvatarContext);
  const visual = useVisualTokens();

  if (imageLoaded) return null;

  return (
    <View
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted',
        className
      )}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          className="font-medium text-muted-foreground"
          style={typographyStyle(visual, 'label')}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback, avatarVariants };
