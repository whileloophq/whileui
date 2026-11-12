import { View } from 'react-native';
import { cn } from './cn';

/**
 * A chevron drawn from two borders of a rotated square, centred in its box. A "‹" or "›"
 * character is small in most fonts and sits off-centre, so a back button looked like a
 * stray mark with empty space beside it.
 */
export function ChevronGlyph({
  direction,
  size = 12,
  className,
}: {
  direction: 'left' | 'right';
  size?: number;
  className?: string;
}) {
  const stroke = Math.max(2, Math.round(size * 0.18));
  return (
    <View
      testID="chevron-glyph"
      aria-hidden
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
    >
      <View
        className={cn('border-foreground', className)}
        style={{
          width: size * 0.7,
          height: size * 0.7,
          borderLeftWidth: stroke,
          borderBottomWidth: stroke,
          // Nudged toward the open side so the point, not the box, looks centred.
          transform: [
            { translateX: direction === 'left' ? size * 0.12 : -size * 0.12 },
            { rotate: direction === 'left' ? '45deg' : '-135deg' },
          ],
        }}
      />
    </View>
  );
}
