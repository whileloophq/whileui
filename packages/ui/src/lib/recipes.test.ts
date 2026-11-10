import { Platform } from 'react-native';
import { shadowStyle } from './recipes';
import { WHILEUI_LIGHT_THEME_COLORS } from './theme-contract';
import { VISUAL_TOKEN_SPECS, type VisualTokens } from './visual-token-contract';

const DEFAULT_VISUAL_TOKENS = Object.fromEntries(
  VISUAL_TOKEN_SPECS.map((spec) => [spec.key, spec.fallback])
) as unknown as VisualTokens;

describe('shadowStyle', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('draws an outset box shadow that cannot show through a translucent surface', () => {
    const style = shadowStyle(DEFAULT_VISUAL_TOKENS, WHILEUI_LIGHT_THEME_COLORS, 'sm');
    expect(style).not.toHaveProperty('elevation');
    expect(style).not.toHaveProperty('shadowOpacity');
    const shadows = style.boxShadow;
    if (!Array.isArray(shadows)) throw new Error('expected a box shadow list');
    const [shadow] = shadows;
    expect(shadow!.offsetY).toBe(DEFAULT_VISUAL_TOKENS.shadowOffsetYSm);
    expect(String(shadow!.color)).toMatch(/^rgba?\(/);
    expect(String(shadow!.color)).toContain(String(DEFAULT_VISUAL_TOKENS.shadowOpacitySm));
  });

  it('is empty for the none tier', () => {
    expect(shadowStyle(DEFAULT_VISUAL_TOKENS, WHILEUI_LIGHT_THEME_COLORS, 'none')).toEqual({});
  });

  it('keeps elevation only where Android cannot draw an outset box shadow', () => {
    jest.replaceProperty(Platform, 'OS', 'android');
    const version = jest.spyOn(Platform, 'Version', 'get').mockReturnValue(27);
    expect(shadowStyle(DEFAULT_VISUAL_TOKENS, WHILEUI_LIGHT_THEME_COLORS, 'md')).toEqual({
      elevation: DEFAULT_VISUAL_TOKENS.shadowElevationMd,
    });

    version.mockReturnValue(28);
    expect(shadowStyle(DEFAULT_VISUAL_TOKENS, WHILEUI_LIGHT_THEME_COLORS, 'md')).toHaveProperty(
      'boxShadow'
    );
  });
});
