---
'@thewhileloop/whileui': minor
---

New `SectionedList` and `Pagination`. `SectionedList` groups rows under a header wherever
`sectionOf(item)` changes, and draws none when every row is in one section; it renders
every item, so it is for bounded lists such as one page of results. `Pagination` is
"83 total · Previous · Page 2 of 4 · Next": it draws nothing for a single page, disables
the ends, and announces the new page after a press.
