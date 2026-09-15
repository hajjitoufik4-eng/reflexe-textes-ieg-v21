import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
export default defineConfig([
  ...nextVitals,
  globalIgnores([
    '.next/**',
    'public/**',
    'documents/**',
    'prototype/**',
    'corpus-inventaire-2026-09-08/**',
    'data.js',
  ]),
]);
