import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import nextVitals from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  js.configs.recommended,
  ...nextVitals,
  {
    files: ['src/**/*.{js,jsx}'],
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
      'react-hooks/exhaustive-deps': 'error',
    },
  },
])
