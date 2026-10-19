import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../components/text';
import { Button, ButtonText } from '../../components/button';
import { cn } from '../../lib/cn';
import { focusRingInset } from '../../lib/focus-ring';
import { useThemeColors } from '../../lib/theme-colors';
import { useVisualTokens } from '../../lib/visual-tokens';
import { fieldRecipe, surfacePadding, surfaceRadius, typographyStyle } from '../../lib/recipes';
import { useFrostedSurface, type FrostedSurfaceProps } from '../../lib/frosted-surface';

export type HourCycle = 'h12' | 'h23';

export interface TimePickerModalProps extends FrostedSurfaceProps {
  /** Controlled: selected time as `HH:MM`, 24-hour, or null for none. */
  value?: string | null;
  /** Controlled: change handler. Always receives `HH:MM` in 24-hour form. */
  onValueChange?: (time: string | null) => void;
  /** Modal open state */
  open: boolean;
  /** Modal open change handler */
  onOpenChange: (open: boolean) => void;
  /** Minutes between options. 1 by default; 5 or 15 for a coarser pick. */
  minuteStep?: number;
  /** 12-hour with AM/PM, or 24-hour. Defaults to the device locale's preference. */
  hourCycle?: HourCycle;
  /** Trigger element. If not provided, no trigger is rendered. */
  trigger?: React.ReactNode;
  /** Title shown in modal header */
  title?: string;
  /** Button label for confirm */
  confirmLabel?: string;
  className?: string;
}

const ITEM_HEIGHT = 44;
/** Rows visible in a wheel. Odd, so one row sits centred under the selection band. */
const VISIBLE_ROWS = 5;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;
const WHEEL_PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ROWS / 2);

const pad2 = (n: number) => String(n).padStart(2, '0');

/** The locale's clock, so a US device gets AM/PM and most of the world does not. */
function localeHourCycle(): HourCycle {
  try {
    const cycle = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions()
      .hourCycle;
    return cycle === 'h11' || cycle === 'h12' ? 'h12' : 'h23';
  } catch {
    return 'h23';
  }
}

function parseTime(value: string | null | undefined): { hour: number; minute: number } | null {
  if (!value) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

/** `HH:MM` as the locale writes it — "10:30 PM" or "22:30". */
function formatDisplayTime(value: string | null | undefined, hourCycle?: HourCycle): string {
  const parsed = parseTime(value);
  if (!parsed) return 'Select time';
  const date = new Date(2000, 0, 1, parsed.hour, parsed.minute);
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    ...(hourCycle ? { hour12: hourCycle === 'h12' } : {}),
  });
}

interface WheelProps {
  label: string;
  options: { value: number; label: string }[];
  selected: number;
  onSelect: (value: number) => void;
}

/**
 * One scrolling column. Scrolls snap to a row, a tap selects a row, and the whole
 * column is a single adjustable element for assistive tech and the keyboard — sixty
 * minute rows as sixty tab stops would be nobody's idea of operable.
 */
