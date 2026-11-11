import { View } from 'react-native';
import { cn } from './cn';

/**
 * A close cross drawn from two rotated bars, centred exactly in its box. A "×" text
 * glyph sits wherever each font puts it — low and to one side in most — so a round
 * pressed background behind it looked off-centre.
 */
export function CrossGlyph({ size = 12, className }: { size?: number; className?: string }) {
  const bar = {
    position: 'absolute' as const,
    width: size,
    height: Math.max(1.5, Math.round(size * 0.14 * 2) / 2),
    borderRadius: 1,
  };
  return (
    <View
      testID="cross-glyph"
      aria-hidden
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
    >
      <View
        className={cn('bg-muted-foreground', className)}
        style={[bar, { transform: [{ rotate: '45deg' }] }]}
      />
      <View
        className={cn('bg-muted-foreground', className)}
        style={[bar, { transform: [{ rotate: '-45deg' }] }]}
      />
    </View>
  );
}
