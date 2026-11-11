import React, { useEffect } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import {
  Separator,
  Switch,
  Text,
  cn,
  focusRing,
  useIconColors,
  useMotionPolicy,
  useThemeColors,
} from '@thewhileloop/whileui';
import {
  FIRING_PEAK,
  FIRING_STAGES,
  MEMBER,
  PIECES,
  FEATURED_SESSION,
  SESSIONS,
  STUDIO_BOARD,
  images,
  type Tone,
} from '../data';
import { FiringCurve } from '../firing-curve';
import { mono, serifItalic } from '../fonts';
import { Eyebrow, GUTTER, Reveal, Scrim, SectionHeader } from '../ui';
import { formatTemp, type LiveFiring } from '../use-live-firing';
import { WitnessCones } from '../witness-cones';

const HERO_HEIGHT = 430;

const AVATAR_TONE: Record<Tone, { bg: string; text: string }> = {
  primary: { bg: 'bg-primary', text: 'text-primary-foreground' },
  accent: { bg: 'bg-accent', text: 'text-accent-foreground' },
  muted: { bg: 'bg-secondary', text: 'text-secondary-foreground' },
};

function greetingFor(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function LiveDot() {
  const motion = useMotionPolicy();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!motion.animationsEnabled) return;
    opacity.value = withRepeat(
      withSequence(withTiming(0.2, { duration: 700 }), withTiming(1, { duration: 700 })),
      -1
    );
  }, [motion.animationsEnabled, opacity]);

  const pulse = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={pulse} className="h-2 w-2 rounded-full bg-primary" />;
}

