const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Monorepo support — watch the root so changes in packages/ui are detected
const monorepoRoot = path.resolve(__dirname, '../..');
config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

const uniwind = withUniwindConfig(config, {
  cssEntryFile: './global.css',
});

/**
 * Packages that must resolve the real `react-native`, not Uniwind's wrapper.
 *
 * Uniwind's native resolver rewrites every `from 'react-native'` to
 * `uniwind/components` so that `className` reaches the primitives, exempting only
 * importers that live inside `react-native` itself. The wrapper re-exports
 * components and nothing else, so a package importing a non-component export
 * receives `undefined` — with no build error and no warning.
 *
 * `expo-asset` does `import { AssetRegistry } from 'react-native'`. Under the
 * rewrite that is `undefined`, `Asset.fromModule` throws, `Font.loadAsync` never
 * resolves, and every `@expo/vector-icons` glyph is silently absent on iOS and
 * Android while rendering correctly on web, where Uniwind uses a different
 * resolver. Nothing fails until an `Icon` mounts.
 *
 * These three render no themeable primitives, so the real module costs nothing.
 * Keep the list as short as the symptom requires.
 */
const NEEDS_REAL_REACT_NATIVE = ['expo-asset', 'expo-font', '@expo/vector-icons'];

const uniwindResolveRequest = uniwind.resolver.resolveRequest;

uniwind.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native') {
    const origin = context.originModulePath ?? '';
    if (NEEDS_REAL_REACT_NATIVE.some((pkg) => origin.includes(`node_modules/${pkg}/`))) {
      // Metro's own resolver, bypassing the rewrite for this importer only.
      return context.resolveRequest(context, moduleName, platform);
    }
  }
  return uniwindResolveRequest(context, moduleName, platform);
};

module.exports = uniwind;
