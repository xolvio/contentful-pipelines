module.exports = {
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  testMatch: ["/**/__tests__/*.ts?(x)"],
};
