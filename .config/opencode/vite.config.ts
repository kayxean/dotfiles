import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    experimentalSortPackageJson: true,
    ignorePatterns: ["dist/**"],
    semi: true,
    singleQuote: true,
    sortImports: {
      groups: [
        "type",
        "builtin",
        "external",
        ["internal", "subpath"],
        ["parent", "sibling", "index"],
        "style",
        "unknown",
      ],
      ignoreCase: false,
      newlinesBetween: false,
      order: "asc",
    },
  },

  lint: {
    categories: {
      correctness: "error",
      pedantic: "warn",
      perf: "error",
      suspicious: "error",
    },
    ignorePatterns: ["dist/**"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    plugins: ["oxc", "typescript", "unicorn", "vitest"],
    rules: {
      curly: ["error", "multi-line"],
      "max-lines-per-function": ["error", { max: 100 }],
      "no-console": "error",
      "prefer-const": ["error", { destructuring: "all" }],
      "prefer-destructuring": [
        "error",
        {
          AssignmentExpression: { array: false, object: true },
          VariableDeclarator: { array: false, object: true },
        },
      ],
      "unicode-bom": ["error", "never"],

      "typescript/ban-ts-comment": [
        "error",
        {
          minimumDescriptionLength: 3,
          "ts-check": false,
          "ts-expect-error": "allow-with-description",
          "ts-ignore": false,
          "ts-nocheck": false,
        },
      ],
      "typescript/consistent-indexed-object-style": ["error", "record"],
      "typescript/no-explicit-any": "error",
      "typescript/prefer-readonly-parameter-types": [
        "error",
        {
          checkParameterProperties: true,
          ignoreInferredTypes: true,
          treatMethodsAsReadonly: true,
        },
      ],

      "sort-imports": ["error", { ignoreDeclarationSort: true }],
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
      "unicorn/no-process-exit": "error",
      "unicorn/prefer-module": "error",
    },
  },
});
