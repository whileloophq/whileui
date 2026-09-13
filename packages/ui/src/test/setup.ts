import '@testing-library/react-native/dist/matchers/extend-expect';

// Reanimated runs for real here — there is no UI thread in Jest, so worklets are
// plain functions and animated values settle synchronously. `jest.config.cjs` points
// the resolver away from the worklets `.native` build, which needs the native module.

// Uniwind resolves CSS variables from Metro-compiled CSS, which Jest has no way to
// produce. Returning undefined drives components down the same fallback path they
// take when a consuming app omits a token — the behaviour worth testing — without a
// "couldn't find your variable" warning per render.
jest.mock('uniwind', () => ({
  ...jest.requireActual('uniwind'),
  useCSSVariable: (names: string | string[]) =>
    Array.isArray(names) ? names.map(() => undefined) : undefined,
}));

// Animations that outlive a test leak into the next one. Fail loudly instead.
afterEach(() => {
  jest.clearAllMocks();
});
