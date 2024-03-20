/* eslint-disable */
module.exports = {
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
        parser: "typescript",
        endOfLine: "auto",
      },
    ],
    "prefer-arrow-callback": "error",
    "prefer-destructuring": ["error", { object: true, array: false }],
    "prefer-const": [
      "error",
      {
        destructuring: "any",
        ignoreReadBeforeAssign: false,
      },
    ],
    "spaced-comment": [
      "error",
      "always",
      {
        line: {
          markers: ["/"],
          exceptions: ["-", "+"],
        },
        block: {
          markers: ["!"],
          exceptions: ["*"],
          balanced: true,
        },
      },
    ],
    "prefer-template": "error",
    "no-var": "error",
    "no-useless-return": "error",
    "no-useless-concat": "error",
    "no-unused-expressions": "error",
  },
};
