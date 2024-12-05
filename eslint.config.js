import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import local from 'eslint-plugin-local';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: [
      '**/.DS_Store',
      '**/node_modules',
      '**/build',
      '.svelte-kit',
      'package',
      '**/.env',
      '**/.env.*',
      '!**/.env.example',
      '**/pnpm-lock.yaml',
      '**/package-lock.json',
      '**/yarn.lock',
      '**/migrations/'
    ]
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'plugin:drizzle/recommended',
    'prettier'
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
      local
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },

      parser: tsParser,

      parserOptions: {
        extraFileExtensions: ['.svelte']
      }
    },

    rules: {
      curly: 'error',
      'no-constant-condition': 'off',
      'no-control-regex': 'off',

      'no-empty': [
        'error',
        {
          allowEmptyCatch: true
        }
      ],

      'no-inner-declarations': 'off',
      'no-useless-escape': 'off',

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      'svelte/no-at-html-tags': 'off',
      'svelte/no-inner-declarations': 'off',
      'svelte/valid-compile': [
        'error',
        {
          ignoreWarnings: true
        }
      ],

      'drizzle/enforce-delete-with-where': [
        'error',
        {
          drizzleObjectName: ['db', 'tx']
        }
      ],
      'drizzle/enforce-update-with-where': [
        'error',
        {
          drizzleObjectName: ['db', 'tx']
        }
      ],

      'local/safe-in-array': [`error`]
    }
  },
  {
    files: ['**/*.svelte'],

    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
        svelteFeatures: {
          experimentalGenerics: true
        }
      }
    }
  },
  {
    files: ['src/**/*.ts', 'src/**/*.svelte'],
    rules: {
      'local/lib-import': [`error`]
    }
  },
  {
    files: ['src/script/**/*.ts'],
    ignores: ['src/script/util/**'],

    rules: {
      'local/executable-script': [`error`],
      'local/script-exit': [`error`]
    }
  }
];
