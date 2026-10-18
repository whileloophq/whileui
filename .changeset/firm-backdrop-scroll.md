---
'@thewhileloop/whileui': major
---

Make scrolling inside `Sheet`, `DrawerMenu` and `PullToRefreshScrollView` predictable.

- **A drag across a `Sheet` or `DrawerMenu` backdrop no longer closes it.** The backdrop
  is a full-screen `Pressable`, and a press stays alive while the finger stays inside it,
  so any swipe that started and ended on the backdrop counted as a tap. A user trying to
  scroll a half-height sheet would dismiss it instead. Only a tap closes it now.
- `SheetContent` accepts `ScrollView` props, enables nested scrolling, keeps taps on
  inputs with the keyboard open, and merges your `contentContainerStyle` after its own
  padding.
- `DrawerMenu` scrolls its sections instead of clipping a long menu, slides in from the
  right under RTL, and follows the motion policy for its timing.
- `PullToRefreshScrollView` bounces on short content so it can still be pulled, no
  longer accepts a competing `refreshControl`, and offers a **Refresh** accessibility
  action so screen reader users can refresh without dragging.

Nothing to change at call sites unless you passed `refreshControl`. Remove it; the
component owns that control.
