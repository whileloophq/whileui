import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import jest from 'eslint-plugin-jest';
import tseslint from 'typescript-eslint';

/**
 * One config for the whole workspace. Each package runs `eslint .` from its own
 * directory; ESLint walks up to this file, so the rules are the same everywhere and
 * there is one place to change them.
 *
 * The type-aware rules are enumerated rather than pulled in as a preset. React Native's
 * types hand back `any` often enough that `recommended-type-checked` reports mostly
 * noise, and a lint task people learn to ignore is worse than no lint task.
 */
export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/.expo/**',
      '**/.delta/**',
      '**/.turbo/**',
      '**/*.generated.*',
    ],
  },

  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat['recommended-latest'],

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // A dropped `await` on an RNTL call does not throw — the state update simply never
      // lands and the assertion reads stale UI. This rule is the only thing standing
      // between that and a green suite that proves nothing.
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',

      // `AGENTS.md` requires replacing deprecated APIs rather than carrying them. This
      // reads the `@deprecated` tag straight from the dependency's types, so an SDK bump
      // surfaces its removals here instead of in a red-screen months later.
      '@typescript-eslint/no-deprecated': 'error',

      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],

      // `interface FooProps extends ViewProps {}` is how a component publishes a named
      // prop type it does not yet extend. Adding a member to satisfy the rule would be
      // worse than the empty body.
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],

      // `require` is how React Native resolves a bundled asset — an ES import would need
      // the generated `expo-env.d.ts`, which is not checked in.
      '@typescript-eslint/no-require-imports': [
        'error',
        { allow: ['\\.(png|jpg|jpeg|gif|webp|svg)$'] },
      ],

      // Removed in React Native 0.86.
      'no-restricted-properties': [
        'error',
        {
          object: 'StyleSheet',
          property: 'absoluteFillObject',
          message: 'Removed in React Native 0.86. Use StyleSheet.absoluteFill.',
        },
      ],
    },
  },

  {
    files: ['**/*.test.{ts,tsx}', '**/src/test/**/*.{ts,tsx}'],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      // A stray `.only` turns a full suite into one test and still prints green.
      'jest/no-focused-tests': 'error',
      'jest/no-disabled-tests': 'error',
    },
  },

  // Config and script files live outside every tsconfig, so type-aware rules have no
  // program to consult.
  {
    files: ['**/*.{js,cjs,mjs}'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      globals: {
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  }
);
