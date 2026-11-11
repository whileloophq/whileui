---
'@thewhileloop/whileui': minor
---

New `SearchField` and `useDebouncedSearch`. `SearchField` is a text field with a drawn
magnifier, a clear button once there is text, and a search return key; `icon` replaces
the magnifier. `useDebouncedSearch(value, { delay, minLength })` returns the query to
run: trimmed, `''` below two characters, and 300ms behind the keys.
