import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StatusBar, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import {
  Button,
  ButtonText,
  DatePickerInline,
  FloatingBottomNav,
  FontProvider,
  MotionProvider,
  PortalHost,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  ToastContainer,
  ToastProvider,
  cn,
  focusRing,
  useIconColors,
  useThemeBridge,
  useToast,
} from '@thewhileloop/whileui';
import './global.css';
import { FiringSchedule } from './firing-schedule';
import { fontMap, fonts } from './fonts';
import { FiringsScreen } from './screens/firings-screen';
import { GlazesScreen } from './screens/glazes-screen';
import { MemberScreen } from './screens/member-screen';
import { StudioScreen } from './screens/studio-screen';
import type { IconName } from './ui';
import { formatTemp, useLiveFiring } from './use-live-firing';

void SplashScreen.preventAutoHideAsync();

type Tab = 'studio' | 'firings' | 'glazes' | 'member';

const TABS: { key: Tab; label: string; icon: IconName }[] = [
  { key: 'studio', label: 'Studio', icon: 'sun' },
  { key: 'firings', label: 'Firings', icon: 'thermometer' },
  { key: 'glazes', label: 'Glazes', icon: 'droplet' },
  { key: 'member', label: 'Me', icon: 'user' },
];

/** Room left under the last block so the floating nav never covers it. */
const NAV_CLEARANCE = 120;

function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const insets = useSafeAreaInsets();
  const colors = useIconColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={dark ? 'Switch to day' : 'Switch to night'}
      onPress={onToggle}
      style={{ top: insets.top + 10 }}
      className={cn(
        'absolute right-5 z-10 h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 active:opacity-70',
        focusRing
      )}
    >
      <Feather name={dark ? 'sun' : 'moon'} size={18} color={colors.foreground} />
    </Pressable>
  );
}

function Studio() {
  const { resolvedTheme, setMode } = useThemeBridge({ initialMode: 'system' });
  const dark = resolvedTheme === 'dark';
  const insets = useSafeAreaInsets();
  const colors = useIconColors();
  const { toast } = useToast();
  const firing = useLiveFiring();

  const [tab, setTab] = useState<Tab>('studio');
  const [alertAtPeak, setAlertAtPeak] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState<string | null>(null);

  // Fire the alert the switch promises once, on the tick the kiln reaches peak.
  const wasAtPeak = useRef(firing.atPeak);
  useEffect(() => {
    if (firing.atPeak && !wasAtPeak.current && alertAtPeak) {
      toast({
        title: 'Cone 10 is down',
        description: `Kiln 2 reached ${formatTemp(firing.temp)}. Soaking for 15 minutes.`,
        variant: 'success',
      });
    }
    wasAtPeak.current = firing.atPeak;
  }, [alertAtPeak, firing.atPeak, firing.temp, toast]);

  const navItems = TABS.map((t) => ({
    key: t.key,
    label: t.label,
    icon: (
      <Feather
        name={t.icon}
        size={18}
        color={tab === t.key ? colors.primaryForeground : colors.muted}
      />
    ),
  }));

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={dark || tab === 'studio' ? 'light-content' : 'dark-content'} />

      <View className="flex-1 web:w-full web:max-w-xl web:self-center">
        <ScrollView
          key={tab}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + NAV_CLEARANCE }}
        >
          {tab === 'studio' ? (
            <StudioScreen
              firing={firing}
              alertAtPeak={alertAtPeak}
              onAlertAtPeakChange={setAlertAtPeak}
              onOpenSchedule={() => setScheduleOpen(true)}
              onBook={() => setBookingOpen(true)}
            />
          ) : tab === 'firings' ? (
            <FiringsScreen firing={firing} />
          ) : tab === 'glazes' ? (
            <GlazesScreen />
          ) : (
            <MemberScreen />
          )}
        </ScrollView>
        <ThemeToggle dark={dark} onToggle={() => setMode(dark ? 'light' : 'dark')} />
      </View>

      <View
        pointerEvents="box-none"
        className="absolute inset-x-0 items-center px-5"
        style={{ bottom: Math.max(insets.bottom, 16) }}
      >
        <FloatingBottomNav
          className="w-full web:max-w-md"
          items={navItems}
          activeKey={tab}
          onSelect={(key) => setTab(key as Tab)}
        />
      </View>

      <Sheet open={scheduleOpen} onOpenChange={setScheduleOpen} maxHeight="half">
        <SheetHeader
          title="Cone 10 reduction"
          description={`Kiln 2 is at ${formatTemp(firing.temp)}`}
        />
        <SheetContent>
          <FiringSchedule stageIndex={firing.stageIndex} />
        </SheetContent>
      </Sheet>

      <Sheet open={bookingOpen} onOpenChange={setBookingOpen}>
        <SheetHeader
          title="Book studio time"
          description="Three-hour slots. Cancel up to a day ahead."
        />
        <SheetContent>
          <DatePickerInline value={bookingDate} onValueChange={setBookingDate} />
        </SheetContent>
        <SheetFooter>
          <Button variant="outline" onPress={() => setBookingOpen(false)}>
            <ButtonText>Not now</ButtonText>
          </Button>
          <Button
            disabled={!bookingDate}
            onPress={() => {
              setBookingOpen(false);
              toast({
                title: 'Booked',
                description: `${bookingDate}, 9:00 – 12:00 on wheel 3`,
                variant: 'success',
              });
            }}
          >
            <ButtonText>Book</ButtonText>
          </Button>
        </SheetFooter>
      </Sheet>

      <ToastContainer position="top" style={{ paddingTop: insets.top + 8 }} />
    </View>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fonts);

  useEffect(() => {
    if (fontsLoaded || fontError) void SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <FontProvider value={fontMap}>
        <MotionProvider>
          <ToastProvider>
            <Studio />
            <PortalHost />
          </ToastProvider>
        </MotionProvider>
      </FontProvider>
    </SafeAreaProvider>
  );
}
