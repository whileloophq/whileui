import { View, type ViewProps } from 'react-native';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';

/**
 * A centred content column with a maximum width.
 *
 * Phone-first layouts stretch to whatever the viewport is, which is correct at
 * 390px and wrong at 1600px — line lengths become unreadable and related controls
 * drift apart. This caps the content and centres it.
 *
 * There is no platform branch and none is needed: every size here is wider than any
 * phone, so on iOS and Android the cap never engages and this renders as a plain
 * full-width `View`. The same component is a no-op on native and the whole fix on
 * desktop.
 */
const containerVariants = tv({
  base: 'w-full self-center',
  variants: {
    size: {
      /** Forms, auth, single-column reading. */
      sm: 'max-w-xl',
      /** Default. Feeds, dashboards, most app screens. */
      md: 'max-w-3xl',
      /** Multi-column dashboards and wide tables. */
      lg: 'max-w-5xl',
      /** Near-full width, still stops short of an ultrawide monitor. */
      xl: 'max-w-7xl',
      /** Opt out — edge-to-edge at every width. */
      full: 'max-w-none',
    },
    /** Fill the available height, for a container used as a screen root. */
    fill: {
      true: 'flex-1',
      false: '',
    },
  },
  defaultVariants: { size: 'md', fill: false },
});

export interface ContainerProps extends ViewProps, VariantProps<typeof containerVariants> {
  className?: string;
}

export function Container({ size, fill, className, children, ...props }: ContainerProps) {
  return (
    <View className={cn(containerVariants({ size, fill }), className)} {...props}>
      {children}
    </View>
  );
}

export { containerVariants };
