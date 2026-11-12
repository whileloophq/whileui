import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useUniwind } from 'uniwind';
import { Calendar, type DateData } from 'react-native-calendars';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { useThemeColors } from '../../lib/theme-colors';
import { useVisualTokens } from '../../lib/visual-tokens';
import { surfaceRadius, typographyStyle } from '../../lib/recipes';
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
  const colors = useThemeColors();
  const visual = useVisualTokens();
  const calendarTheme = useCalendarTheme(customTheme);
  const arrowColor =
    calendarTheme.arrowColor ??
    calendarTheme.monthTextColor ??
    calendarTheme.dayTextColor ??
    colors.foreground;
  const arrowFontSize = typographyStyle(visual, 'body').fontSize;
  const renderArrow = useCallback(
    (direction: 'left' | 'right') => (
      <Text className="font-medium" style={{ color: arrowColor, fontSize: arrowFontSize }}>
        {direction === 'left' ? '<' : '>'}
      </Text>
    ),
    [arrowColor, arrowFontSize]
  );

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
        renderArrow={renderArrow}
        enableSwipeMonths
        // Days from the next month were disabled yet still Tab stops, with no role.
        hideExtraDays
      />
    </View>
  );
}
