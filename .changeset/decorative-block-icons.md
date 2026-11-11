---
'@thewhileloop/whileui': patch
---

The icons in `EmptyState`, `ErrorState`, `FeatureGate` and `MetricCard` are decorative and
are now hidden from screen readers. An icon font glyph is text, so it was read inside the
block's description. No call-site change is needed.
