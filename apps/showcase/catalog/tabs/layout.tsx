import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  ActionBar,
  AppShell,
  Button,
  ButtonText,
  ConfirmActionSheet,
  Container,
  ContentSkeleton,
  EmptyState,
  ErrorBoundary,
  ErrorState,
  LoadingScreen,
  LoadingState,
  PageSkeleton,
  PullToRefreshScrollView,
  ScreenSkeleton,
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SmartInput,
  Surface,
  Text,
  useIconColors,
  useToast,
} from '@thewhileloop/whileui';
import { KeyboardFormSheet } from '../keyboard-form-sheet';
import { Section, SectionGroup, triggerHaptic } from '../ui';

function CrashableChild() {
  const [shouldCrash, setShouldCrash] = useState(false);
  if (shouldCrash) throw new Error('Demo error: something went wrong!');
  return (
    <Button variant="destructive" onPress={() => setShouldCrash(true)}>
      <ButtonText>Throw error (ErrorBoundary demo)</ButtonText>
    </Button>
  );
}

export function LayoutBlocksTab({ onOpenKeyboardScreen }: { onOpenKeyboardScreen: () => void }) {
  const [showLoading, setShowLoading] = useState(false);
  const [shellLoading, setShellLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [smartInputValue, setSmartInputValue] = useState('');
  const { toast } = useToast();
  const colors = useIconColors();

  return (
    <View className="gap-6">
      <Container size="sm" className="border border-dashed border-border rounded-xl p-4 mt-2">
        <Text className="font-semibold text-foreground mb-1">Container — size="sm"</Text>
        <Text className="text-sm text-muted-foreground">
          Caps content width and centres it. Resize the window: on a phone this is a plain
          full-width View, because every size is wider than any phone. On a wide screen it stops the
          line length running away.
        </Text>
      </Container>

      <Container size="lg" className="border border-dashed border-border rounded-xl p-4 mt-2">
        <Text className="font-semibold text-foreground mb-1">Container — size="lg"</Text>
        <Text className="text-sm text-muted-foreground">
          Wider column for dashboards and multi-column content.
        </Text>
      </Container>

      <SectionGroup label="Bars & Overlays" />
      <Section title="Action Bar" subtitle="Sticky bottom action row with safe-area support">
        <ActionBar
          sticky={false}
          safeArea={false}
          className="relative inset-auto rounded-xl border border-border"
        >
          <Button
            variant="outline"
            className="flex-1"
            onPress={() => {
              triggerHaptic('light');
              toast({
                title: 'Changes discarded',
                description: 'ActionBar cancel handler fired.',
              });
            }}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            className="flex-1"
            onPress={() => {
              triggerHaptic('medium');
              toast({
                title: 'Changes saved',
                description: 'ActionBar primary action completed.',
                variant: 'success',
              });
            }}
          >
            <ButtonText>Save Changes</ButtonText>
          </Button>
        </ActionBar>
      </Section>

      <Section
        title="Smart Input"
        subtitle="Screen-owned keyboard handling, a safe-area dock, and rotating examples"
      >
        <Text className="mb-3 text-sm text-muted-foreground">
          The card on its own. Open the keyboard screen to see it docked above the keyboard.
        </Text>
        <Button
          variant="outline"
          accessibilityLabel="Open keyboard screen"
          testID="open-keyboard-screen"
          onPress={onOpenKeyboardScreen}
          className="mb-4 self-start"
        >
          <ButtonText>Open keyboard screen</ButtonText>
        </Button>
        <SmartInput
          variant="card"
          value={smartInputValue}
          onChangeText={setSmartInputValue}
          placeholderExamples={['Plan a morning walk', 'Log two glasses of water']}
          safeArea={false}
          leftSlot={
            <Button
              variant="ghost"
              size="icon"
              accessibilityLabel="Attach"
              onPress={() => triggerHaptic('light')}
            >
              <Feather name="plus" size={20} color={colors.foreground} />
            </Button>
          }
          rightSlot={
            <Button
              size="icon"
              accessibilityLabel="Send"
              onPress={() => {
                triggerHaptic('medium');
                toast({ title: 'Sent', description: smartInputValue || '(empty)' });
                setSmartInputValue('');
              }}
            >
              <Feather name="send" size={18} color={colors.primaryForeground} />
            </Button>
          }
        />
      </Section>

      <Section
        title="Keyboard Aware Scroll View"
        subtitle="A form that keeps the focused field above the keyboard, in a native sheet too"
      >
        <KeyboardFormSheet />
      </Section>

      <Section
        title="Confirm Action Sheet"
        subtitle="Reusable destructive confirmation sheet with action model"
      >
        <Button variant="destructive" onPress={() => setActionSheetOpen(true)}>
          <ButtonText>Open Confirm Sheet</ButtonText>
        </Button>
        <ConfirmActionSheet
          open={actionSheetOpen}
          onOpenChange={setActionSheetOpen}
          title="Delete workspace?"
          description="This permanently removes projects, members, and billing history."
          actions={[
            { key: 'cancel', label: 'Cancel', variant: 'cancel' },
            {
              key: 'delete',
              label: 'Delete Workspace',
              variant: 'destructive',
              onPress: () => setActionSheetOpen(false),
            },
          ]}
        />
      </Section>

      <Section title="Sheet" subtitle="Bottom sheet modal with header, scrollable content, footer">
        <View className="rounded-xl border border-border p-4 bg-card">
          <Button
            variant="outline"
            onPress={() => setSheetOpen(true)}
            className="w-full"
            testID="open-sheet-test"
          >
            <ButtonText>Open Sheet</ButtonText>
          </Button>
        </View>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen} maxHeight="half">
          <SheetHeader title="Settings" description="Adjust preferences" />
          <SheetContent>
            <View className="gap-4">
              <Text className="text-sm text-muted-foreground">
                Use SheetContent for scrollable body. SheetFooter for actions.
              </Text>
              <View className="h-20 rounded-lg bg-muted items-center justify-center">
                <Text className="text-xs text-muted-foreground">Custom content</Text>
              </View>
              <View className="gap-3">
                <Text className="text-foreground">Account preferences</Text>
                <Text className="text-foreground">Notification preferences</Text>
                <Text className="text-foreground">Privacy preferences</Text>
                <Text className="text-foreground">Language preferences</Text>
                <Text className="text-foreground">Appearance preferences</Text>
                <Text className="text-foreground">Data preferences</Text>
                <Text className="text-foreground">Security preferences</Text>
                <Text className="text-foreground">End of sheet content</Text>
              </View>
            </View>
          </SheetContent>
          <SheetFooter>
            <Button variant="outline" onPress={() => setSheetOpen(false)} testID="close-sheet-test">
              <ButtonText>Cancel</ButtonText>
            </Button>
            <SheetClose asChild>
              <Button onPress={() => triggerHaptic('medium')}>
                <ButtonText>Save</ButtonText>
              </Button>
            </SheetClose>
          </SheetFooter>
        </Sheet>
      </Section>

      <SectionGroup label="Placeholders & Loading" />
      <Section title="Empty State" subtitle="When there's no content to show">
        <Surface padding="none" className="h-64 overflow-hidden">
          <EmptyState
            icon={<Feather name="inbox" size={48} color={colors.muted} />}
            title="No messages yet"
            description="When you receive messages, they'll appear here."
            action={{ label: 'Compose', onPress: () => {} }}
          />
        </Surface>
      </Section>

      <Section title="Error State" subtitle="Something went wrong">
        <Surface padding="none" className="h-64 overflow-hidden">
          <ErrorState
            icon={<Feather name="alert-triangle" size={48} color={colors.destructive} />}
            title="Connection lost"
            description="Check your internet connection and try again."
            onRetry={() => {}}
          />
        </Surface>
      </Section>

      <Section title="Loading State" subtitle="A section still fetching, in flow">
        <Surface padding="none" className="overflow-hidden">
          <LoadingState label="Loading activity" />
        </Surface>
      </Section>

      <LayoutSkeletonDemos />

      <Section
        title="AppShell loading swap"
        subtitle="Keep shell mounted, swap only content with skeleton."
      >
        <View className="gap-3">
          <Button variant="outline" onPress={() => setShellLoading((prev) => !prev)}>
            <ButtonText>{shellLoading ? 'Show Content' : 'Show Skeleton'}</ButtonText>
          </Button>
          <View className="h-80 rounded-xl border border-border overflow-hidden">
            <AppShell
              safeArea={false}
              header={
                <View className="px-4 py-3 border-b border-border bg-card">
                  <Text className="font-medium text-foreground">Settings</Text>
                </View>
              }
              loading={shellLoading}
              skeleton={<PageSkeleton variant="settings" count={5} />}
            >
              <ScrollView className="flex-1 p-4">
                <View className="gap-3">
                  {['Profile', 'Notifications', 'Privacy', 'Billing'].map((item) => (
                    <View key={item} className="rounded-lg border border-border bg-card px-3 py-4">
                      <Text className="text-foreground">{item}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </AppShell>
          </View>
        </View>
      </Section>

      <Section title="Loading Screen" subtitle="Content is being fetched">
        <Button onPress={() => setShowLoading(!showLoading)}>
          <ButtonText>{showLoading ? 'Hide Loading' : 'Show Loading'}</ButtonText>
        </Button>
        {showLoading && (
          <View className="h-32 rounded-xl border border-border overflow-hidden">
            <LoadingScreen message="Fetching data..." size="sm" />
          </View>
        )}
      </Section>

      <SectionGroup label="Infrastructure" />
      <Section title="Error Boundary" subtitle="Catches React errors and renders ErrorState">
        <View className="h-48 rounded-xl border border-border overflow-hidden bg-background">
          <ErrorBoundary>
            <View className="flex-1 items-center justify-center p-4">
              <CrashableChild />
            </View>
          </ErrorBoundary>
        </View>
      </Section>

      <Section title="Pull to Refresh" subtitle="Themed ScrollView + RefreshControl">
        <View className="h-48 rounded-xl border border-border overflow-hidden">
          <PullToRefreshScrollView
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await new Promise((r) => setTimeout(r, 1000));
              setRefreshing(false);
            }}
            className="flex-1"
          >
            <View className="p-4 gap-2">
              <Text className="text-foreground">Pull down to refresh</Text>
              <Text className="text-sm text-muted-foreground">
                Uses useThemeTokens for RefreshControl colors.
              </Text>
            </View>
          </PullToRefreshScrollView>
        </View>
      </Section>
    </View>
  );
}

function LayoutSkeletonDemos() {
  return (
    <>
      <Section
        title="Content Skeleton"
        subtitle="Layout placeholder while loading. Use instead of spinner when you need layout preview."
      >
        <View className="gap-6">
          <View>
            <Text className="mb-2 text-sm text-muted-foreground">Full page preview (list)</Text>
            <View className="min-h-[320px] rounded-xl border border-border overflow-hidden bg-background">
              <ContentSkeleton variant="list" rows={5} className="flex-1" />
            </View>
          </View>
          <View>
            <Text className="mb-2 text-sm text-muted-foreground">Variants</Text>
            <View className="gap-4">
              {(['list', 'card', 'generic'] as const).map((variant) => (
                <View key={variant}>
                  <Text className="mb-1 text-xs text-muted-foreground">{variant}</Text>
                  <View className="rounded-xl border border-border overflow-hidden bg-background">
                    <ContentSkeleton variant={variant} rows={variant === 'list' ? 2 : undefined} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Section>
      <Section
        title="Page Skeleton"
        subtitle="Variant-based page layouts: dashboard, list, settings, card, generic."
      >
        <View className="gap-4">
          {(['dashboard', 'list', 'settings', 'card', 'generic'] as const).map((variant) => (
            <View key={variant}>
              <Text className="mb-1 text-xs text-muted-foreground">{variant}</Text>
              <View className="rounded-xl border border-border overflow-hidden bg-background">
                <PageSkeleton
                  variant={variant}
                  count={variant === 'list' ? 5 : variant === 'settings' ? 6 : undefined}
                />
              </View>
            </View>
          ))}
        </View>
      </Section>
      <Section
        title="Screen Skeleton"
        subtitle="Header slot or placeholder plus page content skeleton."
      >
        <View className="gap-4">
          <View className="rounded-xl border border-border overflow-hidden bg-background">
            <ScreenSkeleton variant="list" count={4} headerPlaceholder />
          </View>
          <View className="rounded-xl border border-border overflow-hidden bg-background">
            <ScreenSkeleton
              variant="dashboard"
              header={
                <View className="px-4 pt-4 pb-2 border-b border-border">
                  <Text className="text-base font-medium text-foreground">Overview</Text>
                </View>
              }
            />
          </View>
        </View>
      </Section>
    </>
  );
}
