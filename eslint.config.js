export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        Blob: "readonly",
        console: "readonly",
        document: "readonly",
        Intl: "readonly",
        URL: "readonly",
        window: "readonly",
      },
    },
    rules: {
      "no-constant-condition": "error",
      "no-dupe-keys": "error",
      "no-undef": "error",
      "no-unreachable": "error",
      "no-unused-vars": ["error", { "args": "none" }],
    },
  },
];