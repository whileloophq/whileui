import { Platform, KeyboardAvoidingView, type KeyboardAvoidingViewProps } from 'react-native';
import { cn } from '../../lib/cn';

export interface KeyboardAwareScreenProps extends KeyboardAvoidingViewProps {
  /** Override the platform default. iOS uses padding; Android lets the window resize. */
  behavior?: KeyboardAvoidingViewProps['behavior'];
}

/**
 * Screen root for layouts with controls docked to the bottom edge. It gives the
 * whole layout one keyboard policy so inputs do not add their own avoidance and
 * accidentally apply the keyboard offset twice.
 */
export function KeyboardAwareScreen({
  behavior = Platform.OS === 'ios' ? 'padding' : undefined,
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
