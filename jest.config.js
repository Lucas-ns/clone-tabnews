const dotenv = require("dotenv");
const nextJest = require("next/jest");

const dotenvFilePath = "./.env.development";
dotenv.config({ path: dotenvFilePath });

const createJestConfig = nextJest({
  dir: ".",
});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
});

module.exports = jestConfig;
