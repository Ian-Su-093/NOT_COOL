export default {
    preset: 'react-native',
    setupFiles: ['./jestSetup.js'],
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
  };