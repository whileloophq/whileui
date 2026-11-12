import { View } from 'react-native';
import { LocaleConfig } from 'react-native-calendars';
import { Button } from '../../components/button';
import { Text } from '../../components/text';
import { ChevronGlyph } from '../../lib/chevron-glyph';

/** What react-native-calendars hands a `customHeader`. */
interface CalendarHeaderProps {
  /** The shown month, as the library's date object. */
  month: { toString(format: string): string };
  addMonth: (count: number) => void;
  /** First day of the week, 0 for Sunday, as passed to `Calendar`. */
  firstDay?: number;
}

/** Short day names from the app's `LocaleConfig`, starting on `firstDay`. */
function dayNames(firstDay = 0): string[] {
  const locale = LocaleConfig.locales[LocaleConfig.defaultLocale] as
    { dayNamesShort?: string[] } | undefined;
  const names = locale?.dayNamesShort ?? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const shift = firstDay % 7;
  return names.slice(shift).concat(names.slice(0, shift));
}

/**
 * The month row above a calendar, built from WhileUI buttons. The calendar library drew
 * its arrows as role-less views inside an "adjustable" header: on web Tab reached them
 * and Enter and Space did nothing. Here they are named buttons with a focus ring, and the
 * month is a polite live region, so moving announces where you are. Month and day names
 * come from `LocaleConfig`, as the library's own header takes them.
 */
export function CalendarHeader({ month, addMonth, firstDay }: CalendarHeaderProps) {
  return (
    <View className="pb-2">
      <View className="flex-row items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          accessibilityLabel="Previous month"
          onPress={() => addMonth(-1)}
        >
          <ChevronGlyph direction="left" size={14} />
        </Button>
        <Text variant="title" aria-live="polite">
          {month.toString('MMMM yyyy')}
        </Text>
        <Button
          variant="ghost"
          size="icon"
          accessibilityLabel="Next month"
          onPress={() => addMonth(1)}
        >
          <ChevronGlyph direction="right" size={14} />
        </Button>
      </View>
      {/* Column labels for the grid below; each day cell already says its full date. */}
      <View aria-hidden className="mt-1 flex-row">
        {dayNames(firstDay).map((name) => (
          <Text key={name} variant="caption" className="flex-1 text-center text-muted-foreground">
            {name}
          </Text>
        ))}
      </View>
    </View>
  );
}
