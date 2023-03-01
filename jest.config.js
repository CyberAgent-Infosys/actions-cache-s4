require('nock').disableNetConnect();

const { compilerOptions } = require('./tsconfig');

module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  verbose: true,
};
