import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import { useThemeColors } from '../../lib/theme-colors';

const spinnerVariants = tv({
  base: '',
  variants: {
    size: {
      sm: '',
      default: '',
      lg: '',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const sizeMap: Record<string, 'small' | 'large'> = {
  sm: 'small',
  default: 'small',
  lg: 'large',
};

export interface SpinnerProps
  extends Omit<ActivityIndicatorProps, 'size'>, VariantProps<typeof spinnerVariants> {
  className?: string;
}

function Spinner({ className, size, color, ...props }: SpinnerProps) {
  const colors = useThemeColors();
  const activityIndicatorSize =
    size && size in sizeMap ? sizeMap[size as keyof typeof sizeMap] : 'small';

  return (
    <ActivityIndicator
      size={activityIndicatorSize}
      color={color ?? colors.foreground}
      className={cn(spinnerVariants({ size }), className)}
      // `ActivityIndicator` renders `role="progressbar"`, and a progressbar with no name
      // fails WCAG 4.1.2. Override with what is loading when you know it.
      accessibilityLabel="Loading"
      {...props}
    />
  );
}

Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };
