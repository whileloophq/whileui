---
'@thewhileloop/whileui': minor
---

The package now ships docs for AI agents in `dist/agent/`: `llms.txt` (rules, composition
grammar and every component), `llms-components.txt` (each component's API section),
`llms-full.txt` (the README) and `catalog.json` (the same data, structured, exported as
`@thewhileloop/whileui/agent/catalog.json`). They are generated from the README at build
time, so an agent always reads the docs for the installed version. Nothing changes for
existing call sites.
