'use strict';

const { withUniwindConfig } = require('uniwind/metro');

/**
 * Packages that must resolve the real `react-native`. Uniwind's native resolver
 * rewrites every `from 'react-native'` to its component wrapper. The wrapper re-exports
 * the components and most of the API, but not all of it, and a missing export arrives
 * as `undefined` with no build error. `expo-asset` imports `AssetRegistry`, which the
 * wrapper lacks, and without it every `@expo/vector-icons` glyph is silently absent on
 * iOS and Android.
 */
const NEEDS_REAL_REACT_NATIVE = ['expo-asset', 'expo-font', '@expo/vector-icons'];

function withWhileUIMetro(config, options) {
  if (!options || typeof options.cssEntryFile !== 'string') {
    throw new Error(
      "withWhileUIMetro(config, options): pass Uniwind's options, at least { cssEntryFile: './global.css' }"
    );
  }
  const { exemptFromUniwindRewrite = [], ...uniwindOptions } = options;
  const wrapped = withUniwindConfig(config, uniwindOptions);
  const exempt = [...NEEDS_REAL_REACT_NATIVE, ...exemptFromUniwindRewrite];
  const uniwindResolveRequest = wrapped.resolver.resolveRequest;

  wrapped.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'react-native') {
      // Metro reports Windows paths with backslashes; match either separator.
      const origin = (context.originModulePath ?? '').replace(/\\/g, '/');
      if (exempt.some((pkg) => origin.includes(`node_modules/${pkg}/`))) {
        return context.resolveRequest(context, moduleName, platform);
      }
    }
    return uniwindResolveRequest(context, moduleName, platform);
  };

  return wrapped;
}

module.exports = { withWhileUIMetro, NEEDS_REAL_REACT_NATIVE };
