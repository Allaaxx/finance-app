import 'dotenv/config';

/** @type {import('jest').Config} */
const config = {
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    modulePathIgnorePatterns: ['<rootDir>/.postgres/'],
    testPathIgnorePatterns: ['<rootDir>/.postgres/'],
    watchPathIgnorePatterns: ['<rootDir>/.postgres/'],
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.[cm]?js$': 'babel-jest',
    },
    transformIgnorePatterns: ['/node_modules/(?!@faker-js/faker/)'],
    collectCoverageFrom: ['src/**/*.js'],
    globalSetup: '<rootDir>/jest.global-setup.js',
    setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],
};

export default config;