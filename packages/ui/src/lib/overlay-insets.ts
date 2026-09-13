import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVisualTokens } from './visual-tokens';

export interface OverlayInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Collision padding for anything that floats: popovers, dropdowns, context menus.
 *
 * Without it these are only clamped to the viewport, so a trigger near an edge produces
 * a panel sitting flush against it — touching the screen edge on web, and sliding under
 * the notch or home indicator on a device. Both read as broken rather than deliberate.
 *
 * Safe area plus a margin, so the result clears the hardware and still leaves the panel
 * looking placed rather than jammed. Callers can override per instance.
 */
export function useOverlayInsets(): OverlayInsets {
  const safeArea = useSafeAreaInsets();
  const visual = useVisualTokens();
  const margin = visual.surfacePaddingSm;

  return {
    top: safeArea.top + margin,
    bottom: safeArea.bottom + margin,
    left: safeArea.left + margin,
    right: safeArea.right + margin,
  };
}
