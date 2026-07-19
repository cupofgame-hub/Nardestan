import eslint from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.pnpm-store/**',
      '**/*.tsbuildinfo'
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.vite.rules
    }
  },
  {
    files: ['apps/api/**/*.ts'],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ['**/*.{test,spec}.{js,cjs,mjs,ts,tsx}'],
    languageOptions: {
      globals: globals.node
    }
  }
);
