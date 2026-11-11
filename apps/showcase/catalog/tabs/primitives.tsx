import React, { useState } from 'react';
import { Platform, Alert as SystemAlert, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  Badge,
  BadgeText,
  Button,
  ButtonIcon,
  ButtonText,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type MotionMode,
  MotionProvider,
  Progress,
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlItemText,
  Separator,
  Surface,
  Text,
  type ThemeMode,
  useIconColors,
  useMotionPolicy,
} from '@thewhileloop/whileui';
import { Section } from '../ui';

function MotionPolicyDetails() {
  const motion = useMotionPolicy();
  return (
    <View className="gap-1 rounded-xl border border-border bg-muted p-3">
      <Text className="text-sm text-foreground">Resolved mode: {motion.mode}</Text>
      <Text className="text-sm text-muted-foreground">
        Reduced: {motion.reduceMotion ? 'yes' : 'no'} · animations:{' '}
        {motion.animationsEnabled ? 'enabled' : 'disabled'}
      </Text>
      <Text className="text-sm text-muted-foreground">
        Durations: {motion.durations.fast}/{motion.durations.normal}/{motion.durations.slow} ms
      </Text>
    </View>
  );
}

function MotionPolicyDemo() {
  const [mode, setMode] = useState<MotionMode>('system');
  return (
    <MotionProvider mode={mode}>
      <SegmentedControl value={mode} onValueChange={(next) => setMode(next as MotionMode)} wrap>
        <SegmentedControlItem value="system">
          <SegmentedControlItemText>System</SegmentedControlItemText>
        </SegmentedControlItem>
        <SegmentedControlItem value="reduced">
          <SegmentedControlItemText>Reduced</SegmentedControlItemText>
        </SegmentedControlItem>
        <SegmentedControlItem value="full">
          <SegmentedControlItemText>Full</SegmentedControlItemText>
        </SegmentedControlItem>
        <SegmentedControlItem value="disabled">
          <SegmentedControlItemText>Disabled</SegmentedControlItemText>
        </SegmentedControlItem>
      </SegmentedControl>
      <MotionPolicyDetails />
    </MotionProvider>
  );
}

