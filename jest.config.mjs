/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    modulePathIgnorePatterns: ['<rootDir>/.postgres-data/'],
    testPathIgnorePatterns: ['<rootDir>/.postgres-data/'],
    watchPathIgnorePatterns: ['<rootDir>/.postgres-data/'],
    transform: {
        '^.+\\.[cm]?js$': 'babel-jest',
    },
    transformIgnorePatterns: ['/node_modules/(?!@faker-js/faker/)'],
};

export default config;
