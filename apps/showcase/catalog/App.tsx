import React, { useEffect, useState } from 'react';
import { Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';
import { Feather } from '@expo/vector-icons';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { KeyboardDockScreen } from './keyboard-dock-screen';
import { FabScreen } from './fab-screen';
import {
  cn,
  DrawerMenu,
  focusRing,
  FontProvider,
  KeyboardAwareScrollView,
  MotionProvider,
  PortalHost,
  SplashScreen,
  Text,
  ThemeBridge,
  type ThemeBridgeAdapter,
  type ThemeMode,
  ToastContainer,
  ToastProvider,
  useIconColors,
  useThemeBridge,
} from '@thewhileloop/whileui';
import './global.css';
import { ThemedBackdrop } from './shell/backdrop';
import {
  type CategoryKey,
  CategoryStrip,
  categories,
  createShowcaseDrawerSections,
  toDrawerItem,
} from './shell/categories';
import { triggerHaptic } from './ui';
// One file per category, in the order the catalog lists them.
import { PrimitivesTab } from './tabs/primitives';
import { ControlsTab } from './tabs/controls';
import { OverlaysTab } from './tabs/overlays';
import { FormsBlocksTab } from './tabs/forms';
import { AuthBlocksTab } from './tabs/auth';
import { NavigationBlocksTab } from './tabs/navigation';
import { LayoutBlocksTab } from './tabs/layout';
import { ChatBlocksTab } from './tabs/chat';
import { ProfileBlocksTab } from './tabs/profile';
import { ListsBlocksTab } from './tabs/lists';
import { CommerceBlocksTab } from './tabs/commerce';

void ExpoSplashScreen.preventAutoHideAsync();

const showcaseThemeStore: { mode: ThemeMode | null } = { mode: null };

const showcaseThemeAdapter: ThemeBridgeAdapter = {
  loadThemeMode: async () => showcaseThemeStore.mode,
  saveThemeMode: async (mode) => {
    showcaseThemeStore.mode = mode;
  },
};

const SHOWCASE_FONT_MAP = {
  'font-normal': 'PlusJakartaSans_400Regular',
  'font-medium': 'PlusJakartaSans_500Medium',
  'font-semibold': 'PlusJakartaSans_600SemiBold',
  'font-bold': 'PlusJakartaSans_700Bold',
  'font-extrabold': 'PlusJakartaSans_800ExtraBold',
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void ExpoSplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <FontProvider value={SHOWCASE_FONT_MAP}>
        <MotionProvider>
          <ToastProvider>
            <AppContent />
            <PortalHost />
          </ToastProvider>
        </MotionProvider>
      </FontProvider>
    </SafeAreaProvider>
  );
}

type ShowcaseDemoScreen = 'keyboard' | 'fab' | null;

function ShowcaseCategoryContent({
  activeKey,
  themeMode,
  onThemeModeChange,
  onOpenKeyboardScreen,
  onOpenFabScreen,
}: {
  activeKey: CategoryKey;
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
  onOpenKeyboardScreen: () => void;
  onOpenFabScreen: () => void;
}) {
  const content: Partial<Record<CategoryKey, React.ReactNode>> = {
    primitives: <PrimitivesTab themeMode={themeMode} onThemeModeChange={onThemeModeChange} />,
    controls: <ControlsTab onOpenFabScreen={onOpenFabScreen} />,
    overlays: <OverlaysTab />,
    forms: <FormsBlocksTab />,
    auth: <AuthBlocksTab />,
    navigation: <NavigationBlocksTab />,
    layout: <LayoutBlocksTab onOpenKeyboardScreen={onOpenKeyboardScreen} />,
    profile: <ProfileBlocksTab />,
    lists: <ListsBlocksTab />,
    commerce: <CommerceBlocksTab />,
  };
  return content[activeKey] ?? content.primitives;
}

