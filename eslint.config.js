import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'dist-single/**', 'node_modules/**', 'public/**', 'test-results/**', 'playwright-report/**'] },
  js.configs.recommended,
  {
    files: ['src/**/*.js', 'content/**/*.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { ...globals.browser } },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
    },
  },
  {
    files: ['scripts/**/*.mjs', 'vite*.js', 'eslint.config.js', 'playwright.config.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { ...globals.node } },
  },
  {
    // test berjalan di Node, tapi callback page.evaluate() berjalan di browser
    files: ['tests/**/*.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { ...globals.node, ...globals.browser } },
  },
];
