module.exports = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/tests/jest.setup.js"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^react-native$": "<rootDir>/tests/reactNativeMock.js"
  }
};