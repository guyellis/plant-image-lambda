/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: false,
    es6: true,
    jest: true,
    'jest/globals': true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:security/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  plugins: [
    'jest',
    'security',
    'sort-keys-fix',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': [2],
    '@typescript-eslint/no-empty-interface': [2],
    '@typescript-eslint/no-explicit-any': [2],
    '@typescript-eslint/no-var-requires': [2],
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      ts: 'never',
    }],
    'import/prefer-default-export': [0],
    'jest/no-disabled-tests': [2],
    'jest/no-focused-tests': [2],
    'jest/no-identical-title': [2],
    'jest/prefer-to-have-length': [2],
    'jest/valid-expect': [2],
    'quotes': [2, 'single'],
    'semi': [2],
    'sort-keys-fix/sort-keys-fix': [2],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
};
