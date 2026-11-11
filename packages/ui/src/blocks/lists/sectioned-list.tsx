import React, { Fragment } from 'react';
import { View, type ViewProps } from 'react-native';
import { Separator } from '../../components/separator';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';

export interface SectionedListProps<T> extends ViewProps {
  /** In display order; a section starts wherever `sectionOf` changes. */
  items: readonly T[];
  /** The heading an item belongs under, such as its month. */
  sectionOf: (item: T) => string;
  keyOf: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  /** Draw a divider between rows in a section. @default true */
  separators?: boolean;
  className?: string;
}

/**
 * Rows grouped under a heading wherever the section changes — a month, a day, a letter.
 * With every row in one section it draws no heading, which would only repeat what the
 * reader can see. Headings are headers, so a screen reader can jump between them.
 *
 * Every item renders: for a bounded list such as one page of results. Use a virtualized
 * `SectionList` for one that can grow without limit.
 */
export function SectionedList<T>({
  items,
  sectionOf,
  keyOf,
  renderItem,
  separators = true,
  className,
  ...props
}: SectionedListProps<T>) {
  const sections = items.map(sectionOf);
  const headed = new Set(sections).size > 1;

  return (
    <View className={cn('w-full', className)} {...props}>
      {items.map((item, index) => {
        const starts = index === 0 || sections[index] !== sections[index - 1];
        return (
          <Fragment key={keyOf(item)}>
            {headed && starts ? (
              <Text
                variant="eyebrow"
                accessibilityRole="header"
                className="border-b border-border bg-muted px-3 py-1.5"
              >
                {sections[index]}
              </Text>
            ) : separators && index > 0 ? (
              <Separator />
            ) : null}
            {renderItem(item)}
          </Fragment>
        );
      })}
    </View>
  );
}
