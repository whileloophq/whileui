import { THEME_TOKEN_SPECS, type ThemeColors } from './theme-contract';
import { THEME_BASE_TOKEN_KEYS, type ThemeBaseColors } from './theme-derive';
import { checkThemeContrast } from './theme-seeds';
import {
  WHILEUI_PRESET_ATELIER,
  WHILEUI_PRESET_SOFT,
  WHILEUI_THEME_PRESETS,
  createThemePreset,
  themePresetToCss,
  themePresetToCssVariables,
} from './theme-presets';

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

describe('WHILEUI_PRESET_ATELIER', () => {
  it('provides an opaque, tighter, higher-depth product treatment', () => {
    const css = themePresetToCssVariables(WHILEUI_PRESET_ATELIER);

    expect(css.visual['--ui-radius-xl']).toBe('14');
    expect(css.visual['--ui-shadow-opacity-lg']).toBe('0.24');
    expect(css.visual['--ui-blur-intensity-medium']).toBe('0');
    expect(css.light['--color-surface-elevated']).toBe('#fffdf8');
  });
});

describe('built-in presets', () => {
  // Every consumer inherits these, and the Soft palette is also the runtime fallback, so
  // each must pass WCAG AA for text (4.5:1) and for the focus ring (3:1) in both modes.
  it.each(
    WHILEUI_THEME_PRESETS.flatMap(
      (p) =>
        [
          [p.name, 'light', p.light],
          [p.name, 'dark', p.dark],
        ] as const
    )
  )('%s %s passes every contrast check', (_name, _mode, colors) => {
    expect(checkThemeContrast(colors).filter((c) => !c.pass)).toEqual([]);
  });
});

describe('utility classes follow the preset', () => {
  it('writes Tailwind radius and control-height variables from the visual tokens', () => {
    const preset = {
      ...WHILEUI_PRESET_SOFT,
      visual: {
        ...WHILEUI_PRESET_SOFT.visual,
        radiusSm: 6,
        radiusMd: 9,
        radiusLg: 12,
        radiusXl: 16,
        controlHeightSm: 36,
        controlHeightDefault: 44,
        controlHeightLg: 52,
      },
    };
    const css = themePresetToCss(preset);

    // `rounded-md` and `h-control` in an app's own markup then match the controls.
    expect(css).toContain('--radius-sm: 6px;');
    expect(css).toContain('--radius-md: 9px;');
    expect(css).toContain('--radius-lg: 12px;');
    expect(css).toContain('--radius-xl: 16px;');
    expect(css).toContain('--spacing-control-sm: 36px;');
    expect(css).toContain('--spacing-control: 44px;');
    expect(css).toContain('--spacing-control-lg: 52px;');
  });
});
