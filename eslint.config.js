import globals from "globals";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import typescriptParser from "@typescript-eslint/parser";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginJest from "eslint-plugin-jest";
import eslintPluginSecurity from "eslint-plugin-security";
import eslintPluginSortKeysFix from "eslint-plugin-sort-keys-fix";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings"
  ),
  eslintPluginSecurity.configs.recommended,
  eslintPluginJest.configs['flat/recommended'],
  {
    ignores: ["build/", "node_modules/", "typings/", "coverage/", "dist/", "eslint.config.js"],
  },
  {
    files: ["prettier.config.js"],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'readonly',
      }
    }
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "import": eslintPluginImport,
      "jest": eslintPluginJest,
      "sort-keys-fix": eslintPluginSortKeysFix,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": [2],
      "@typescript-eslint/no-empty-interface": [2],
      "@typescript-eslint/no-explicit-any": [2],
      "@typescript-eslint/no-var-requires": [2],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "never",
          ts: "never",
        },
      ],
      "import/prefer-default-export": [0],
      "jest/no-disabled-tests": [2],
      "jest/no-focused-tests": [2],
      "jest/no-identical-title": [2],
      "jest/prefer-to-have-length": [2],
      "jest/valid-expect": [2],
      quotes: [2, "single"],
      semi: [2],
      "sort-keys-fix/sort-keys-fix": [2],
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".ts"],
        },
      },
    },
  },
];
