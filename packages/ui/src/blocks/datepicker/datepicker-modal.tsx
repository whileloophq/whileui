import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';
import { Calendar, type DateData } from 'react-native-calendars';
import { Text } from '../../components/text';
import { Button, ButtonText } from '../../components/button';
import { cn } from '../../lib/cn';
import { useThemeColors } from '../../lib/theme-colors';
import { useVisualTokens } from '../../lib/visual-tokens';
import { fieldRecipe, surfacePadding, surfaceRadius, typographyStyle } from '../../lib/recipes';
import { useFrostedSurface, type FrostedSurfaceProps } from '../../lib/frosted-surface';
import { useCalendarTheme, type CalendarTheme } from './use-calendar-theme';

export interface DatePickerModalProps extends FrostedSurfaceProps {
  /** Controlled: selected date in YYYY-MM-DD */
  value?: string | null;
  /** Controlled: change handler */
  onValueChange?: (date: string | null) => void;
  /** Modal open state */
  open: boolean;
  /** Modal open change handler */
  onOpenChange: (open: boolean) => void;
  /** Minimum selectable date YYYY-MM-DD */
  minDate?: string;
  /** Maximum selectable date YYYY-MM-DD */
  maxDate?: string;
  /** Override calendar theme (RN color strings) */
  theme?: CalendarTheme;
  /** Trigger element. If not provided, no trigger is rendered. */
  trigger?: React.ReactNode;
  /** Title shown in modal header */
  title?: string;
  /** Button label for confirm */
  confirmLabel?: string;
  className?: string;
}

function formatDisplayDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Select date';
  const d = new Date(dateString + 'T12:00:00');
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function DatePickerModal({
  value,
  onValueChange,
  open,
  onOpenChange,
  minDate,
  maxDate,
  theme: customTheme,
  trigger,
  title = 'Select date',
  confirmLabel = 'Done',
  className,
  frosted = false,
  blurIntensity,
  blurTintToken,
}: DatePickerModalProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useUniwind();
  const colors = useThemeColors();
  const visual = useVisualTokens();
  const frostedSurface = useFrostedSurface({
    frosted,
    blurIntensity,
    blurTintToken,
    defaultTintToken: 'surfaceTranslucent',
    defaultBlurPreset: 'medium',
  });
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
  const [draftDate, setDraftDate] = useState<string | null>(value ?? null);
  const prevOpenRef = useRef(open);

  useEffect(() => {
    if (open && !prevOpenRef.current) {
      setDraftDate(value ?? null);
    } else if (!open && prevOpenRef.current) {
      setDraftDate(null);
    }

    prevOpenRef.current = open;
  }, [open, value]);

  const markedDates = useMemo(() => {
    if (!draftDate) return undefined;
    return {
      [draftDate]: {
        selected: true,
        disableTouchEvent: false,
        today: false,
      },
    };
  }, [draftDate]);

  const handleDayPress = useCallback((day: DateData) => {
    setDraftDate(day.dateString);
  }, []);

  const handleConfirm = useCallback(() => {
    onValueChange?.(draftDate ?? null);
    onOpenChange(false);
    setDraftDate(null);
  }, [draftDate, onOpenChange, onValueChange]);

  const handleDismiss = useCallback(() => {
    onOpenChange(false);
    setDraftDate(null);
  }, [onOpenChange]);

  const handleOpen = useCallback(() => {
    setDraftDate(value ?? null);
    onOpenChange(true);
  }, [onOpenChange, value]);

  return (
    <>
      {trigger ? (
        <Pressable
          accessibilityRole="button"
          onPress={handleOpen}
          className={cn('w-full flex-row items-center border-border bg-muted', className)}
          style={fieldRecipe(visual, 'default')}
        >
          {trigger}
        </Pressable>
      ) : null}

      <Modal
        visible={open}
        transparent
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={handleDismiss}
      >
        {/* Containers only. Pressable defaults to `accessible: true`, which on iOS
            collapses the calendar and its controls into one accessibility element. */}
        <Pressable
          accessible={false}
          importantForAccessibility="no"
          className="flex-1 justify-end"
          style={{ backgroundColor: colors.overlay }}
          onPress={handleDismiss}
        >
          <Pressable
            accessible={false}
            className={cn(
              'border border-border relative overflow-hidden',
              frosted ? 'bg-transparent' : 'bg-background'
            )}
            style={
              [
                {
                  borderTopLeftRadius: surfaceRadius(visual, 'xl'),
                  borderTopRightRadius: surfaceRadius(visual, 'xl'),
                  paddingBottom: Math.max(insets.bottom, surfacePadding(visual, 'sm')),
                } as ViewStyle,
                frostedSurface.surfaceStyle,
              ] as StyleProp<ViewStyle>
            }
            onPress={(e) => e.stopPropagation()}
          >
            {frostedSurface.overlay}
            <View
              className="flex-row items-center justify-between border-b border-border"
              style={{
                paddingHorizontal: surfacePadding(visual, 'sm'),
                paddingVertical: visual.controlPaddingYDefault,
              }}
            >
              <Text className="font-medium text-foreground" style={typographyStyle(visual, 'body')}>
                {title}
              </Text>
              <Button size="sm" onPress={handleConfirm}>
                <ButtonText>{confirmLabel}</ButtonText>
              </Button>
            </View>
            <View style={{ padding: surfacePadding(visual, 'sm') }}>
              <View
                className="border-border overflow-hidden"
                style={{
                  borderRadius: surfaceRadius(visual, 'lg'),
                  borderWidth: visual.borderWidthHairline,
                }}
              >
                <Calendar
                  key={theme}
                  current={draftDate ?? value ?? undefined}
                  onDayPress={handleDayPress}
                  markedDates={markedDates}
                  minDate={minDate}
                  maxDate={maxDate}
                  theme={calendarTheme as Record<string, unknown>}
                  renderArrow={renderArrow}
                  enableSwipeMonths
                />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

/** Compact trigger showing formatted date. Use as DatePickerModal's trigger prop. */
export function DatePickerTrigger({
  value,
  placeholder = 'Select date',
  className,
}: {
  value?: string | null;
  placeholder?: string;
  className?: string;
}) {
  const visual = useVisualTokens();
  return (
    <View className={cn('flex-1 flex-row items-center min-w-0', className)}>
      <Text
        className={cn('flex-1', value ? 'text-foreground' : 'text-muted-foreground')}
        style={typographyStyle(visual, 'body')}
        numberOfLines={1}
      >
        {value ? formatDisplayDate(value) : placeholder}
      </Text>
      <View className="ml-2 shrink-0 h-2 w-2 rotate-45 border-b-2 border-r-2 border-muted-foreground" />
    </View>
  );
}

export { formatDisplayDate };
