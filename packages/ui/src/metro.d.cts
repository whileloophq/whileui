import type { withUniwindConfig } from 'uniwind/metro';

type UniwindMetroOptions = Parameters<typeof withUniwindConfig>[1];

export interface WithWhileUIMetroOptions extends UniwindMetroOptions {
  /** Extra packages that must import the real `react-native` instead of Uniwind's wrapper. */
  exemptFromUniwindRewrite?: string[];
}

/** Packages exempted from Uniwind's `react-native` rewrite by default. */
export const NEEDS_REAL_REACT_NATIVE: readonly string[];

/**
 * Wraps an Expo Metro config with Uniwind and keeps `expo-asset`, `expo-font` and
 * `@expo/vector-icons` on the real `react-native`, so icon fonts load on device.
 * Use this in `metro.config.js` instead of calling `withUniwindConfig` yourself.
 */
export function withWhileUIMetro<T extends Parameters<typeof withUniwindConfig>[0]>(
  config: T,
  options: WithWhileUIMetroOptions
): ReturnType<typeof withUniwindConfig>;
