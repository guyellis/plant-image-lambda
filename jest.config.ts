import type { Config } from 'jest';

const collectCoverage = !process.env.SKIP_COVERAGE;

const config: Config = {
  collectCoverage,
  collectCoverageFrom: [
    '!.eslintrc.js',
    '!**/.vscode/**',
    '!**/build/**',
    '!**/coverage/**',
    '!**/devops/**',
    '!**/dist/**',
    '!**/docs/**',
    '!**/node_modules/**',
    '!**/test/**',
    '!index.js',
    '!jest.config.js',
    '!prettier.config.js',
    '!index.ts',
    'src/**/*.{js,ts}',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
    '<rootDir>/src/types/',
    '<rootDir>/test/',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFilesAfterEnv: ['./test/setup.ts'],
  testMatch: ['**/test/**/*.test.ts'],
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  verbose: false,
};

export default config;
