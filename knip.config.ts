import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	ignore: ['test/fixtures/**/*.js'],
	ignoreDependencies: [
		'@kitschpatrol/aphex',
		'@nuxt/kit',
		'@nuxt/schema',
		'@sxzz/test-utils',
		'rollup',
		'tsx',
		'vite',
		'webpack',
	],
	ignoreExportsUsedInFile: true,
	ignoreUnresolved: [/^~aphex\//],
})
