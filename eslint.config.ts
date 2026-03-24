import { eslintConfig } from '@kitschpatrol/eslint-config'

export default eslintConfig(
	{
		html: {
			overrides: {
				'html/no-inline-styles': 'off',
			},
		},
		js: {
			overrides: {
				'new-cap': 'off',
			},
		},
		ts: {
			overrides: {
				'import/no-unresolved': ['error', { ignore: ['^~aphex/', 'esbuild'] }],
				'jsdoc/require-jsdoc': 'off',
				'new-cap': 'off',
			},
		},
		type: 'lib',
	},
	{
		files: ['playground/package.json'],
		rules: {
			'json-package/require-author': 'off',
			'json-package/require-keywords': 'off',
			'json-package/require-version': 'off',
		},
	},
	{
		files: ['ext.d.ts'],
		rules: {
			'unicorn/prevent-abbreviations': 'off',
		},
	},
	{
		files: ['readme.md/*.ts'],
		rules: {
			// 'import/no-unresolved': 'off',
			'ts/triple-slash-reference': 'off',
		},
	},
)
