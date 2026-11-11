---
'@thewhileloop/whileui': minor
---

Add `themeFromSeeds`, `themeBaseFromSeeds`, `checkThemeContrast` and `contrastRatio`
(from the root and from `@thewhileloop/whileui/tokens`). `themeFromSeeds` builds a full
light and dark theme from a background, foreground and primary colour, tuning only the
colours it derives so they meet WCAG AA; the seeds are kept as given, and `overrides`
replaces any base colour. `checkThemeContrast` reports every text and focus-ring pairing
of any palette. Nothing changes for existing themes.
