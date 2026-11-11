const { getDefaultConfig } = require('expo/metro-config');
const { withWhileUIMetro } = require('@thewhileloop/whileui/metro');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Monorepo support — watch the root so changes in packages/ui are detected
const monorepoRoot = path.resolve(__dirname, '../../..');
config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// The helper wraps Uniwind and keeps expo-asset, expo-font and @expo/vector-icons on
// the real react-native so icon fonts load on device. It resolves from packages/ui/dist,
// so run `bun run build` before the first `expo start` after a clean checkout.
module.exports = withWhileUIMetro(config, {
  cssEntryFile: './global.css',
});
