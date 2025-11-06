import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import type { Options } from './types'
import vite from './vite'
import webpack from './webpack'

export type ModuleOptions = Options & {}

export default defineNuxtModule<ModuleOptions>({
	defaults: {
		// ...default options
	},
	meta: {
		configKey: 'unpluginAphex',
		name: 'nuxt-unplugin-aphex',
	},
	setup(options, _) {
		addVitePlugin(() => vite(options))
		addWebpackPlugin(() => webpack(options))

		// ...
	},
})
