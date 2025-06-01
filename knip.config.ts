import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	ignore: ['tests/fixtures/basic.js'],
	ignoreDependencies: ['@nuxt/kit', '@nuxt/schema', 'rollup', 'vite', 'webpack', 'tsx'],
})
