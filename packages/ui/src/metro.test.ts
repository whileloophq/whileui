jest.mock('uniwind/metro', () => ({
  withUniwindConfig: (config: { resolver: object }) => ({
    ...config,
    resolver: { ...config.resolver, resolveRequest: mockUniwindResolve },
  }),
}));

const mockUniwindResolve = jest.fn(() => ({ type: 'sourceFile', filePath: 'uniwind-wrapper' }));
const mockMetroResolve = jest.fn(() => ({ type: 'sourceFile', filePath: 'real-react-native' }));

const { withWhileUIMetro, NEEDS_REAL_REACT_NATIVE } =
  jest.requireActual<typeof import('./metro.cjs')>('./metro.cjs');

function resolveFrom(originModulePath: string, moduleName = 'react-native') {
  const config = withWhileUIMetro({ resolver: {} }, { cssEntryFile: './global.css' });
  return config.resolver!.resolveRequest!(
    { originModulePath, resolveRequest: mockMetroResolve } as never,
    moduleName,
    'ios'
  );
}

describe('withWhileUIMetro', () => {
  afterEach(() => {
    mockUniwindResolve.mockClear();
    mockMetroResolve.mockClear();
  });

  it('sends asset and icon packages to the real react-native and everything else to Uniwind', () => {
    for (const pkg of NEEDS_REAL_REACT_NATIVE) {
      expect(resolveFrom(`/app/node_modules/${pkg}/build/index.js`)).toMatchObject({
        filePath: 'real-react-native',
      });
    }
    expect(resolveFrom('/app/src/App.tsx')).toMatchObject({ filePath: 'uniwind-wrapper' });
    expect(resolveFrom('/app/node_modules/expo-asset/build/index.js', 'expo')).toMatchObject({
      filePath: 'uniwind-wrapper',
    });
  });

  it('lets an app exempt more packages', () => {
    const config = withWhileUIMetro(
      { resolver: {} },
      { cssEntryFile: './global.css', exemptFromUniwindRewrite: ['some-native-lib'] }
    );
    const result = config.resolver!.resolveRequest!(
      {
        originModulePath: '/app/node_modules/some-native-lib/index.js',
        resolveRequest: mockMetroResolve,
      } as never,
      'react-native',
      'android'
    );
    expect(result).toMatchObject({ filePath: 'real-react-native' });
  });
});
