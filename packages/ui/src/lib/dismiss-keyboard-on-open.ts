import { useEffect, type RefObject } from 'react';
import { Keyboard, Platform } from 'react-native';
import type { LayoutPosition } from '@rn-primitives/hooks';

interface Measurable {
  measure: (
    callback: (
      x: number,
      y: number,
      width: number,
      height: number,
      pageX: number,
      pageY: number
    ) => void
  ) => void;
}

/**
 * Closes the keyboard when a portal overlay opens, then measures its trigger again.
 *
 * `Select` and `Popover` draw in a portal rather than a Modal, so iOS and Android leave the
 * keyboard up and it covers the lower half of the content. Closing it moves any
 * keyboard-avoiding screen, which leaves the trigger away from where it was measured on
 * press, so the position is taken again once the keyboard has gone. Modal-hosted overlays
 * need none of this: the platform closes the keyboard when the Modal's window takes focus.
 */
export function useDismissKeyboardOnOpen(
  open: boolean,
  triggerRef: RefObject<Measurable | null>,
  setTriggerPosition: (position: LayoutPosition) => void
) {
  useEffect(() => {
    if (!open || Platform.OS === 'web' || !Keyboard.isVisible()) return;
    const subscription = Keyboard.addListener('keyboardDidHide', () => {
      triggerRef.current?.measure((_x, _y, width, height, pageX, pageY) =>
        setTriggerPosition({ width, height, pageX, pageY })
      );
    });
    Keyboard.dismiss();
    return () => subscription.remove();
  }, [open, triggerRef, setTriggerPosition]);
}
