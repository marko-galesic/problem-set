export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  testSequencer: './src/testSequencer.cjs',
  maxWorkers: 1,
  testTimeout: 20000,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/db/backfill*.js',
    '!src/db/fix*.js',
    '!src/db/migrate.js',
    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
