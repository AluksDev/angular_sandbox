import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],

  moduleNameMapper: {
    '^@fuse/(.*)$': '<rootDir>/src/@fuse/$1',
    '^@fuse$': '<rootDir>/src/@fuse/index.ts', // o el archivo principal si usas import sin "/*"
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@utils/(.*)$': '<rootDir>/src/app/utils/$1',
    '^@modules/(.*)$': '<rootDir>/src/app/modules/$1',
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@layout/(.*)$': '<rootDir>/src/app/layout/$1',
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@apigeo/(.*)$': '<rootDir>/src/apigeo/$1',
    'environments/(.*)$': '<rootDir>/src/environments/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },

};

export default config;