import { defineConfig } from 'vitest/config';

// DOM-track tests only. The native track is tested through a consumer app; a
// component that renders `View` needs a React Native runtime, not jsdom.
// No React plugin: JSX comes from esbuild via tsconfig's `jsx: react-jsx`, and
// nothing here needs fast refresh.
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/web/**/*.test.{ts,tsx}'],
    // Testing Library registers its own afterEach cleanup only when the test
    // globals exist; without this, renders pile up across cases.
    globals: true,
  },
});
