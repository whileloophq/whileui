'use strict';

const { withUniwindConfig } = require('uniwind/metro');

/**
 * Packages that must resolve the real `react-native`. Uniwind's native resolver
 * rewrites every `from 'react-native'` to its component wrapper, which re-exports
 * components and nothing else, so a package importing a non-component export gets
 * `undefined` with no build error. `expo-asset` imports `AssetRegistry` that way, and
 * without it every `@expo/vector-icons` glyph is silently absent on iOS and Android.
 */
const NEEDS_REAL_REACT_NATIVE = ['expo-asset', 'expo-font', '@expo/vector-icons'];

function withWhileUIMetro(config, options) {
  const { exemptFromUniwindRewrite = [], ...uniwindOptions } = options;
  const wrapped = withUniwindConfig(config, uniwindOptions);
  const exempt = [...NEEDS_REAL_REACT_NATIVE, ...exemptFromUniwindRewrite];
  const uniwindResolveRequest = wrapped.resolver.resolveRequest;

  wrapped.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'react-native') {
      const origin = context.originModulePath ?? '';
      if (exempt.some((pkg) => origin.includes(`node_modules/${pkg}/`))) {
        return context.resolveRequest(context, moduleName, platform);
      }
    }
    return uniwindResolveRequest(context, moduleName, platform);
  };

  return wrapped;
}

module.exports = { withWhileUIMetro, NEEDS_REAL_REACT_NATIVE };
