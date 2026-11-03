// @ts-check
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
	includeIgnoreFile(`${import.meta.dirname}/.gitignore`),
	js.configs.recommended,
	tseslint.configs.strict,
	tseslint.configs.stylistic,
	astro.configs.recommended,
	astro.configs['jsx-a11y-strict'],
	{
		rules: {
			'@typescript-eslint/consistent-type-imports': 'error',
			// `consistent-type-imports` also accepts inline `type` specifiers; the convention is a
			// separate `import type` statement.
			'no-restricted-syntax': [
				'error',
				{
					selector: "ImportSpecifier[importKind='type']",
					message: 'Import types with a separate `import type` statement.',
				},
			],
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
			'@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
		},
	},
]);
