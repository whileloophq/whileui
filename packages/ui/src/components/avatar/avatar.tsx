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

export type AvatarImageStatus = 'loading' | 'loaded' | 'error';

export interface AvatarImageProps extends Omit<ImageProps, 'style'> {
  className?: string;
  onLoadingStatusChange?: (status: AvatarImageStatus) => void;
}

export interface AvatarFallbackProps extends ViewProps {
  className?: string;
}

const AvatarContext = React.createContext<{
  imageStatus: AvatarImageStatus;
  setImageStatus: (status: AvatarImageStatus) => void;
}>({
  imageStatus: 'loading',
  setImageStatus: () => {},
});

const Avatar: ForwardRefComponent<ViewInstance, AvatarProps> = React.forwardRef(
  ({ className, size, ...props }, ref) => {
    const [imageStatus, setImageStatus] = useState<AvatarImageStatus>('loading');
    const contextValue = useMemo(() => ({ imageStatus, setImageStatus }), [imageStatus]);

    return (
      <AvatarContext.Provider value={contextValue}>
        <View ref={ref} className={cn(avatarVariants({ size }), className)} {...props} />
      </AvatarContext.Provider>
    );
  }
);

Avatar.displayName = 'Avatar';

function AvatarImage({
  className,
  onLoadingStatusChange,
  onLoadStart,
  onLoad,
  onError,
  ...props
}: AvatarImageProps) {
  const { setImageStatus } = React.useContext(AvatarContext);

  return (
    <Image
      {...props}
      className={cn('aspect-square h-full w-full rounded-full', className)}
      onLoadStart={() => {
        setImageStatus('loading');
        onLoadingStatusChange?.('loading');
        onLoadStart?.();
      }}
      onLoad={(event) => {
        setImageStatus('loaded');
        onLoadingStatusChange?.('loaded');
        onLoad?.(event);
      }}
      onError={(event) => {
        setImageStatus('error');
        onLoadingStatusChange?.('error');
        onError?.(event);
      }}
    />
  );
}

AvatarImage.displayName = 'AvatarImage';

function AvatarFallback({ className, children, ...props }: AvatarFallbackProps) {
  const { imageStatus } = React.useContext(AvatarContext);
  const visual = useVisualTokens();

  if (imageStatus === 'loaded') return null;

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
