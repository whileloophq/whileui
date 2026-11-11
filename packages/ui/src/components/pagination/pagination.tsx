import { View, type ViewProps } from 'react-native';
import { cn } from '../../lib/cn';
import { Button, ButtonText } from '../button';
import { Text } from '../text';

export interface PaginationProps extends ViewProps {
  /** The current page, from 1. */
  page: number;
  totalPages: number;
  /** Shown as "83 total" at the leading edge when given. */
  totalItems?: number;
  onPageChange: (page: number) => void;
  /** @default 'Previous' */
  previousLabel?: string;
  /** @default 'Next' */
  nextLabel?: string;
  className?: string;
}

/**
 * "83 total · Previous · Page 2 of 4 · Next" under a paged list. Renders nothing when
 * there is one page. The page line is a polite live region, so a screen reader hears
 * the new page after Previous or Next.
 */
export function Pagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  className,
  ...props
}: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <View className={cn('flex-row items-center justify-between gap-2', className)} {...props}>
      {totalItems !== undefined ? <Text variant="caption">{totalItems} total</Text> : <View />}
      <View className="flex-row items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          accessibilityLabel={`${previousLabel} page`}
          disabled={page <= 1}
          onPress={() => onPageChange(page - 1)}
        >
          <ButtonText>{previousLabel}</ButtonText>
        </Button>
        <Text variant="caption" className="text-foreground" aria-live="polite">
          Page {page} of {totalPages}
        </Text>
        <Button
          variant="ghost"
          size="sm"
          accessibilityLabel={`${nextLabel} page`}
          disabled={page >= totalPages}
          onPress={() => onPageChange(page + 1)}
        >
          <ButtonText>{nextLabel}</ButtonText>
        </Button>
      </View>
    </View>
  );
}
