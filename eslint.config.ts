import { eslintConfig } from '@kitschpatrol/eslint-config'

export default eslintConfig(
	{
		html: {
			overrides: {
				'html/no-inline-styles': 'off',
			},
		},
		ts: {
			overrides: {
				'import/no-unresolved': ['error', { ignore: ['^~aphex/'] }],
				'new-cap': 'off',
			},
		},
		type: 'lib',
	},
	{
		files: ['playground/package.json'],
		rules: {
			'json-package/require-author': 'off',
		},
	},
	{
		files: ['readme.md/*.{js,ts}'],
		rules: {
			'capitalized-comments': 'off',
			'new-cap': 'off',
			'ts/triple-slash-reference': 'off',
		},
	},
)
