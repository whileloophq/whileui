/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // Jest probes `watchman --version` before it runs; a wedged watchman daemon blocks that
  // call forever and the suite never starts. Node's own crawler is fast enough here.
  watchman: false,
  // Jest has no native CSS event sink. The local resolver selects Reanimated's
  // platform-neutral initializer while leaving its testable animation engine intact.
  resolver: '<rootDir>/jest.resolver.cjs',
  moduleNameMapper: {
    '^react-native-worklets$': '<rootDir>/../../node_modules/react-native-worklets/src/mock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  // RN and its ecosystem publish untranspiled Flow/ESM; everything listed here
  // must go through babel rather than be treated as CommonJS.
  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|uniwind|@rn-primitives/.*|react-native-calendars|react-native-reanimated|react-native-worklets))',
  ],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}', '!src/test/**'],
};