function Wheel({ label, options, selected, onSelect }: WheelProps) {
  const visual = useVisualTokens();
  const colors = useThemeColors();
  const ref = useRef<ScrollViewInstance | null>(null);
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === selected)
  );

  // Keep the band on the selected row when the value changes from outside the wheel
  // (a tap, a keyboard step, the initial value), not after the user's own scroll.
  const lastScrolledIndex = useRef(-1);
  useEffect(() => {
    if (lastScrolledIndex.current === index) return;
    lastScrolledIndex.current = index;
    ref.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: Platform.OS !== 'web' });
  }, [index]);

  const settle = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
      const clamped = Math.min(options.length - 1, Math.max(0, next));
      lastScrolledIndex.current = clamped;
      const option = options[clamped];
      if (option && option.value !== selected) onSelect(option.value);
    },
    [onSelect, options, selected]
  );

  const step = useCallback(
    (delta: number) => {
      const next = (index + delta + options.length) % options.length;
      onSelect(options[next]!.value);
    },
    [index, onSelect, options]
  );

  const current = options[index]?.label ?? '';

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: current }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'increment') step(1);
        if (event.nativeEvent.actionName === 'decrement') step(-1);
      }}
      // Hardware keyboard on web: the column is one focusable element and the arrows
      // move it, matching how a native time wheel behaves under VoiceOver.
      {...(Platform.OS === 'web'
        ? {
            focusable: true,
            onKeyDown: (event: { nativeEvent: { key: string }; preventDefault: () => void }) => {
              if (event.nativeEvent.key === 'ArrowUp') {
                event.preventDefault();
                step(-1);
              } else if (event.nativeEvent.key === 'ArrowDown') {
                event.preventDefault();
                step(1);
              }
            },
          }
        : null)}
      className={cn('flex-1 overflow-hidden', focusRingInset)}
      style={{ height: WHEEL_HEIGHT, borderRadius: surfaceRadius(visual, 'lg') }}
    >
      {/* The selection band, under the rows so the chosen row reads through it. */}
      <View
        pointerEvents="none"
        className="absolute left-0 right-0 bg-muted"
        style={{
          top: WHEEL_PADDING,
          height: ITEM_HEIGHT,
          borderRadius: surfaceRadius(visual, 'md'),
        }}
      />
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        nestedScrollEnabled
        contentContainerStyle={{ paddingVertical: WHEEL_PADDING }}
        contentOffset={{ x: 0, y: index * ITEM_HEIGHT }}
        onMomentumScrollEnd={settle}
        onScrollEndDrag={Platform.OS === 'web' ? settle : undefined}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        {options.map((option) => {
          const on = option.value === selected;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              focusable={false}
              className="items-center justify-center"
              style={{ height: ITEM_HEIGHT }}
            >
              <Text
                className={on ? 'font-medium text-foreground' : 'text-muted-foreground'}
                style={{
                  ...typographyStyle(visual, on ? 'title' : 'body'),
                  color: on ? colors.foreground : colors.mutedForeground,
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function TimePickerModalSession({
  value,
  onValueChange,
  open,
  onOpenChange,
  minuteStep = 1,
  hourCycle: hourCycleProp,
  trigger,
  title = 'Select time',
  confirmLabel = 'Done',
  className,
  frosted = false,
  blurIntensity,
  blurTintToken,
}: TimePickerModalProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const visual = useVisualTokens();
  const frostedSurface = useFrostedSurface({
    frosted,
    blurIntensity,
    blurTintToken,
    defaultTintToken: 'surfaceTranslucent',
    defaultBlurPreset: 'medium',
  });
  const hourCycle = hourCycleProp ?? localeHourCycle();
  const step = Math.min(30, Math.max(1, Math.round(minuteStep)));

  // The draft opens on the current value, or on the current clock time rounded to the
  // step, so the first confirm without touching anything records "now".
  const initial = (() => {
    const parsed = parseTime(value);
    if (parsed) return parsed;
    const now = new Date();
    return { hour: now.getHours(), minute: Math.floor(now.getMinutes() / step) * step };
  })();
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);

  const hours =
    hourCycle === 'h12'
      ? Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: String(i + 1) }))
      : Array.from({ length: 24 }, (_, i) => ({ value: i, label: pad2(i) }));
  const minutes = Array.from({ length: Math.ceil(60 / step) }, (_, i) => ({
    value: i * step,
    label: pad2(i * step),
  }));
  const periods = [
    { value: 0, label: 'AM' },
    { value: 1, label: 'PM' },
  ];

  const period = hour >= 12 ? 1 : 0;
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  const handleConfirm = useCallback(() => {
    onValueChange?.(`${pad2(hour)}:${pad2(minute)}`);
    onOpenChange(false);
  }, [hour, minute, onOpenChange, onValueChange]);

  const handleDismiss = useCallback(() => onOpenChange(false), [onOpenChange]);
  const handleOpen = useCallback(() => onOpenChange(true), [onOpenChange]);

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
            collapses the wheels and their controls into one accessibility element. */}
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
              <Text
                accessibilityRole="header"
                className="font-medium text-foreground"
                style={typographyStyle(visual, 'body')}
              >
                {title}
              </Text>
              <Button size="sm" onPress={handleConfirm}>
                <ButtonText>{confirmLabel}</ButtonText>
              </Button>
            </View>
            <View
              className="flex-row items-center"
              style={{ padding: surfacePadding(visual, 'sm'), gap: visual.controlPaddingYDefault }}
            >
              <Wheel
                label="Hour"
                options={hours}
                selected={hourCycle === 'h12' ? hour12 : hour}
                onSelect={(next) =>
                  setHour(hourCycle === 'h12' ? (next % 12) + (period === 1 ? 12 : 0) : next)
                }
              />
              <Text
                className="text-muted-foreground"
                style={typographyStyle(visual, 'title')}
                accessibilityElementsHidden
                importantForAccessibility="no"
              >
                :
              </Text>
              <Wheel label="Minute" options={minutes} selected={minute} onSelect={setMinute} />
              {hourCycle === 'h12' ? (
                <Wheel
                  label="AM or PM"
                  options={periods}
                  selected={period}
                  onSelect={(next) => setHour((hour % 12) + (next === 1 ? 12 : 0))}
                />
              ) : null}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

/**
 * A time chosen on two wheels — three with AM/PM — in the same bottom sheet as
 * `DatePickerModal`, so a form's date and time fields open the same way.
 */
export function TimePickerModal(props: TimePickerModalProps) {
  // Remount per opening so the draft starts from the value each time, as the date
  // picker does; a draft that outlives a cancel would reopen on the abandoned pick.
  const sessionKey = props.open ? 'open' : 'closed';
  return <TimePickerModalSession key={sessionKey} {...props} />;
}

/** Compact trigger showing the formatted time. Use as TimePickerModal's trigger prop. */
export function TimePickerTrigger({
  value,
  placeholder = 'Select time',
  hourCycle,
  className,
}: {
  value?: string | null;
  placeholder?: string;
  hourCycle?: HourCycle;
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
        {value ? formatDisplayTime(value, hourCycle) : placeholder}
      </Text>
      <View className="ml-2 shrink-0 h-2 w-2 rotate-45 border-b-2 border-r-2 border-muted-foreground" />
    </View>
  );
}

export { formatDisplayTime, parseTime };
