import { useEffect, useRef, useState } from 'react';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { useMotionPolicy } from './motion-policy';

interface OverlayPresenceOptions {
  visible: boolean;
  openDuration: number;
  closeDuration: number;
}

/**
 * Keeps an overlay mounted through its exit animation. `progress` runs 0 → 1 on open and
 * back to 0 on close; `mounted` drops once the exit finishes. Reduced motion and the
 * disabled test policy collapse both durations to zero.
 */
export function useOverlayPresence({
  visible,
  openDuration,
  closeDuration,
}: OverlayPresenceOptions) {
  const motion = useMotionPolicy();
  const progress = useSharedValue(0);
  const [mounted, setMounted] = useState(visible);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [prevVisible, setPrevVisible] = useState(visible);

  // Open in the prop-change render so the first animation frame has a mounted panel;
  // closing stays mounted on the timer until the exit animation finishes.
  if (prevVisible !== visible) {
    setPrevVisible(visible);
    if (visible) setMounted(true);
  }

  useEffect(() => {
    if (!mounted) return;

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    const duration =
      motion.reduceMotion || !motion.animationsEnabled ? 0 : visible ? openDuration : closeDuration;
    progress.value = withTiming(visible ? 1 : 0, {
      duration,
      reduceMotion: motion.reanimatedReduceMotion,
      easing: visible ? Easing.bezier(0.2, 0.8, 0.2, 1) : Easing.bezier(0.4, 0, 1, 1),
    });

    if (!visible) {
      closeTimerRef.current = setTimeout(() => setMounted(false), duration);
    }

    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [
    mounted,
    visible,
    progress,
    openDuration,
    closeDuration,
    motion.animationsEnabled,
    motion.reduceMotion,
    motion.reanimatedReduceMotion,
  ]);

  return { mounted, progress };
}
