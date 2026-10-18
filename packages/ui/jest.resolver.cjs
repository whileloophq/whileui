/** @type {import('jest-resolve').SyncResolver} */
module.exports = (request, options) => {
  if (options.basedir.includes('react-native-reanimated') && request === './initializers') {
    return options.defaultResolver(request, {
      ...options,
      extensions: options.extensions?.filter((extension) => !extension.includes('native')),
    });
  }

  return options.defaultResolver(request, options);
};
