import { THEME_TOKEN_SPECS, type ThemeColors } from './theme-contract';
import { THEME_BASE_TOKEN_KEYS, type ThemeBaseColors } from './theme-derive';
import { createThemePreset, themePresetToCssVariables } from './theme-presets';

/** A palette stated only as base tokens — the shape an app actually has. */
const base: ThemeBaseColors = Object.fromEntries(
  THEME_BASE_TOKEN_KEYS.map((key) => [key, 'oklch(50% 0.1 140)'])
) as ThemeBaseColors;

describe('createThemePreset', () => {
  it('fills every contract token from the base palette alone', () => {
    const preset = createThemePreset({
      name: 'test',
      description: 'every key present',
      light: base,
      dark: base,
    });

    // The point of the factory: an author supplies 25 keys and no token is missing.
    // A theme with a hole renders unstyled at runtime with no build error, which is
    // exactly the failure this is meant to make unreachable.
    for (const spec of THEME_TOKEN_SPECS) {
      expect(preset.light[spec.key as keyof ThemeColors]).toBeTruthy();
      expect(preset.dark[spec.key as keyof ThemeColors]).toBeTruthy();
    }
  });

  it('keeps visual overrides partial and defaults them to none', () => {
    const withoutVisual = createThemePreset({
      name: 'test',
      description: 'no visual overrides',
      light: base,
      dark: base,
    });
    expect(withoutVisual.visual).toEqual({});

    const withVisual = createThemePreset({
      name: 'test',
      description: 'one visual override',
      light: base,
      dark: base,
      visual: { radiusLg: 12 },
    });
    expect(withVisual.visual).toEqual({ radiusLg: 12 });
  });

  it('produces a preset the CSS emitter accepts', () => {
    const preset = createThemePreset({
      name: 'test',
      description: 'emits css',
      light: base,
      dark: base,
      visual: { radiusLg: 12 },
    });
    const css = themePresetToCssVariables(preset);

    expect(Object.keys(css.light).length).toBeGreaterThanOrEqual(THEME_TOKEN_SPECS.length);
    expect(Object.keys(css.dark).length).toBeGreaterThanOrEqual(THEME_TOKEN_SPECS.length);
    expect(css.visual['--ui-radius-lg']).toBe('12');
  });

  it('derives light and dark differently from the same base', () => {
    const preset = createThemePreset({
      name: 'test',
      description: 'scheme matters',
      light: base,
      dark: base,
    });

    // Same input palette, different scheme: the derived overlay and state colours
    // cannot be identical, or `scheme` would be a parameter that does nothing.
    expect(preset.light.overlay).not.toBe(preset.dark.overlay);
  });
});
