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
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  setupTestFrameworkScriptFile: './test/setup.js',
  testMatch: ['**/test/**/test.*.js?(x)'],
};
