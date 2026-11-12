import { useCallback, useRef, type RefObject } from 'react';
import { Platform, type ViewInstance } from 'react-native';

/** The DOM members this needs; the package builds without DOM types. */
interface WebElement {
  focus(): void;
  querySelectorAll(selector: string): ArrayLike<WebElement>;
  ownerDocument: { activeElement: unknown };
}

interface KeyEvent {
  nativeEvent: { key: string };
  preventDefault(): void;
}

export interface RovingFocus {
  /** For the container. */
  ref: RefObject<ViewInstance | null>;
  /** Moves focus to the first item, on web. */
  focusFirst: () => void;
  /** Spread on the container: the key handler on web, nothing on native. */
  keyboardProps: { onKeyDown: (event: KeyEvent) => void } | null;
}

const KEYS = {
  horizontal: { next: 'ArrowRight', previous: 'ArrowLeft' },
  vertical: { next: 'ArrowDown', previous: 'ArrowUp' },
} as const;

/**
 * Arrow-key movement inside a composite widget on web — a tab list, a menu — as the
 * WAI-ARIA patterns ask: the arrows step to the next or previous item and wrap, Home and
 * End jump to the ends. Put `ref` and `keyboardProps` on the container. Native has no
 * Tab key and its screen readers move by swipe, so nothing is attached there.
 *
 * Pair it with `rovingTabIndex` on the items so the composite is one Tab stop.
 */
export function useRovingFocus(itemSelector: string, orientation: keyof typeof KEYS): RovingFocus {
  const ref = useRef<ViewInstance>(null);

  const items = useCallback(() => {
    const node = ref.current as unknown as WebElement | null;
    return node ? Array.from(node.querySelectorAll(itemSelector)) : [];
  }, [itemSelector]);

  const focusFirst = useCallback(() => {
    if (Platform.OS === 'web') items()[0]?.focus();
  }, [items]);

  const onKeyDown = (event: KeyEvent) => {
    const list = items();
    if (list.length === 0) return;
    const at = list.findIndex((item) => item === item.ownerDocument.activeElement);
    const { next, previous } = KEYS[orientation];
    const targets: Record<string, number> = {
      [next]: (at + 1) % list.length,
      [previous]: (at - 1 + list.length) % list.length,
      Home: 0,
      End: list.length - 1,
    };
    const target = targets[event.nativeEvent.key];
    if (target === undefined) return;
    event.preventDefault();
    list[target]?.focus();
  };

  return {
    ref,
    focusFirst,
    keyboardProps: Platform.OS === 'web' ? { onKeyDown } : null,
  };
}

/**
 * The item's `tabIndex` in a roving composite: only the current item is a Tab stop. Web
 * only — on Android `tabIndex` maps to `focusable`, which this must not change.
 */
export function rovingTabIndex(current: boolean) {
  if (Platform.OS !== 'web') return undefined;
  return current ? 0 : -1;
}
