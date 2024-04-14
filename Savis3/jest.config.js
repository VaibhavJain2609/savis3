module.exports = {
  testEnvironment: 'jsdom',
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globalSetup: '<rootDir>/setup-jest.ts',
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!lodash-es/)"
  ],
  testMatch: ['src/app/**/*.spec.ts', '**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: [
    'lcov', 'html'
  ],
  coveragePathIgnorePatterns: [
    "/src/app/Utils/"
  ],
  setupFiles: ['jest-canvas-mock'],
};
