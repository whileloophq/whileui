import { Image, Platform, StyleSheet, View } from 'react-native';
import { useCSSVariable, useUniwind } from 'uniwind';

const darkBackdropImg = require('../assets/dark-backdrop.jpg');

const lightBackdropImg = require('../assets/light-backdrop.jpg');

function parseBackdropNumber(value: string | number | undefined, fallback: number): number {
  if (value === undefined || value === null) return fallback;
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function resolveBackdropColor(value: string | number | undefined, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function resolveBackdropPresentation(
  dark: boolean,
  isAndroid: boolean,
  tokens: (string | number | undefined)[]
) {
  const [baseToken, imageOpacityToken, imageBlurToken, tintToken, veilToken] = tokens;
  const configuredImageOpacity = Math.max(
    0,
    Math.min(1, parseBackdropNumber(imageOpacityToken, dark ? 0.75 : 0.85))
  );
  const configuredImageBlurRadius = Math.max(
    0,
    Math.round(parseBackdropNumber(imageBlurToken, dark ? 12 : 8))
  );
  return {
    source: dark ? darkBackdropImg : lightBackdropImg,
    base: resolveBackdropColor(baseToken, dark ? 'rgba(31, 28, 36, 1)' : 'rgba(254, 251, 251, 1)'),
    imageOpacity: isAndroid ? configuredImageOpacity * 0.3 : configuredImageOpacity,
    imageBlurRadius: isAndroid
      ? Math.min(configuredImageBlurRadius, dark ? 4 : 2)
      : configuredImageBlurRadius,
    tint: resolveBackdropColor(
      tintToken,
      dark
        ? isAndroid
          ? 'rgba(236, 72, 153, 0.01)'
          : 'rgba(236, 72, 153, 0.02)'
        : isAndroid
          ? 'rgba(219, 39, 119, 0.005)'
          : 'rgba(219, 39, 119, 0.01)'
    ),
    veil: resolveBackdropColor(
      veilToken,
      dark
        ? isAndroid
          ? 'rgba(18, 14, 23, 0.6)'
          : 'rgba(18, 14, 23, 0.35)'
        : isAndroid
          ? 'rgba(254, 251, 251, 0.58)'
          : 'rgba(254, 251, 251, 0.25)'
    ),
  };
}

export function ThemedBackdrop() {
  const { theme } = useUniwind();
  const dark = theme === 'dark';
  const isAndroid = Platform.OS === 'android';
  const tokens = useCSSVariable([
    '--ui-showcase-backdrop-base',
    '--ui-showcase-backdrop-image-opacity',
    '--ui-showcase-backdrop-image-blur',
    '--ui-showcase-backdrop-tint',
    '--ui-showcase-backdrop-veil',
  ]);

  const presentation = resolveBackdropPresentation(dark, isAndroid, tokens);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: presentation.base,
          },
        ]}
      />
      <Image
        source={presentation.source}
        resizeMode="cover"
        blurRadius={presentation.imageBlurRadius}
        // Width and height stay explicit because `absoluteFill` alone leaves the web
        // image at its intrinsic dimensions on a wide viewport.
        style={[
          StyleSheet.absoluteFill,
          { opacity: presentation.imageOpacity, width: '100%', height: '100%' },
        ]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: presentation.tint,
          },
        ]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: presentation.veil,
          },
        ]}
      />
    </View>
  );
}