export function PrimitivesTab({
  themeMode,
  onThemeModeChange,
}: {
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
}) {
  const [progress, setProgress] = useState(45);
  const [buttonPressCount, setButtonPressCount] = useState(0);
  const colors = useIconColors();

  React.useEffect(() => {
    const timer = setInterval(() => setProgress((p) => (p + 10) % 110), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View>
      <Section title="Typography" subtitle="Semantic type roles driven by visual tokens">
        <Text variant="eyebrow">Semantic roles</Text>
        <Text variant="heading">Build faster,{'\n'}ship beautiful.</Text>
        <Text variant="body" className="text-muted-foreground leading-relaxed">
          WhileUI gives you production-ready components that look stunning out of the box. Every
          component uses <Text className="font-semibold text-foreground">design tokens</Text> for
          effortless theming.
        </Text>
        <View className="flex-row flex-wrap gap-2 mt-1">
          <Badge>
            <BadgeText>React Native</BadgeText>
          </Badge>
          <Badge variant="secondary">
            <BadgeText>Expo</BadgeText>
          </Badge>
          <Badge variant="outline">
            <BadgeText>Uniwind</BadgeText>
          </Badge>
        </View>
      </Section>

      <Section title="Buttons" subtitle="6 variants × 4 sizes">
        <View className="flex-row flex-wrap gap-2">
          <Button>
            <ButtonText>Primary</ButtonText>
          </Button>
          <Button variant="secondary">
            <ButtonText>Secondary</ButtonText>
          </Button>
          <Button variant="destructive">
            <ButtonText>Destructive</ButtonText>
          </Button>
          <Button variant="outline">
            <ButtonText>Outline</ButtonText>
          </Button>
          <Button variant="ghost">
            <ButtonText>Ghost</ButtonText>
          </Button>
          <Button variant="link">
            <ButtonText>Link</ButtonText>
          </Button>
        </View>
        <View className="flex-row items-center gap-2">
          <Button size="sm">
            <ButtonText>Small</ButtonText>
          </Button>
          <Button size="default">
            <ButtonText>Default</ButtonText>
          </Button>
          <Button size="lg">
            <ButtonText>Large</ButtonText>
          </Button>
          <Button size="icon">
            <ButtonText>+</ButtonText>
          </Button>
        </View>
        <Text className="text-sm font-medium text-muted-foreground mt-2">With Icons</Text>
        <View className="flex-row flex-wrap gap-2">
          <Button>
            <ButtonIcon>
              <Feather name="download" size={16} color={colors.primaryForeground} />
            </ButtonIcon>
            <ButtonText>Download</ButtonText>
          </Button>
          <Button variant="outline">
            <ButtonIcon>
              <Feather name="settings" size={16} color={colors.foreground} />
            </ButtonIcon>
            <ButtonText>Settings</ButtonText>
          </Button>
          <Button variant="secondary">
            <ButtonText>Next</ButtonText>
            <ButtonIcon>
              <Feather name="arrow-right" size={16} color={colors.foreground} />
            </ButtonIcon>
          </Button>
          <Button size="icon" variant="outline" accessibilityLabel="Favourite">
            <Feather name="heart" size={18} color={colors.foreground} />
          </Button>
        </View>
        <View className="flex-row">
          <Button disabled>
            <ButtonText>Disabled</ButtonText>
          </Button>
          <Button loading className="ml-2">
            <ButtonText>Saving changes</ButtonText>
          </Button>
        </View>
        <Button
          variant="outline"
          testID="press-feedback-test"
          onPress={() => {
            setButtonPressCount((count) => count + 1);
            if (Platform.OS !== 'web') SystemAlert.alert('Button pressed');
          }}
          accessibilityLabel={`Press test: ${buttonPressCount}`}
        >
          <ButtonText>Press test: {buttonPressCount}</ButtonText>
        </Button>
      </Section>

      <Section title="Theme Bridge" subtitle="Official light/dark/system sync helper">
        <Text className="text-sm text-muted-foreground">
          Active mode: <Text className="text-foreground font-medium">{themeMode}</Text>
        </Text>
        <SegmentedControl
          value={themeMode}
          onValueChange={(next) => onThemeModeChange(next as ThemeMode)}
          wrap={false}
        >
          <SegmentedControlItem value="light">
            <SegmentedControlItemText>Light</SegmentedControlItemText>
          </SegmentedControlItem>
          <SegmentedControlItem value="dark">
            <SegmentedControlItemText>Dark</SegmentedControlItemText>
          </SegmentedControlItem>
          <SegmentedControlItem value="system">
            <SegmentedControlItemText>System</SegmentedControlItemText>
          </SegmentedControlItem>
        </SegmentedControl>
      </Section>

      <Section
        title="Motion Policy"
        subtitle="System, reduced, full, and deterministic disabled modes"
      >
        <MotionPolicyDemo />
      </Section>

      <Section
        title="Surfaces, Cards & Badges"
        subtitle="Three elevation levels, compound cards, and badges"
      >
        <View className="flex-row gap-3">
          <Surface level="base" padding="sm" className="flex-1">
            <Text variant="label">Base</Text>
          </Surface>
          <Surface level="raised" padding="sm" className="flex-1">
            <Text variant="label">Raised</Text>
          </Surface>
          <Surface level="overlay" padding="sm" className="flex-1">
            <Text variant="label">Overlay</Text>
          </Surface>
        </View>
        <Card>
          <CardHeader>
            <View className="flex-row items-center justify-between">
              <CardTitle>Team Activity</CardTitle>
              <Badge variant="success">
                <BadgeText>Live</BadgeText>
              </Badge>
            </View>
            <CardDescription>Your team completed 24 tasks this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} />
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <ButtonText>View Dashboard</ButtonText>
            </Button>
          </CardFooter>
        </Card>

        <View className="flex-row gap-3">
          <Card padding="sm" className="flex-1">
            <Text className="text-sm font-medium text-foreground">`padding=\"sm\"`</Text>
            <Text className="text-xs text-muted-foreground mt-1">
              Dense cards for compact settings.
            </Text>
          </Card>
          <Card padding="lg" className="flex-1">
            <Text className="text-sm font-medium text-foreground">`padding=\"lg\"`</Text>
            <Text className="text-xs text-muted-foreground mt-1">
              Roomy layouts for onboarding and forms.
            </Text>
          </Card>
        </View>

        <Card unstyled padding="none" className="rounded-xl border border-border bg-card p-4">
          <Text className="text-sm font-medium text-foreground">Unstyled card shell</Text>
          <Text className="text-xs text-muted-foreground mt-1">
            Use your own spacing/layout for advanced compositions.
          </Text>
        </Card>

        <Separator />
        <View className="flex-row flex-wrap gap-2">
          <Badge>
            <BadgeText>Default</BadgeText>
          </Badge>
          <Badge variant="secondary">
            <BadgeText>Secondary</BadgeText>
          </Badge>
          <Badge variant="destructive">
            <BadgeText>Destructive</BadgeText>
          </Badge>
          <Badge variant="outline">
            <BadgeText>Outline</BadgeText>
          </Badge>
          <Badge variant="success">
            <BadgeText>Success</BadgeText>
          </Badge>
          <Badge variant="warning">
            <BadgeText>Warning</BadgeText>
          </Badge>
          <Badge variant="info">
            <BadgeText>Info</BadgeText>
          </Badge>
        </View>
      </Section>
    </View>
  );
}
