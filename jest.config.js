/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  // preset: 'ts-jest',
  preset: 'ts-jest/presets/default-esm',
  // preset: 'ts-jest/presets/js-with-ts-esm',
  // preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  // testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['jest-webextension-mock'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
      useESM: true,
    },
  },
};
