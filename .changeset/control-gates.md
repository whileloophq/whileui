---
'@thewhileloop/whileui': minor
---

Navigation bars and Select options follow the keyboard patterns, and navigation bars
colour their icons by state.

- `BottomNav`, `FloatingBottomNav` and `TabBar` are one Tab stop — the active tab — with
  the arrow keys, Home and End moving between tabs on web. Every tab was its own stop.
- Their `icon` can be a function of `{ active, color }` (`NavIcon`), so the icon follows
  the tab: primary on the active `BottomNav` tab, primary-foreground on the
  `FloatingBottomNav` pill, muted elsewhere. An icon font takes a colour value, not a
  class, so a fixed-colour icon stayed grey on the active tab — on the floating pill,
  grey on primary.
- `BottomNav` shows selection by colour alone. It used to dim inactive icons to 54%,
  which also faded the badge inside them below readable contrast.
- `BottomNav` pads itself evenly. Its extra fixed bottom padding doubled the safe area
  inside `AppShell` and pushed the tabs up.
- `Select` options draw the focus ring as well as the tinted background, which alone was
  too faint to find.

What to check at call sites:

- Write tab icons as `icon: ({ color }) => <Feather name="home" color={color} />`. A
  plain element still renders, in whatever colour you gave it.
- A `BottomNav` outside `AppShell`, at the bottom of an edge-to-edge screen, needs the
  bottom safe-area inset from its screen.
- `INTERACTION_TOKENS.inactiveOpacity` is removed; nothing in the library used it after
  this change.
