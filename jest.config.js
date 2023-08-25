module.exports = {
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleFileExtensions: ["ts", "js", "jsx", ".tsx", "json", "node"],
  testMatch: ["**/*.test.(ts|tsx|js|jsx)"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
};
