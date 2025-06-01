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
)
