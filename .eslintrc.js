module.exports = {
  "env": {
    "jest": true,
    "node": true
  },
  "extends": [
    "airbnb-base",
    "plugin:security/recommended",
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions:  {
    ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
  },
  "plugins": [
    'import',
    "security",
    "jest"
  ],
  "rules": {
    "jest/no-disabled-tests": [2],
    "jest/no-focused-tests": [2],
    "jest/no-identical-title": [2],
    "jest/prefer-to-have-length": [2],
    "jest/valid-expect": [2],
    // TODO: Enable these lint rules:
    // They were disabled to facilitate the transition to TypeScript
    "@typescript-eslint/explicit-function-return-type": [0],
    "@typescript-eslint/no-var-requires": [0],
    '@typescript-eslint/no-empty-interface': [0],
    '@typescript-eslint/no-explicit-any': [0],
    '@typescript-eslint/class-name-casing': [0],
    '@typescript-eslint/ban-ts-ignore': [0],
    'import/prefer-default-export': [0],
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      // use <root>/tsconfig.json
      typescript: {}
    }
  }
};
