import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ScrollViewInstance,
  type ScrollViewProps,
} from 'react-native';
import { cn } from '../../lib/cn';
import type { ForwardRefComponent } from '../../lib/ref-types';

export interface KeyboardAwareScrollViewProps extends ScrollViewProps {
  /** Classes for the scroll view itself. `flex-1 bg-background` is always applied first. */
  className?: string;
  /** Classes for the content container: padding and gaps between fields go here. */
  contentContainerClassName?: string;
  /**
   * iOS only. Inset the content by whatever the keyboard covers and scroll the focused
   * field above it.
   * @default true
   */
  automaticallyAdjustKeyboardInsets?: boolean;
  /**
   * `handled` lets a tap on a button or picker in the form act while the keyboard is up,
   * instead of only dismissing the keyboard.
   * @default 'handled'
   */
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
}

/**
 * Scroll root for a form. On iOS the native scroll view insets its content by the part
 * the keyboard covers and scrolls the focused field above it, measuring both in window
 * coordinates. Android has no such inset, and since apps draw edge to edge the window no
 * longer shrinks for the keyboard either, so there the scroll view sits in a
 * `KeyboardAvoidingView` that shortens it to the keyboard's top edge; Android's scroll
 * view then brings the focused field into view.
 *
 * `KeyboardAvoidingView` cannot do this inside a native sheet: it compares its layout
 * position with the keyboard's position on screen, and under the new architecture
 * neither its layout nor `measureInWindow` includes where iOS placed the sheet. The
 * form's lower fields stay under the keyboard by that distance. Do not put this inside
 * `KeyboardAwareScreen`: both would avoid the keyboard and the form would scroll past
 * its end.
 */
export const KeyboardAwareScrollView: ForwardRefComponent<
  ScrollViewInstance,
  KeyboardAwareScrollViewProps
> = React.forwardRef(
  (
    {
      className,
      automaticallyAdjustKeyboardInsets = true,
      keyboardShouldPersistTaps = 'handled',
      ...props
    },
    ref
  ) => {
    const scroll = (
      <ScrollView
        ref={ref}
        className={cn('flex-1 bg-background', className)}
        automaticallyAdjustKeyboardInsets={automaticallyAdjustKeyboardInsets}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        {...props}
      />
    );
    if (Platform.OS !== 'android') return scroll;
    return (
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        {scroll}
      </KeyboardAvoidingView>
    );
  }
);

KeyboardAwareScrollView.displayName = 'KeyboardAwareScrollView';
