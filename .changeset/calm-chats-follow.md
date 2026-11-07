---
'@thewhileloop/whileui': minor
---

Add a clean composition foundation: semantic token-backed `Text`, the shared `Surface`
primitive, inherited compound form state, and `ChatConversation` for responsive streaming
content. `Card` now uses `Surface` internally. Optional `code` and `markdown` subpaths keep
rich assistant content out of the root bundle; applications using Markdown install the
optional `markdown-it` peer and continue to own links, clipboard actions, tools, sources,
and message state.
