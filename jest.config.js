module.exports = {
  verbose: false,
  collectCoverageFrom: [
    '!.eslintrc.js',
    '!**/.vscode/**',
    '!**/build/**',
    '!**/coverage/**',
    '!**/devops/**',
    '!**/docs/**',
    '!**/node_modules/**',
    '!**/test/**',
    '!index.js',
    '!jest.config.js',
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
  setupFilesAfterEnv: ['./test/setup.js'],
  testMatch: ['**/test/**/*.test.js?(x)'],
};
