---
'@thewhileloop/whileui': patch
---

Theme colours, icon colours and visual tokens are now derived once per distinct theme
snapshot and shared, instead of every component parsing 104 colour strings and 83 token
values on every render. The hooks return the same object until a CSS variable changes,
so callers can memoise on them. No API change.
