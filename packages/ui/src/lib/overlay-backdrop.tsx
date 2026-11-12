import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { cn } from './cn';
import { useTapOnly } from './tap-only';

export interface OverlayBackdropProps {
  /** Called for a tap — not a drag — on the backdrop. Omit for a backdrop that only dims. */
  onDismiss?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * The tap-to-dismiss layer behind an overlay panel. Render it as the panel's sibling,
 * underneath it, not as its parent: a parent backdrop needs the panel to swallow every
 * press, and the panel then has to be a pressable too.
 *
 * It is not a control, and every one of these is load-bearing:
 * - `accessible={false}`: an accessible view on iOS is one element, and its descendants
 *   vanish from VoiceOver.
 * - `importantForAccessibility="no"`: screen reader users close from inside the panel.
 * - `tabIndex={-1}`: React Native Web makes every Pressable a Tab stop, so keyboard focus
 *   landed on the backdrop before anything in the overlay.
 * - `useTapOnly`: a press survives a finger moving inside the view, so on a full-screen
 *   backdrop every swipe was also a tap.
 */
export function OverlayBackdrop({ onDismiss, className, style }: OverlayBackdropProps) {
  const tap = useTapOnly(() => onDismiss?.());
  return (
    <Pressable
      accessible={false}
      importantForAccessibility="no"
      tabIndex={-1}
      className={cn('absolute inset-0', className)}
      style={style}
      {...(onDismiss ? tap : null)}
    />
  );
}
