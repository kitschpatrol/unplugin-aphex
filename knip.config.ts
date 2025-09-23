import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	ignore: ['tests/fixtures/basic.js'],
	ignoreDependencies: [
		'@kitschpatrol/aphex',
		'@nuxt/kit',
		'@nuxt/schema',
		'rollup',
		'tsx',
		'vite',
		'webpack',
	],
	ignoreExportsUsedInFile: true,
	ignoreUnresolved: [/^~aphex\//],
})
