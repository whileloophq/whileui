import '@testing-library/react-native/dist/matchers/extend-expect';

// SDK 58 initializes the native Worklets and CSS bridges during module import.
// `jest.config.cjs` selects their supported test-safe paths.
jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated/mock'),
  interpolate: (value: number, input: number[], output: number[]) => {
    const inputSpan = input[input.length - 1] - input[0];
    const progress = inputSpan === 0 ? 0 : (value - input[0]) / inputSpan;
    return output[0] + progress * (output[output.length - 1] - output[0]);
  },
}));

// Uniwind resolves CSS variables from Metro-compiled CSS, which Jest has no way to
// produce. Returning undefined drives components down the same fallback path they
// take when a consuming app omits a token — the behaviour worth testing — without a
// "couldn't find your variable" warning per render.
jest.mock('uniwind', () => ({
  ...jest.requireActual('uniwind'),
  useCSSVariable: jest.fn((names: string | string[]) =>
    Array.isArray(names) ? names.map(() => undefined) : undefined
  ),
}));

// Animations that outlive a test leak into the next one. Fail loudly instead.
afterEach(() => {
  jest.clearAllMocks();
});
