import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../../lib/cn';
import { Spinner } from '../../components/spinner';
import { haptics } from '../../platform';

// Drag down at the top of a scroll area to reload — the gesture a native app
// gives you for free and a WebView does not.
//
// It scrolls its own children, because the gesture has to know it is already at
// the top: `scrollTop === 0` on this element is the whole condition. The
// touchmove listener is attached with `{ passive: false }` by hand, since React
// registers that event passively and `preventDefault` would be ignored — which
// is what makes the drag feel like a drag instead of fighting the scroller.

const RESISTANCE = 0.5;
const MAX_OVERSHOOT = 1.6;

export interface PullToRefreshProps extends HTMLAttributes<HTMLDivElement> {
  onRefresh: () => Promise<unknown> | unknown;
  /** Also spin when the app reloads for its own reasons. */
  refreshing?: boolean;
  /** Drag distance that triggers a refresh. */
  threshold?: number;
  disabled?: boolean;
  children?: ReactNode;
}

export function PullToRefresh({
  onRefresh,
  refreshing = false,
  threshold = 64,
  disabled = false,
  className,
  children,
  style,
  ...props
}: PullToRefreshProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pull, setPull] = useState(0);
  const [busy, setBusy] = useState(false);

  // The listeners are outside React's lifecycle, so they read state through
  // refs rather than closing over a render's values.
  const pullRef = useRef(0);
  const startRef = useRef<number | null>(null);
  const armedRef = useRef(false);
  const blockedRef = useRef(false);

  blockedRef.current = disabled || busy || refreshing;

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const setPullTo = (value: number) => {
      pullRef.current = value;
      setPull(value);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (blockedRef.current || element.scrollTop > 0 || event.touches.length !== 1) {
        startRef.current = null;
        return;
      }
      startRef.current = event.touches[0].clientY;
      armedRef.current = false;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (startRef.current === null || blockedRef.current) return;

      const delta = event.touches[0].clientY - startRef.current;

      // Scrolling up, or the list moved off the top: hand the gesture back.
      if (delta <= 0 || element.scrollTop > 0) {
        if (pullRef.current !== 0) setPullTo(0);
        startRef.current = null;
        return;
      }

      event.preventDefault();
      const distance = Math.min(delta * RESISTANCE, threshold * MAX_OVERSHOOT);
      setPullTo(distance);

      // One tick when it becomes releasable, as a native list does.
      if (!armedRef.current && distance >= threshold) {
        armedRef.current = true;
        void haptics.impact('light');
      }
    };

    const onTouchEnd = () => {
      if (startRef.current === null) return;
      startRef.current = null;

      if (pullRef.current < threshold) {
        setPullTo(0);
        return;
      }

      setPullTo(threshold);
      setBusy(true);
      void (async () => {
        try {
          await onRefresh();
        } finally {
          setBusy(false);
          setPullTo(0);
        }
      })();
    };

    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: false });
    element.addEventListener('touchend', onTouchEnd, { passive: true });
    element.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
      element.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [onRefresh, threshold]);

  const spinning = busy || refreshing;
  const offset = spinning ? Math.max(pull, threshold * 0.75) : pull;
  const progress = Math.min(offset / threshold, 1);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center"
        style={{
          height: offset,
          opacity: progress,
          transition: startRef.current === null ? 'height 200ms ease-out' : undefined,
        }}
      >
        <span className="flex items-end pb-2 text-muted-foreground">
          <Spinner
            size="sm"
            className={spinning ? undefined : 'animate-none'}
            style={spinning ? undefined : { transform: `rotate(${progress * 270}deg)` }}
          />
        </span>
      </div>

      <div
        ref={scrollRef}
        className={cn('min-h-0 flex-1 overflow-y-auto overscroll-y-contain', className)}
        style={{
          transform: offset ? `translateY(${offset}px)` : undefined,
          transition: startRef.current === null ? 'transform 200ms ease-out' : undefined,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

PullToRefresh.displayName = 'PullToRefresh';
