import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	ignore: ['test/fixtures/**/*.js'],
	ignoreDependencies: [
		'@farmfe/core',
		'@kitschpatrol/aphex',
		'@nuxt/kit',
		'@nuxt/schema',
		'@rspack/core',
		'@sxzz/test-utils',
		'esbuild',
		'rolldown',
		'rollup',
		'tsx',
		'vite',
		'webpack',
	],
	ignoreExportsUsedInFile: true,
	ignoreUnresolved: [/^~aphex\//],
})
