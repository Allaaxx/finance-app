import 'dotenv/config';

/** @type {import('jest').Config} */
const config = {
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    transformIgnorePatterns: ['/node_modules/(?!(@faker-js/faker|uuid)/)'],
    collectCoverageFrom: ['src/**/*.js'],
    globalSetup: '<rootDir>/jest.global-setup.js',
    setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],
    watchPathIgnorePatterns: ['<rootDir>/.postgres'],
    modulePathIgnorePatterns: ['<rootDir>/.postgres'],
    roots: ['<rootDir>/src'],
};

export default config;