import 'dotenv/config';

/** @type {import('jest').Config} */
const config = {
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    modulePathIgnorePatterns: ['<rootDir>/.postgres/'],
    testPathIgnorePatterns: ['<rootDir>/.postgres/'],
    watchPathIgnorePatterns: ['<rootDir>/.postgres/'],
    transform: {
        '^.+\\.[cm]?js$': 'babel-jest',
    },
    transformIgnorePatterns: ['/node_modules/(?!@faker-js/faker/)'],
    collectCoverageFrom: ['src/**/*.js'],
};

export default config;