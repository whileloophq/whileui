import { THEME_TOKEN_SPECS, type ThemeColors } from './theme-contract';
import { WHILEUI_PRESET_SOFT } from './theme-presets';
import { checkThemeContrast, themeFromSeeds, type ThemeSeeds } from './theme-seeds';

// Deliberately awkward brands: a neon, a pastel, a mid-tone that sits near 4.5:1, a dark page.
const BRANDS: Record<string, ThemeSeeds> = {
  neon: { background: '#ffffff', foreground: '#111111', primary: '#e8ff00' },
  pastel: { background: '#fdf6ff', foreground: '#2a2230', primary: '#c8a2ff' },
  amber: { background: '#f0ede9', foreground: '#13161c', primary: '#b65400' },
  navy: { background: '#0b1220', foreground: '#e6edf7', primary: '#4f8cff' },
};

// A seed is never altered, so a pairing made only of brand colours may fail; the check
// must report it rather than hide it. Everything the library derives must pass.
const BRAND_PAIRS = ['primary on background', 'ring on background', 'primaryForeground on primary'];

describe('themeFromSeeds', () => {
  it.each(Object.entries(BRANDS))('derives a complete, readable theme for %s', (name, seeds) => {
    const theme = themeFromSeeds({ name, description: '', light: seeds });
    for (const mode of ['light', 'dark'] as const) {
      for (const spec of THEME_TOKEN_SPECS) {
        expect(theme[mode][spec.key as keyof ThemeColors]).toBeTruthy();
      }
      const failing = checkThemeContrast(theme[mode]).filter(
        (c) => !c.pass && !BRAND_PAIRS.includes(c.pair)
      );
      expect(failing).toEqual([]);
    }
  });

  it('keeps the seeds the caller chose', () => {
    const theme = themeFromSeeds({ name: 'neon', description: '', light: BRANDS.neon });
    expect(theme.light.primary).toBe('#e8ff00');
    expect(theme.light.background).toBe('#ffffff');
  });

  it('lets an override replace any base colour before the rest is derived', () => {
    const theme = themeFromSeeds({
      name: 'navy',
      description: '',
      light: BRANDS.navy,
      overrides: { light: { mutedForeground: '#abcdef' } },
    });
    expect(theme.light.mutedForeground).toBe('#abcdef');
    expect(theme.light.placeholder).toBe('#abcdef');
  });
});

describe('checkThemeContrast', () => {
  it('flags text that cannot be read', () => {
    const theme = { ...WHILEUI_PRESET_SOFT.light, foreground: '#fefefe', background: '#ffffff' };
    expect(checkThemeContrast(theme)).toContainEqual(
      expect.objectContaining({ pair: 'foreground on background', pass: false })
    );
  });

  it('measures a translucent colour as it renders, blended onto the page', () => {
    // Solid black text on a 2% black wash is fine; read without blending, the wash would
    // count as opaque black and the pair would fail at 1:1.
    const theme = {
      ...WHILEUI_PRESET_SOFT.light,
      background: '#ffffff',
      muted: 'rgba(0, 0, 0, 0.02)',
      mutedForeground: '#000000',
    };
    const muted = checkThemeContrast(theme).find((c) => c.pair === 'mutedForeground on muted');
    expect(muted?.pass).toBe(true);
  });
});
