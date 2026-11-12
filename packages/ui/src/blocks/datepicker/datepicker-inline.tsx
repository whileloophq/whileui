import { useMemo } from 'react';
import { View } from 'react-native';
import { useUniwind } from 'uniwind';
import { Calendar, type DateData } from 'react-native-calendars';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';
import { surfaceRadius } from '../../lib/recipes';
import { CalendarHeader } from './calendar-header';
import { useCalendarTheme, type CalendarTheme } from './use-calendar-theme';

export interface DatePickerInlineProps {
  /** Controlled: selected date in YYYY-MM-DD */
  value?: string | null;
  /** Controlled: change handler */
  onValueChange?: (date: string | null) => void;
  /** Minimum selectable date YYYY-MM-DD */
  minDate?: string;
  /** Maximum selectable date YYYY-MM-DD */
  maxDate?: string;
  /** Override calendar theme (RN color strings) */
  theme?: CalendarTheme;
  className?: string;
}

export function DatePickerInline({
  value,
  onValueChange,
  minDate,
  maxDate,
  theme: customTheme,
  className,
}: DatePickerInlineProps) {
  const { theme } = useUniwind();
  const visual = useVisualTokens();
  const calendarTheme = useCalendarTheme(customTheme);

  const markedDates = useMemo(() => {
    if (!value) return undefined;
    return {
      [value]: {
        selected: true,
        disableTouchEvent: false,
        today: false, // Prefer selected style over "today" when selected date is today
      },
    };
  }, [value]);

  const handleDayPress = (day: DateData) => {
    onValueChange?.(day.dateString);
  };

  return (
    <View
      className={cn('overflow-hidden border-border', className)}
      style={{
        borderRadius: surfaceRadius(visual, 'lg'),
        borderWidth: visual.borderWidthHairline,
      }}
    >
      <Calendar
        key={theme}
        current={value ?? undefined}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        minDate={minDate}
        maxDate={maxDate}
        theme={calendarTheme as Record<string, unknown>}
        customHeader={CalendarHeader}
        enableSwipeMonths
        // Days from the next month were disabled yet still Tab stops, with no role.
        hideExtraDays
      />
    </View>
  );
}
