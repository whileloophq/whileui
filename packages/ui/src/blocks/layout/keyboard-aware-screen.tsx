import { KeyboardAvoidingView, type KeyboardAvoidingViewProps } from 'react-native';
import { cn } from '../../lib/cn';

export interface KeyboardAwareScreenProps extends KeyboardAvoidingViewProps {
  /**
   * How the screen makes room for the keyboard.
   * @default 'height'
   */
  behavior?: KeyboardAvoidingViewProps['behavior'];
}

/**
 * Screen root for layouts with controls docked to the bottom edge. It gives the
 * whole layout one keyboard policy so inputs do not add their own avoidance and
 * accidentally apply the keyboard offset twice.
 *
 * It shortens itself by the keyboard (`height`), so `DockedInput`, which is pinned to the
 * bottom edge, rises with it. With `padding` the screen measured the keyboard correctly
 * on iOS, but an absolutely positioned child ignores its parent's padding, and the dock
 * stayed under the keyboard. Android used to rely on the window shrinking for the
 * keyboard, which an edge-to-edge app no longer gets. Where the window does still
 * shrink, the measured overlap is zero, so the two never add up.
 */
export function KeyboardAwareScreen({
  behavior = 'height',
  className,
  ...props
}: KeyboardAwareScreenProps) {
  return (
    <KeyboardAvoidingView
      behavior={behavior}
      className={cn('flex-1 bg-background', className)}
      {...props}
    />
  );
}

KeyboardAwareScreen.displayName = 'KeyboardAwareScreen';
