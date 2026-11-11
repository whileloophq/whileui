import React from 'react';
import { View, type ViewProps } from 'react-native';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { HeaderBackButton } from './header';

export interface PageHeaderProps extends ViewProps {
  /** The screen's heading, announced as a header. */
  title: string;
  /** A short line above the title naming where this screen sits, such as a group name. */
  kicker?: string;
  /** A line under the title. */
  description?: string;
  /** Leads the title: an avatar or identity mark for the thing this screen is about. */
  mark?: React.ReactNode;
  /** Trailing controls, such as an edit or share button. */
  actions?: React.ReactNode;
  /** Puts a back button first, at the leading edge where both platforms put it. */
  onBack?: () => void;
  /** Content under the header row, such as tabs or a search field. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * The heading at the top of a screen's content: kicker over title, an optional mark and
 * back button leading, actions trailing. `Header` is the app bar above it; this is the
 * page's own title, inside the scroll view.
 */
export function PageHeader({
  title,
  kicker,
  description,
  mark,
  actions,
  onBack,
  children,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <View className={cn('gap-2', className)} {...props}>
      <View className="flex-row items-center gap-3">
        {onBack ? <HeaderBackButton onPress={onBack} className="-ml-2" /> : null}
        {mark}
        <View className="min-w-0 flex-1">
          {kicker ? (
            <Text variant="eyebrow" numberOfLines={1}>
              {kicker}
            </Text>
          ) : null}
          <Text variant="heading" accessibilityRole="header" numberOfLines={2}>
            {title}
          </Text>
          {description ? <Text variant="caption">{description}</Text> : null}
        </View>
        {actions ? <View className="shrink-0 flex-row items-center gap-1.5">{actions}</View> : null}
      </View>
      {children}
    </View>
  );
}
