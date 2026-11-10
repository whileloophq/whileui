import { useCSSVariable } from 'uniwind';
import { renderHook } from '../test/render';
import { useIconColors, useThemeColors } from './theme-colors';
import { useVisualTokens } from './visual-tokens';

const unset = (names: string[]) => names.map(() => undefined);

describe('token hooks', () => {
  afterEach(() => {
    jest.mocked(useCSSVariable).mockImplementation(unset);
  });

  it('hands every render the same resolved objects while the theme is unchanged', async () => {
    const { result, rerender } = await renderHook(() => ({
      colors: useThemeColors(),
      icons: useIconColors(),
      visual: useVisualTokens(),
    }));
    const first = result.current;
    await rerender(undefined);
    expect(result.current.colors).toBe(first.colors);
    expect(result.current.icons).toBe(first.icons);
    expect(result.current.visual).toBe(first.visual);
  });

  it('re-derives when a CSS variable changes', async () => {
    const { result, rerender } = await renderHook(() => ({
      colors: useThemeColors(),
      visual: useVisualTokens(),
    }));
    const first = result.current;

    jest
      .mocked(useCSSVariable)
      .mockImplementation((names: string[]) =>
        names.map((name) => (name === '--ui-radius-md' ? '20px' : undefined))
      );
    await rerender(undefined);
    expect(result.current.visual).not.toBe(first.visual);
    expect(result.current.visual.radiusMd).toBe(20);
    // The colour snapshot did not change, so that object is still shared.
    expect(result.current.colors).toBe(first.colors);
  });
});
