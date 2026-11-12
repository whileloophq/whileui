import type React from 'react';

/** What a navigation bar tells an icon about the tab it sits in. */
export interface NavIconState {
  /** Whether the tab is the selected one. */
  active: boolean;
  /** The colour the tab's label uses, as a value an icon component accepts. */
  color: string;
}

/**
 * A tab's icon. Pass a function to colour it with the tab: an icon font takes a colour
 * value, not a class, so an element with a fixed colour stayed grey on the active tab —
 * on `FloatingBottomNav` grey on the primary pill. A plain element is drawn as given.
 *
 * @example icon: ({ color }) => <Feather name="home" size={22} color={color} />
 */
export type NavIcon = React.ReactNode | ((state: NavIconState) => React.ReactNode);

export function renderNavIcon(icon: NavIcon, state: NavIconState): React.ReactNode {
  return typeof icon === 'function' ? icon(state) : icon;
}
