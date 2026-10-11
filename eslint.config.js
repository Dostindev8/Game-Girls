import js from "@eslint/js";
import globals from "globals";

const noHtml = [
  "error",
  {
    selector: "AssignmentExpression[left.property.name='innerHTML']",
    message: "Usa textContent o createElement.",
  },
  {
    selector: "AssignmentExpression[left.property.name='outerHTML']",
    message: "Usa textContent o createElement.",
  },
  {
    selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
    message: "Usa createElement.",
  },
];

export default [
  {
    ignores: [
      "node_modules/**",
      "docs/captures/**",
      "playwright-report/**",
      "test-results/**",
      "princess-avatar-creator/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      "no-restricted-syntax": noHtml,
    },
  },
  {
    files: ["sw.js"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "script",
      globals: globals.serviceworker,
    },
    rules: {
      "no-restricted-syntax": noHtml,
    },
  },
  {
    files: [
      "eslint.config.js",
      "playwright.config.js",
      "tests/**/*.js",
      "scripts/**/*.{js,mjs}",
    ],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: { ...globals.node, ...globals.browser },
    },
  },
];
