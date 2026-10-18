---
'@thewhileloop/whileui': patch
---

Correct the Uniwind setup instructions in the README, which did not work as written.

- `withUniwindConfig` was shown curried — `withUniwindConfig(options)(config)`. Its real
  signature is `withUniwindConfig(config, options)`, so the documented form throws while
  wiring up Metro. If you copied it, pass the config first.
- The `global.css` example omitted `@source './node_modules/@thewhileloop/whileui/dist';`.
  Tailwind does not scan `node_modules`, so without that line this package's class names
  are never detected and every component renders unstyled, with no error to explain it.
  Add it to any app that installs WhileUI from npm.

No runtime code changed.
