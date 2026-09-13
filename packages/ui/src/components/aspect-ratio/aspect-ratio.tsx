import { View, type ViewProps } from 'react-native';
import { cn } from '../../lib/cn';

export interface AspectRatioProps extends ViewProps {
  ratio?: number;
  className?: string;
}

function AspectRatio({ ratio = 1, className, children, style, ...props }: AspectRatioProps) {
  return (
    <View className={cn('relative', className)} style={[{ aspectRatio: ratio }, style]} {...props}>
      {children}
    </View>
  );
}

AspectRatio.displayName = 'AspectRatio';

export { AspectRatio };
