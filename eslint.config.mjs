import eslint from '@eslint/js';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2021
      }
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          'selector': 'variable',
          'format': ['camelCase', 'UPPER_CASE'],
          'leadingUnderscore': 'allow'
        }
      ],
      '@/object-curly-spacing': ['error', 'never'],
      '@/indent': ['error', 2],
      '@/quotes': [
        'error',
        'single',
        {
          'allowTemplateLiterals': true
        }
      ],
      'sort-keys': [
        'error',
        'asc',
        {
          'caseSensitive': true,
          'natural': false
        }
      ],
      'comma-dangle': [
        'error',
        'always-multiline'
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error'
    }
  }
];
