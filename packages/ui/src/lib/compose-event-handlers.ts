import type { PressableProps } from 'react-native';
import type { ReactElement } from 'react';

type EventHandler<E> = ((event: E) => void) | null | undefined;

/**
 * What `asChild` can assume about the element it was handed. The child is the caller's,
 * so this names only the props we actually read off it before cloning — anything wider
 * would be a claim we cannot check.
 */
export type AsChildElement = ReactElement<
  Pick<PressableProps, 'onPress' | 'onLongPress'> & { className?: string }
>;

function isDefaultPrevented(event: unknown): boolean {
  if (!event || typeof event !== 'object') return false;

  if ('defaultPrevented' in event && typeof event.defaultPrevented === 'boolean') {
    return event.defaultPrevented;
  }

  if ('isDefaultPrevented' in event && typeof event.isDefaultPrevented === 'function') {
    return Boolean(event.isDefaultPrevented());
  }

  return false;
}

export function composeEventHandlers<E>(
  userHandler?: EventHandler<E>,
  internalHandler?: EventHandler<E>,
  { checkForDefaultPrevented = true }: { checkForDefaultPrevented?: boolean } = {}
) {
  return (event: E) => {
    userHandler?.(event);

    if (checkForDefaultPrevented && isDefaultPrevented(event)) {
      return;
    }

    internalHandler?.(event);
  };
}
