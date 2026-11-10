import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Modal, Platform, View, type ModalProps, type ViewInstance } from 'react-native';
import { PortalHost } from '@rn-primitives/portal';
import type * as PopoverPrimitive from '@rn-primitives/popover';

type PortalContainer = React.ComponentProps<typeof PopoverPrimitive.Portal>['container'];

interface NestedOverlay {
  close: () => void;
}

interface OverlayHostValue {
  hostName: string;
  container: PortalContainer;
  register: (overlay: NestedOverlay) => () => void;
}

const OverlayHostContext = createContext<OverlayHostValue | null>(null);

export interface OverlayHostProps extends Pick<
  ModalProps,
  'animationType' | 'onShow' | 'onDismiss'
> {
  open: boolean;
  /** Android back and web Escape. Omit for a host that only closes from inside. */
  onRequestClose?: () => void;
  children: React.ReactNode;
}

interface EscapeKeyTarget {
  addEventListener(
    type: 'keydown',
    listener: (event: { key: string }) => void,
    capture: boolean
  ): void;
  removeEventListener(
    type: 'keydown',
    listener: (event: { key: string }) => void,
    capture: boolean
  ): void;
}

// Radix closes a nested overlay on the Escape keydown; React Native Web closes the Modal
// on the keyup of the same press. Seeing the keydown first lets the host drop that keyup.
const escapeKeyTarget =
  Platform.OS === 'web' ? (globalThis as { document?: EscapeKeyTarget }).document : undefined;

/**
 * The platform `Modal` every WhileUI overlay is hosted in. Each Modal is its own window,
 * so the platform already routes Android back and web Escape to the topmost one and, on
 * web, traps and restores focus. The host adds what a root-level portal cannot reach:
 * nested Select, Popover, Tooltip and HoverCard content renders inside this window, and a
 * dismiss request closes the topmost nested overlay before the host itself.
 */
export function OverlayHost({
  open,
  onRequestClose,
  children,
  animationType,
  onShow,
  onDismiss,
}: OverlayHostProps) {
  const hostName = useId();
  const nested = useRef<NestedOverlay[]>([]);
  const consumedByNested = useRef(false);
  const [container, setContainer] = useState<PortalContainer>(undefined);

  const register = useCallback((overlay: NestedOverlay) => {
    nested.current = [...nested.current, overlay];
    return () => {
      nested.current = nested.current.filter((entry) => entry !== overlay);
    };
  }, []);

  const requestClose = useCallback(() => {
    if (consumedByNested.current) {
      consumedByNested.current = false;
      return;
    }
    const topmost = nested.current.at(-1);
    if (topmost) {
      topmost.close();
      return;
    }
    onRequestClose?.();
  }, [onRequestClose]);

  useEffect(() => {
    if (!escapeKeyTarget || !open) return;
    const markConsumed = (event: { key: string }) => {
      if (event.key === 'Escape' && nested.current.length > 0) consumedByNested.current = true;
    };
    escapeKeyTarget.addEventListener('keydown', markConsumed, true);
    return () => {
      escapeKeyTarget.removeEventListener('keydown', markConsumed, true);
      consumedByNested.current = false;
    };
  }, [open]);

  const attachContainer = useCallback((node: ViewInstance | null) => {
    setContainer(node as unknown as PortalContainer);
  }, []);

  const value = useMemo(() => ({ hostName, container, register }), [hostName, container, register]);

  return (
    <Modal
      visible={open}
      transparent
      animationType={animationType}
      presentationStyle="overFullScreen"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={requestClose}
      onShow={onShow}
      onDismiss={onDismiss}
    >
      <OverlayHostContext.Provider value={value}>
        {children}
        {Platform.OS === 'web' ? <View ref={attachContainer} /> : <PortalHost name={hostName} />}
      </OverlayHostContext.Provider>
    </Modal>
  );
}

/** Portal props for content rendered inside the nearest host. An explicit `portalHost` wins. */
export function useOverlayPortalTarget(portalHost?: string): {
  hostName?: string;
  container?: PortalContainer;
} {
  const host = useContext(OverlayHostContext);
  if (portalHost !== undefined) return { hostName: portalHost };
  return { hostName: host?.hostName, container: host?.container };
}

/** Lets the nearest host close this overlay before itself while `open` is true. */
export function useNestedOverlay(open: boolean, close: () => void) {
  const host = useContext(OverlayHostContext);
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  });
  useEffect(() => {
    if (!host || !open) return;
    return host.register({ close: () => closeRef.current() });
  }, [host, open]);
}
