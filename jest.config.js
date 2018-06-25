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
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },
  setupTestFrameworkScriptFile: './test/setup.js',
  testMatch: ['**/test/**/test.*.js?(x)'],
};