function AppContent() {
  const { theme } = useUniwind();
  const insets = useSafeAreaInsets();
  const {
    mode: themeMode,
    setMode: setThemeMode,
    cycleMode,
  } = useThemeBridge({
    adapter: showcaseThemeAdapter,
    initialMode: 'system',
  });
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<CategoryKey>('primitives');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [demoScreen, setDemoScreen] = useState<ShowcaseDemoScreen>(null);
  const colors = useIconColors();

  if (showSplash) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1 }} className="bg-background">
          <ThemedBackdrop />
          <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
          <SplashScreen
            logo={
              <View className="h-24 w-24 rounded-3xl bg-primary items-center justify-center">
                <Feather name="zap" size={48} color={colors.primaryForeground} />
              </View>
            }
            appName="WhileUI"
            tagline="Beautiful native components"
            variant="scale"
            duration={1500}
            showLoading
            onAnimationComplete={() => {
              setTimeout(() => setShowSplash(false), 800);
            }}
          />
        </View>
      </SafeAreaProvider>
    );
  }

  if (activeTab === 'chat') {
    return (
      <SafeAreaProvider>
        <ThemeBridge mode={themeMode} adapter={showcaseThemeAdapter} />
        <View style={{ flex: 1 }} className="bg-background">
          <ThemedBackdrop />
          <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
            <ChatBlocksTab
              onBack={() => {
                triggerHaptic('light');
                setActiveTab('primitives');
              }}
              onMenuPress={() => {
                triggerHaptic('light');
                setDrawerOpen(true);
              }}
              colors={colors}
            />
          </SafeAreaView>
          <ToastContainer position="top" />
          <DrawerMenu
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            sections={[
              {
                title: 'Back',
                items: [
                  {
                    key: 'components',
                    label: 'Back to Showcase',
                    icon: <Feather name="arrow-left" size={20} color={colors.muted} />,
                  },
                ],
              },
              {
                title: 'Other Blocks',
                items: categories
                  .filter((category) => category.key !== 'chat')
                  .map((category) => toDrawerItem(category, activeTab, colors)),
              },
            ]}
            value={activeTab}
            onValueChange={(key) => {
              setActiveTab(key as CategoryKey);
              setDrawerOpen(false);
            }}
            header={
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-primary items-center justify-center">
                  <Text className="text-primary-foreground font-bold">W</Text>
                </View>
                <View>
                  <Text className="font-bold text-foreground text-lg">WhileUI</Text>
                  <Text className="text-xs text-muted-foreground">v1.0</Text>
                </View>
              </View>
            }
            footer={
              <Text className="text-xs text-muted-foreground text-center">
                Built with ❤️ for React Native
              </Text>
            }
          />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeBridge mode={themeMode} adapter={showcaseThemeAdapter} />
      <View style={{ flex: 1 }} className="bg-background">
        <ThemedBackdrop />
        <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
          <View className="flex-1 web:max-w-4xl web:w-full web:self-center">
            <View className="px-5 pt-4 pb-2">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Open menu"
                    testID="open-menu-test"
                    onPress={() => {
                      triggerHaptic('light');
                      setDrawerOpen(true);
                    }}
                    className={cn(
                      'w-10 h-10 rounded-xl bg-muted items-center justify-center active:opacity-70',
                      focusRing
                    )}
                  >
                    <Feather name="menu" size={20} color={colors.foreground} />
                  </Pressable>
                  <View>
                    <Text className="text-3xl font-bold text-foreground">WhileUI</Text>
                    <Text className="text-base text-muted-foreground">
                      Beautiful native components
                    </Text>
                  </View>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Change theme"
                  onPress={() => {
                    triggerHaptic('medium');
                    cycleMode();
                  }}
                  className={cn(
                    'w-10 h-10 rounded-xl bg-secondary items-center justify-center active:opacity-70',
                    focusRing
                  )}
                >
                  <Feather
                    name={themeMode === 'system' ? 'monitor' : theme === 'light' ? 'moon' : 'sun'}
                    size={18}
                    color={colors.foreground}
                  />
                </Pressable>
              </View>
            </View>

            <View className="mt-3 mb-3">
              <CategoryStrip
                activeKey={activeTab}
                colors={colors}
                onSelect={(key) => {
                  triggerHaptic('selection');
                  setActiveTab(key);
                }}
              />
            </View>

            {/* Every tab has text fields, so the tab scrolls a focused one above the
                keyboard. A plain ScrollView left them under it. */}
            <KeyboardAwareScrollView
              className="bg-transparent"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <View
                style={{
                  paddingBottom: Math.max(40, insets.bottom + 24),
                  paddingHorizontal: 20,
                  flexGrow: 1,
                }}
              >
                <ShowcaseCategoryContent
                  activeKey={activeTab}
                  themeMode={themeMode}
                  onThemeModeChange={setThemeMode}
                  onOpenKeyboardScreen={() => setDemoScreen('keyboard')}
                  onOpenFabScreen={() => setDemoScreen('fab')}
                />
              </View>
            </KeyboardAwareScrollView>
          </View>
        </SafeAreaView>
        <ToastContainer position="top" />

        <DrawerMenu
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          sections={createShowcaseDrawerSections(activeTab, colors)}
          value={activeTab}
          onValueChange={(key) => {
            setActiveTab(key as CategoryKey);
            setDrawerOpen(false);
          }}
          header={
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-xl bg-primary items-center justify-center">
                <Text className="text-primary-foreground font-bold">W</Text>
              </View>
              <View>
                <Text className="font-bold text-foreground text-lg">WhileUI</Text>
                <Text className="text-xs text-muted-foreground">v1.0</Text>
              </View>
            </View>
          }
          footer={
            <Text className="text-xs text-muted-foreground text-center">
              Built with ❤️ for React Native
            </Text>
          }
        />
        {demoScreen === 'keyboard' ? (
          <View style={[StyleSheet.absoluteFill, { zIndex: 20 }]} className="bg-background">
            <KeyboardDockScreen onClose={() => setDemoScreen(null)} />
          </View>
        ) : null}
        {demoScreen === 'fab' ? (
          <View style={[StyleSheet.absoluteFill, { zIndex: 20 }]} className="bg-background">
            <FabScreen onClose={() => setDemoScreen(null)} />
          </View>
        ) : null}
      </View>
    </SafeAreaProvider>
  );
}
