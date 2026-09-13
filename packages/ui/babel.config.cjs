// Used by Jest only. Consumers build this package with tsc, and apps transform it
// with their own Metro/babel pipeline.
module.exports = {
  presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
};
