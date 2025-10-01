import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import angularPlugin from '@angular-eslint/eslint-plugin';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import importPlugin from 'eslint-plugin-import';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import angularTemplateParser from '@angular-eslint/template-parser';
import prettierPlugin from 'eslint-plugin-prettier';
import angularCustom from './eslint-plugin-angular-custom/index.js';

export default [
  {
    files: ['**/*.ts'],
    ignores: ['projects/**/*', 'src/api/**/*'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        createDefaultProgram: true,
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@angular-eslint': angularPlugin,
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
      prettier: prettierPlugin,
      angularCustom: angularCustom,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/directive-class-suffix': 'error',
      '@angular-eslint/no-output-native': 'warn',
      '@angular-eslint/use-lifecycle-interface': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'warn',
      '@angular-eslint/no-inputs-metadata-property': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      curly: 'error',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'no-duplicate-imports': 'error',
      'max-len': ['warn', { code: 120 }],
      // 'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'prefer-const': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'keyword-spacing': ['error', { before: true, after: true }],
      'prettier/prettier': 'error',
      'import/no-cycle': 'error',
      'angularCustom/validate-component-imports': 'error',
      'angularCustom/validate-component-providers': 'error',
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      '@angular-eslint/template/no-any': 'error',
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/i18n': [
        'off',
        {
          checkId: true,
          checkAttributes: true,
        },
      ],
    },
  },
];
