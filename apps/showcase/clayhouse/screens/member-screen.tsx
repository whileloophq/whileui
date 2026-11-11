import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import {
  Button,
  ButtonText,
  ListItem,
  Separator,
  Switch,
  Text,
  UsageBar,
  useIconColors,
  useToast,
} from '@thewhileloop/whileui';
import { MEMBER, images } from '../data';
import { mono, serifItalic } from '../fonts';
import { GUTTER, Reveal, Scrim, SectionHeader, type IconName } from '../ui';

const COVER_HEIGHT = 220;

const ALERTS: { key: string; icon: IconName; title: string; subtitle: string }[] = [
  {
    key: 'firing',
    icon: 'thermometer',
    title: 'Firing alerts',
    subtitle: 'Peak, cool-down and unload',
  },
  {
    key: 'pickup',
    icon: 'package',
    title: 'Pickup reminders',
    subtitle: 'When your pieces reach the shelf',
  },
  {
    key: 'tiles',
    icon: 'image',
    title: 'Share test tiles',
    subtitle: 'Post results to the studio board',
  },
];

/** The membership as the card a member actually carries into the studio. */
function StudioPass() {
  return (
    <View
      accessible
      accessibilityLabel={`Studio pass number ${MEMBER.number}, ${MEMBER.name}, open studio, $145 a month, renews 1 December`}
      className="overflow-hidden rounded-xl bg-primary p-5"
    >
      <Text className="absolute -bottom-10 -right-2 text-[180px] font-bold leading-none text-primary-foreground/10">
        C
      </Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-xs tracking-widest text-primary-foreground/80" style={mono}>
          CLAYHOUSE · OPEN STUDIO
        </Text>
        <Text className="text-xs text-primary-foreground/80" style={mono}>
          No. {MEMBER.number}
        </Text>
      </View>
      <Text className="mt-10 text-4xl text-primary-foreground" style={serifItalic}>
        {MEMBER.name}
      </Text>
      <View className="mt-4 flex-row gap-8">
        <View>
          <Text className="text-xs text-primary-foreground/70" style={mono}>
            PLAN
          </Text>
          <Text className="text-base font-semibold text-primary-foreground">$145 / month</Text>
        </View>
        <View>
          <Text className="text-xs text-primary-foreground/70" style={mono}>
            RENEWS
          </Text>
          <Text className="text-base font-semibold text-primary-foreground">1 December</Text>
        </View>
      </View>
    </View>
  );
}

export function MemberScreen() {
  const insets = useSafeAreaInsets();
  const icons = useIconColors();
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(() => new Set(['firing', 'pickup']));

  const toggle = (key: string, on: boolean) =>
    setEnabled((prev) => {
      const next = new Set(prev);
      if (on) next.add(key);
      else next.delete(key);
      return next;
    });

  return (
    <View>
      <View style={{ height: COVER_HEIGHT + insets.top }}>
        <Image
          source={images.hero}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          className="absolute inset-0 h-full w-full"
        />
        <Scrim edge="bottom" height={140} tone="page" />
      </View>

      <Reveal order={0}>
        <View className="-mt-12" style={{ paddingHorizontal: GUTTER }}>
          <View className="h-20 w-20 items-center justify-center rounded-full border-4 border-background bg-accent">
            <Text className="text-2xl font-bold text-accent-foreground">{MEMBER.initials}</Text>
          </View>
          <Text accessibilityRole="header" className="mt-3 text-5xl font-bold text-foreground">
            {MEMBER.name}
          </Text>
          <Text className="mt-1 text-base text-muted-foreground">
            {MEMBER.bio} Member since {MEMBER.since}.
          </Text>
        </View>
      </Reveal>

      <Reveal order={1}>
        <View className="mt-8 gap-3" style={{ paddingHorizontal: GUTTER }}>
          <StudioPass />
          <View className="flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onPress={() =>
                toast({
                  title: 'Membership paused',
                  description: 'Your shelf is held for 30 days.',
                })
              }
            >
              <ButtonText>Pause</ButtonText>
            </Button>
            <Button
              className="flex-1"
              onPress={() =>
                toast({ title: 'Shelf added', description: 'Rack C, second from the top.' })
              }
            >
              <ButtonText>Add a shelf</ButtonText>
            </Button>
          </View>
        </View>
      </Reveal>

      <Reveal order={2}>
        <SectionHeader title="This month" />
        <View className="gap-5" style={{ paddingHorizontal: GUTTER }}>
          <UsageBar label="Kiln shelf space" used={14} limit={20} />
          <UsageBar label="Wheel hours" used={18} limit={20} />
          <UsageBar label="Clay bags" used={3} limit={4} />
        </View>
      </Reveal>

      <Reveal order={3}>
        <SectionHeader title="Alerts" />
        <View style={{ paddingHorizontal: GUTTER }}>
          {ALERTS.map((alert, i) => (
            <View key={alert.key}>
              {i > 0 ? <Separator /> : null}
              <ListItem
                icon={<Feather name={alert.icon} size={18} color={icons.muted} />}
                title={alert.title}
                subtitle={alert.subtitle}
                showBorder={false}
                className="bg-transparent px-0"
                action={
                  <Switch
                    checked={enabled.has(alert.key)}
                    onCheckedChange={(on) => toggle(alert.key, on)}
                    accessibilityLabel={alert.title}
                  />
                }
              />
            </View>
          ))}
        </View>
      </Reveal>
    </View>
  );
}
