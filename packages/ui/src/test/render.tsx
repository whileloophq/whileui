import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import { SafeAreaProvider, type Metrics } from 'react-native-safe-area-context';
import { PortalHost } from '@rn-primitives/portal';
import { MotionProvider } from '../lib/motion-policy';

/** Fixed so layout assertions do not depend on a device. Notch-sized top inset. */
export const TEST_METRICS: Metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider initialMetrics={TEST_METRICS}>
      <MotionProvider mode="disabled">
        {children}
        <PortalHost />
      </MotionProvider>
    </SafeAreaProvider>
  );
}

/**
 * Renders with the provider stack every component in this package may assume.
 * Overlays need the portal host; anything safe-area aware needs fixed metrics.
 *
 * Await it — React Native Testing Library v14 renders asynchronously, and `screen`
 * stays unpopulated until the promise resolves.
 */
export function renderUI(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: Providers, ...options });
}

export * from '@testing-library/react-native';
export { renderUI as render };
