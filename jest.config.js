module.exports = {
  verbose: false,
  collectCoverageFrom: [
    '!**/.vscode/**',
    '!**/devops/**',
    '!**/docs/**',
    '!**/coverage/**',
    '!jest.config.js',
    '!.eslintrc.js',
    '!**/node_modules/**',
    '!**/test/**',
    '!index.js',
    '**/*.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupTestFrameworkScriptFile: './test/setup.js',
  testMatch: ['**/test/**/test.*.js?(x)'],
};
