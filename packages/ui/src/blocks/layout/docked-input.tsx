import { useCallback } from 'react';
import { View, type LayoutChangeEvent, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../../lib/cn';
import { surfacePadding } from '../../lib/recipes';
import { useVisualTokens } from '../../lib/visual-tokens';

export interface DockedInputProps extends ViewProps {
  safeArea?: boolean;
  /** Reports the complete dock height for the scroll area's bottom inset. */
  onHeightChange?: (height: number) => void;
}

/** Bottom-edge container intended for use inside `KeyboardAwareScreen`. */
export function DockedInput({
  safeArea = true,
  onHeightChange,
  onLayout,
  className,
  style,
  ...props
}: DockedInputProps) {
  const insets = useSafeAreaInsets();
  const visual = useVisualTokens();

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      onLayout?.(event);
      onHeightChange?.(event.nativeEvent.layout.height);
    },
    [onHeightChange, onLayout]
  );

  return (
    <View
      pointerEvents="box-none"
      className={cn('absolute inset-x-0 bottom-0', className)}
      style={[
        {
          paddingHorizontal: surfacePadding(visual, 'sm'),
          paddingTop: visual.controlPaddingYSm,
          paddingBottom: safeArea
            ? Math.max(insets.bottom, visual.controlPaddingYSm)
            : visual.controlPaddingYSm,
        },
        style,
      ]}
      onLayout={handleLayout}
      {...props}
    />
  );
}

DockedInput.displayName = 'DockedInput';
