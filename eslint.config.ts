import { eslintConfig } from '@kitschpatrol/eslint-config'

export default eslintConfig({
	ts: {
		overrides: {
			'jsdoc/require-description': 'off',
			'jsdoc/require-jsdoc': 'off',
			'new-cap': 'off',
		},
	},
	type: 'lib',
})
