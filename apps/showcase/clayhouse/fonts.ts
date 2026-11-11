import type { FontFamilyMap } from '@thewhileloop/whileui';
import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from '@expo-google-fonts/instrument-serif';
import { Geist_400Regular, Geist_500Medium, Geist_600SemiBold } from '@expo-google-fonts/geist';
import { GeistMono_500Medium } from '@expo-google-fonts/geist-mono';

export const fonts = {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  GeistMono_500Medium,
};

// Instrument Serif takes every bold role, so headings, prices and readings inside the
// library's own components turn serif without touching a component. It has one weight;
// its size and contrast do the work a heavier weight would.
export const fontMap: FontFamilyMap = {
  'font-normal': 'Geist_400Regular',
  'font-medium': 'Geist_500Medium',
  'font-semibold': 'Geist_600SemiBold',
  'font-bold': 'InstrumentSerif_400Regular',
  'font-extrabold': 'InstrumentSerif_400Regular',
};

export const mono = { fontFamily: 'GeistMono_500Medium' } as const;

/** The italic cut, for the one or two words on a screen that deserve a voice. */
export const serifItalic = { fontFamily: 'InstrumentSerif_400Regular_Italic' } as const;
