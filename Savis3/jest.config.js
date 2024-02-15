module.exports = {
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
    'lcov', 'text', 'text-summary', 'html'
  ]
};
