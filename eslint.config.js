// @ts-check
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	globalIgnores(['dist/', 'dist-test/', '.astro/', 'playwright-report/', 'test-results/']),
	js.configs.recommended,
	tseslint.configs.strict,
	tseslint.configs.stylistic,
	astro.configs.recommended,
	astro.configs['jsx-a11y-strict'],
	{
		rules: {
			'@typescript-eslint/consistent-type-imports': 'error',
		},
	},
	{
		// Type-aware rules for TypeScript modules. Astro's parser can't resolve types across
		// `.astro` components, so components use the presets above; `astro check` type-checks them.
		files: ['**/*.ts'],
		ignores: ['**/*.astro/*.ts'],
		extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
		languageOptions: {
			parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
		},
		rules: {
			// `noPropertyAccessFromIndexSignature` (tsconfig) requires `env['NAME']`.
			'@typescript-eslint/dot-notation': ['error', { allowIndexSignaturePropertyAccess: true }],
			'@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
		},
	},
	{
		files: ['src/**/*.{ts,astro}'],
		languageOptions: { globals: globals.browser },
	},
	{
		files: ['*.{js,ts}', 'src/lib/build.ts', 'tests/**/*.ts'],
		languageOptions: { globals: globals.node },
	},
]);
