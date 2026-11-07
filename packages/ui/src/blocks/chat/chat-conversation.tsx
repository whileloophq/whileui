import React, { useCallback, useRef } from 'react';
import {
  ScrollView,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
  type ScrollViewProps,
} from 'react-native';
import { cn } from '../../lib/cn';
import type { ForwardRefComponent } from '../../lib/ref-types';

const BOTTOM_THRESHOLD = 48;

/** ScrollView viewport for a bounded active transcript; virtualize unbounded history. */
export interface ChatConversationProps extends ScrollViewProps {
  contentContainerClassName?: string;
}

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

const ChatConversation: ForwardRefComponent<ScrollViewInstance, ChatConversationProps> =
  React.forwardRef(
    (
      {
        className,
        contentContainerClassName,
        contentContainerStyle,
        keyboardShouldPersistTaps = 'handled',
        onContentSizeChange,
        onScroll,
        scrollEventThrottle = 64,
        children,
        ...props
      },
      forwardedRef
    ) => {
      const scrollRef = useRef<ScrollViewInstance>(null);
      const followsOutputRef = useRef(true);

      const setRef = useCallback(
        (instance: ScrollViewInstance | null) => {
          scrollRef.current = instance;
          assignRef(forwardedRef, instance);
        },
        [forwardedRef]
      );

      const handleScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
          const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
          const distanceFromBottom =
            contentSize.height - layoutMeasurement.height - contentOffset.y;
          followsOutputRef.current = distanceFromBottom <= BOTTOM_THRESHOLD;
          onScroll?.(event);
        },
        [onScroll]
      );

      const handleContentSizeChange = useCallback(
        (width: number, height: number) => {
          onContentSizeChange?.(width, height);
          if (followsOutputRef.current) {
            scrollRef.current?.scrollToEnd({ animated: true });
          }
        },
        [onContentSizeChange]
      );

      return (
        <ScrollView
          ref={setRef}
          className={cn('flex-1', className)}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          onContentSizeChange={handleContentSizeChange}
          onScroll={handleScroll}
          scrollEventThrottle={scrollEventThrottle}
          {...props}
        >
          <View
            className={cn('w-full max-w-3xl flex-1 self-center', contentContainerClassName)}
            style={contentContainerStyle}
          >
            {children}
          </View>
        </ScrollView>
      );
    }
  );

ChatConversation.displayName = 'ChatConversation';

export { ChatConversation };
