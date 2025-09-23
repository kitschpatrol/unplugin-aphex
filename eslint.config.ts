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
				// TODO decide on a prefix...
				'import/no-unresolved': [
					'error',
					{ ignore: ['^~photos/', '^~aphex/', '^photos://', '^virtual:'] },
				],
				'jsdoc/require-description': 'off',
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
			'json-package/require-description': 'off',
			'json-package/require-keywords': 'off',
			'json-package/require-name': 'off',
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
