import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	ignore: ['test/fixtures/**/*.js'],
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
