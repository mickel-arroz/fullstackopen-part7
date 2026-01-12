import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import vitestGlobals from 'eslint-plugin-vitest-globals';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'es5',
          endOfLine: 'lf',
        },
      ],
    },
  },
  prettierConfig,
  // Tests: habilita los globals de Vitest en archivos de prueba
  {
    files: ['**/*.test.{js,jsx}'],
    languageOptions: {
      ...{},
      globals: {
        // Soporta tanto los globals de "globals" como los del plugin vitest-globals
        ...globals.vitest,
        ...vitestGlobals.environments.env.globals,
      },
    },
  },
];
