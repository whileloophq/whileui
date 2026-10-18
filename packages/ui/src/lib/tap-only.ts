import { useRef } from 'react';
import type { GestureResponderEvent } from 'react-native';

/**
 * Press handlers that fire only for a tap, not for a drag that happens to start and
 * end inside the same view. A `Pressable` keeps a press alive while the finger stays
 * within its bounds, so on a full-screen backdrop every swipe was also a tap and
 * dismissed the overlay. Ten points is the platform touch slop.
 */
export function useTapOnly(onTap: () => void, slop = 10) {
  const start = useRef<{ x: number; y: number } | null>(null);

  return {
    onPressIn: (event: GestureResponderEvent) => {
      start.current = { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY };
    },
    onPress: (event: GestureResponderEvent) => {
      const from = start.current;
      start.current = null;
      const moved =
        from !== null &&
        Number.isFinite(event.nativeEvent.pageX) &&
        Math.hypot(event.nativeEvent.pageX - from.x, event.nativeEvent.pageY - from.y) > slop;
      if (!moved) onTap();
    },
  };
}
