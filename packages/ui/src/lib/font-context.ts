import { createContext, useContext } from 'react';

/**
 * Map of Tailwind font-weight class names to the actual font family name
 * registered via expo-font / useFonts.
 *
 * Consumers provide this via <FontProvider> at the app root.
 */
export interface FontFamilyMap {
  'font-thin'?: string;
  'font-extralight'?: string;
  'font-light'?: string;
  'font-normal': string; // required – fallback / default
  'font-medium'?: string;
  'font-semibold'?: string;
  'font-bold'?: string;
  'font-extrabold'?: string;
  'font-black'?: string;
}

export interface ResolvedFont {
  fontFamily: string;
  /** Omit fontWeight — with explicit font files (Nunito_700Bold etc.) the family
   *  name encodes weight. Passing fontWeight on Android triggers synthetic bold
   *  (setTypeface(_, BOLD)) which distorts B, D, P, R. */
}

const FontContext = createContext<FontFamilyMap | null>(null);

export const FontProvider = FontContext.Provider;

const FONT_WEIGHT_RE =
  /\bfont-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/g;

export interface ResolvedFontResult {
  /** Style object with fontFamily to apply via style prop (no fontWeight). */
  style: ResolvedFont;
  /** className with font-weight classes stripped so Uniwind can't generate
   *  a conflicting fontFamily from --font-sans / CSS custom rules. */
  className: string;
}

/**
 * Resolve className to the correct fontFamily and return a cleaned className
 * with font-weight classes removed.
 *
 * On Android, Uniwind's className-generated fontFamily (from --font-sans)
 * overrides the style prop, causing the wrong font file to be used for
 * non-default weights. Stripping the font-weight classes from className
 * ensures the style prop is the sole source of font info.
 */
export function useResolveFontFamily(className?: string): ResolvedFontResult | undefined {
  const map = useContext(FontContext);
  if (!map) return undefined;

  if (!className)
    return {
      style: { fontFamily: map['font-normal'] },
      className: '',
    };

  const classes = className.split(/\s+/);
  let resolved: ResolvedFont = { fontFamily: map['font-normal'] };
  for (let i = classes.length - 1; i >= 0; i--) {
    const cls = classes[i] as keyof FontFamilyMap;
    const mapped = map[cls];
    if (mapped) {
      resolved = { fontFamily: mapped };
      break;
    }
  }

  return {
    style: resolved,
    className: className
      .replace(FONT_WEIGHT_RE, '')
      .replace(/\s{2,}/g, ' ')
      .trim(),
  };
}

/**
 * The family a text field types in: the app's regular weight. Without it a field on iOS
 * and Android typed in the system font beside text in the app's own, because a
 * `TextInput` reads no family from `FontProvider`. Returns only the family — a field
 * keeps its own padding.
 */
export function useFieldFont(): { fontFamily: string } | undefined {
  const map = useContext(FontContext);
  return map ? { fontFamily: map['font-normal'] } : undefined;
}
