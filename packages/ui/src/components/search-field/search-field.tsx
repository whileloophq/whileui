import React from 'react';
import { Pressable, View, type TextInputInstance } from 'react-native';
import { cn } from '../../lib/cn';
import { focusRing } from '../../lib/focus-ring';
import type { ForwardRefComponent } from '../../lib/ref-types';
import { Input, type InputProps } from '../input';
import { Text } from '../text';

export interface SearchFieldProps extends Omit<InputProps, 'prefix' | 'suffix'> {
  /** Shown in the empty field and used as its accessible name. @default 'Search' */
  placeholder?: string;
  /** The text in the field. */
  value: string;
  onChangeText: (text: string) => void;
  /** Replaces the drawn magnifier, for an app with its own icon set. */
  icon?: React.ReactNode;
  /** @default 'Clear search' */
  clearLabel?: string;
}

/** A magnifier from two views: the package carries no icon set. */
function Magnifier() {
  return (
    <View aria-hidden style={{ width: 16, height: 16 }}>
      <View
        className="border-muted-foreground"
        style={{ width: 11, height: 11, borderWidth: 2, borderRadius: 6 }}
      />
      <View
        className="bg-muted-foreground"
        style={{
          position: 'absolute',
          width: 2,
          height: 6,
          borderRadius: 1,
          left: 11,
          top: 9,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
}

/**
 * A text field for searching: a leading magnifier, a clear button once there is text,
 * and a search return key. Pair it with `useDebouncedSearch` for a query that waits for
 * a pause in typing.
 */
export const SearchField: ForwardRefComponent<TextInputInstance, SearchFieldProps> =
  React.forwardRef(
    (
      { value, onChangeText, icon, clearLabel = 'Clear search', placeholder = 'Search', ...props },
      ref
    ) => (
      <Input
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        accessibilityLabel={placeholder}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
        prefix={icon ?? <Magnifier />}
        suffix={
          value ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={clearLabel}
              hitSlop={12}
              onPress={() => onChangeText('')}
              className={cn('h-6 w-6 items-center justify-center rounded-full bg-muted', focusRing)}
            >
              <Text
                aria-hidden
                className="text-muted-foreground"
                style={{ fontSize: 16, lineHeight: 18 }}
              >
                ×
              </Text>
            </Pressable>
          ) : null
        }
        {...props}
      />
    )
  );

SearchField.displayName = 'SearchField';