function Hero({ firing }: { firing: LiveFiring }) {
  const insets = useSafeAreaInsets();
  const stage = FIRING_STAGES[firing.stageIndex];
  const firstName = MEMBER.name.split(' ')[0];
  const hour = new Date().getHours();

  return (
    <View style={{ height: HERO_HEIGHT + insets.top }}>
      <Image
        source={images.kiln}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        className="absolute inset-0 h-full w-full"
      />
      <Scrim edge="top" height={insets.top + 120} tone="shade" />
      <Scrim edge="bottom" height={260} tone="page" />

      <View
        className="flex-1 justify-between"
        style={{ paddingTop: insets.top + 14, paddingHorizontal: GUTTER }}
      >
        <View>
          <Text className="text-3xl text-white" style={serifItalic}>
            Clayhouse
          </Text>
          <Text className="mt-1 text-sm text-white/80">
            {greetingFor(hour)}, {firstName}. Your pieces are in.
          </Text>
        </View>

        <View className="pb-2">
          <View className="flex-row items-center gap-2">
            <LiveDot />
            <Eyebrow className="text-foreground">Kiln 2 · glaze firing</Eyebrow>
          </View>
          <View
            accessible
            accessibilityLabel={`Kiln 2 is at ${formatTemp(firing.temp)}, ${stage.label}`}
            className="mt-1 flex-row items-start"
          >
            <Text className="text-8xl font-bold leading-none text-foreground">
              {firing.temp.toLocaleString('en-US')}
            </Text>
            <Text className="mt-3 text-3xl font-bold text-muted-foreground">°C</Text>
          </View>
          <Text className="mt-1 text-base text-foreground">
            {stage.label}
            <Text className="text-muted-foreground">
              {firing.atPeak ? ' · cone 10 is down' : ` · ${firing.minutesToPeak} min to cone 10`}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

function FiringPanel({
  firing,
  alertAtPeak,
  onAlertAtPeakChange,
  onOpenSchedule,
}: {
  firing: LiveFiring;
  alertAtPeak: boolean;
  onAlertAtPeakChange: (next: boolean) => void;
  onOpenSchedule: () => void;
}) {
  return (
    <View style={{ paddingHorizontal: GUTTER }}>
      <Pressable
        accessibilityRole="button"
        accessibilityHint="Opens tonight's firing schedule"
        onPress={onOpenSchedule}
        className={cn('rounded-lg active:opacity-80', focusRing)}
      >
        <FiringCurve temp={firing.temp} />
      </Pressable>

      <Separator className="mt-6" />
      <View className="flex-row items-center justify-between py-4">
        <View className="gap-2">
          <Eyebrow>Witness cones</Eyebrow>
          <WitnessCones temp={firing.temp} />
        </View>
        <View className="items-end gap-2">
          <Eyebrow>Alert at {formatTemp(FIRING_PEAK)}</Eyebrow>
          <Switch
            checked={alertAtPeak}
            onCheckedChange={onAlertAtPeakChange}
            accessibilityLabel="Alert me when cone 10 drops"
          />
        </View>
      </View>
      <Separator />
    </View>
  );
}

function PiecesInKiln() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: GUTTER, gap: 12 }}
    >
      {PIECES.map((piece) => (
        <View key={piece.id} className="w-40">
          <Image
            source={images[piece.image]}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            className="h-48 w-40 rounded-xl"
          />
          <Text className="mt-3 text-base font-semibold text-foreground">{piece.name}</Text>
          <Text className="text-sm text-muted-foreground">{piece.glaze}</Text>
          <Text className="mt-1 text-xs text-muted-foreground" style={mono}>
            {piece.spot.toUpperCase()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

function StudioBoard() {
  return (
    <View style={{ paddingHorizontal: GUTTER }}>
      {STUDIO_BOARD.map((post, i) => (
        <View key={post.id}>
          {i > 0 ? <Separator /> : null}
          <View className="flex-row gap-3 py-4">
            <View
              className={cn(
                'h-10 w-10 items-center justify-center rounded-full',
                AVATAR_TONE[post.tone].bg
              )}
            >
              <Text className={cn('text-sm font-semibold', AVATAR_TONE[post.tone].text)}>
                {post.initials}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-baseline justify-between">
                <Text className="text-base font-semibold text-foreground">{post.author}</Text>
                <Text className="text-xs text-muted-foreground" style={mono}>
                  {post.time}
                </Text>
              </View>
              <Text className="mt-0.5 text-base leading-snug text-foreground/85">
                {post.message}
              </Text>
              {post.image ? (
                <Image
                  source={images[post.image]}
                  resizeMode="cover"
                  accessibilityIgnoresInvertColors
                  className="mt-3 h-44 w-full rounded-xl"
                />
              ) : null}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const SESSION_TINT = {
  primary: { tile: 'bg-primary-soft', icon: 'primary' },
  accent: { tile: 'bg-secondary-soft', icon: 'accent' },
} as const;

/** A bento of what's bookable: one photo-led tile and the quieter sessions beside it. */
function Sessions({ onBook }: { onBook: () => void }) {
  const colors = useIconColors();
  const themeColors = useThemeColors();
  return (
    <View className="h-80 flex-row gap-3" style={{ paddingHorizontal: GUTTER }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Book ${FEATURED_SESSION.title}, ${FEATURED_SESSION.when}`}
        onPress={onBook}
        className={cn('flex-[1.15] overflow-hidden rounded-xl active:opacity-90', focusRing)}
      >
        <Image
          source={images[FEATURED_SESSION.image]}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          className="absolute inset-0 h-full w-full"
        />
        <Scrim edge="bottom" height={160} tone="shade" />
        <View className="flex-1 justify-between p-4">
          <View className="h-9 w-9 items-center justify-center self-end rounded-full bg-background/90">
            <Feather name="arrow-up-right" size={18} color={colors.foreground} />
          </View>
          <View>
            <Text className="text-2xl font-bold text-white">{FEATURED_SESSION.title}</Text>
            <Text className="text-sm text-white/80">{FEATURED_SESSION.when}</Text>
          </View>
        </View>
      </Pressable>
      <View className="flex-1 gap-3">
        {SESSIONS.map((session) => (
          <Pressable
            key={session.id}
            accessibilityRole="button"
            accessibilityLabel={`Book ${session.title}, ${session.when}`}
            onPress={onBook}
            className={cn(
              'flex-1 justify-between rounded-xl p-4 active:opacity-90',
              SESSION_TINT[session.tint].tile,
              focusRing
            )}
          >
            <View className="self-end">
              <Feather
                name={session.icon}
                size={18}
                color={themeColors[SESSION_TINT[session.tint].icon]}
              />
            </View>
            <View>
              <Text className="text-2xl font-bold text-foreground">{session.title}</Text>
              <Text className="text-sm text-muted-foreground">{session.when}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function StudioScreen({
  firing,
  alertAtPeak,
  onAlertAtPeakChange,
  onOpenSchedule,
  onBook,
}: {
  firing: LiveFiring;
  alertAtPeak: boolean;
  onAlertAtPeakChange: (next: boolean) => void;
  onOpenSchedule: () => void;
  onBook: () => void;
}) {
  return (
    <View>
      <Hero firing={firing} />
      <Reveal order={0}>
        <FiringPanel
          firing={firing}
          alertAtPeak={alertAtPeak}
          onAlertAtPeakChange={onAlertAtPeakChange}
          onOpenSchedule={onOpenSchedule}
        />
      </Reveal>

      <Reveal order={1}>
        <SectionHeader title="In this firing" action="Schedule" onAction={onOpenSchedule} />
        <PiecesInKiln />
      </Reveal>

      <Reveal order={2}>
        <SectionHeader title="This week" action="Book" onAction={onBook} />
        <Sessions onBook={onBook} />
      </Reveal>

      <Reveal order={3}>
        <SectionHeader title="Studio board" />
        <StudioBoard />
      </Reveal>
    </View>
  );
}
