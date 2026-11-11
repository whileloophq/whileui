---
'@thewhileloop/whileui': minor
---

`Alert` takes `announce` for alerts that appear in response to an action, such as a failed
submit. Android and the web already read an appearing alert through its live region; iOS
has none, so `announce` speaks the alert's title and description once when it appears.
It is off by default, so alerts that are part of a screen's content are not read aloud on
every visit.
