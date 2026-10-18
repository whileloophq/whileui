/**
 * Compiles the published API the way a consumer resolves it.
 *
 * There is no `paths` mapping in this fixture's tsconfig, deliberately. TypeScript walks
 * up to `node_modules/@thewhileloop/whileui` and applies the package's `exports` map, so
 * a broken export map, a missing `types` condition or a subpath that does not resolve
 * fails here. The previous version mapped straight to `dist/index.d.ts` and therefore
 * tested none of that.
 *
 * The `@ts-expect-error` blocks are the half a positive test cannot cover: they fail if
 * the API becomes *more* permissive, which is how a prop contract quietly erodes.
 */
import { createRef } from 'react';
import type { TextInputInstance } from 'react-native';

// --- the root entry ---------------------------------------------------------
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  Button,
  ButtonText,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  MotionProvider,
  PullToRefreshScrollView,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useThemeColors,
  type ButtonProps,
} from '@thewhileloop/whileui';

// --- subpath entries --------------------------------------------------------
// Every public subpath in the export map gets an import, or a typo in the map ships.
import { Badge } from '@thewhileloop/whileui/components/badge';
import { AppShell } from '@thewhileloop/whileui/blocks/layout';
import { withWhileUIViteCompat } from '@thewhileloop/whileui/vite';

// The renderer-free entry. `PLAN.md` > Tokens requires this to carry no React, React
// Native or Uniwind import so it can run in a plain build script.
import { WHILEUI_LIGHT_THEME_COLORS, themePresetToCss } from '@thewhileloop/whileui/tokens';

void withWhileUIViteCompat({});
void WHILEUI_LIGHT_THEME_COLORS;
void themePresetToCss;

// --- prop contracts ---------------------------------------------------------

// Variants are a closed set, not arbitrary strings.
const variant: ButtonProps['variant'] = 'destructive';

// @ts-expect-error — an unknown variant must not typecheck.
const badVariant: ButtonProps['variant'] = 'fuchsia';
void badVariant;

// Refs reach the underlying host component. (`AppShell` takes none — it is a plain
// function component despite extending `ViewProps`. Recorded, not invented here.)
const inputRef = createRef<TextInputInstance>();

// Async refresh handlers are accepted, because every real one is async.
const onRefresh = async () => {};

// @ts-expect-error — `value` must be a string, not a number.
const badInput = <Input value={42} />;
void badInput;

export function Smoke() {
  const colors = useThemeColors();
  void colors.primary;

  // @ts-expect-error — `useThemeColors` returns a closed token set.
  void colors.notARealToken;

  return (
    <MotionProvider>
      <AppShell className="flex-1">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Type smoke</CardTitle>
            <Badge>New</Badge>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="a" className="w-full">
              <TabsList>
                <TabsTrigger value="a" className="flex-1">
                  A
                </TabsTrigger>
                <TabsTrigger value="b">B</TabsTrigger>
              </TabsList>
              <TabsContent value="a">
                <Input ref={inputRef} placeholder="Email" onChangeText={(next) => void next} />
                <Button variant={variant} className="mt-2" onPress={() => {}}>
                  <ButtonText>Button text children</ButtonText>
                </Button>
              </TabsContent>
            </Tabs>

            <PullToRefreshScrollView refreshing={false} onRefresh={onRefresh}>
              <CardTitle>Pull</CardTitle>
            </PullToRefreshScrollView>

            <AlertDialog>
              <AlertDialogContent>
                <AlertDialogTitle>Delete?</AlertDialogTitle>
                <AlertDialogCancel>Keep</AlertDialogCancel>
                <AlertDialogAction onPress={() => {}}>Delete</AlertDialogAction>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </AppShell>
    </MotionProvider>
  );
}
