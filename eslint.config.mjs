import prettier from 'eslint-plugin-prettier';
import typescriptEslintParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    ignores: ['**/node_modules/', '**/dist/', '**/*.test.ts'],
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
    languageOptions: {
      parser: typescriptEslintParser,
    },
    plugins: {
      prettier,
      '@typescript-eslint': typescriptEslintPlugin,
      import: importPlugin,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          semi: true,
          singleQuote: false,
          tabWidth: 2,
          trailingComma: 'es5',
          endOfLine: "auto",
        },
      ],
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': 'warn',
      'no-console': 'off',
      "@typescript-eslint/consistent-type-imports": "error"
    },
  },
];
