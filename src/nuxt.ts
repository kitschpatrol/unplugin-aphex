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
		configKey: 'unpluginApplePhotos',
		name: 'nuxt-unplugin-apple-photos',
	},
	setup(options, _nuxt) {
		addVitePlugin(() => vite(options))
		addWebpackPlugin(() => webpack(options))

		// ...
	},
})
