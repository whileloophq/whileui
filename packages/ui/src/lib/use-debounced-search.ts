import { useEffect, useState } from 'react';

export interface DebouncedSearchOptions {
  /** Milliseconds after the last keystroke. @default 300 */
  delay?: number;
  /** A shorter query returns `''`: one letter matches half a list. @default 2 */
  minLength?: number;
}

/**
 * The query a search should run: trimmed, empty below `minLength`, and `delay` behind the
 * keys, so a server is asked once per pause rather than once per letter.
 */
export function useDebouncedSearch(
  value: string,
  { delay = 300, minLength = 2 }: DebouncedSearchOptions = {}
): string {
  const trimmed = value.trim();
  const query = trimmed.length >= minLength ? trimmed : '';
  const [debounced, setDebounced] = useState(query);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), delay);
    return () => clearTimeout(timer);
  }, [delay, query]);
  return debounced;
}
