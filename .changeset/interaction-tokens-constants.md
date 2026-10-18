---
'@thewhileloop/whileui': major
---

Press, disabled, and motion timing are no longer CSS variables.

`useInteractionTokens` now always returns `INTERACTION_TOKENS`. A generated theme never
emitted these names, and reading them made Uniwind warn at startup before falling back
to the same numbers.

Delete these from any theme that set them. Nothing reads them anymore:

- `--ui-press-opacity`, `--ui-press-opacity-strong`
- `--ui-disabled-opacity`, `--ui-disabled-opacity-soft`, `--ui-disabled-opacity-subtle`
- `--ui-inactive-opacity`
- `--ui-motion-fast`, `--ui-motion-normal`, `--ui-motion-slow`
- `--ui-motion-spring-damping`, `--ui-motion-spring-stiffness`, `--ui-motion-spring-mass`
- `--ui-drawer-open-duration`, `--ui-drawer-close-duration`

`MotionProvider` still selects system, reduced, full, or disabled motion. It no longer
applies `--ui-motion-*` overrides. To change a duration or a press opacity, edit
`INTERACTION_TOKENS`; a preset cannot.
