/**
 * This entry file is for Nuxt module.
 *
 * @module
 */

import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import type { Options } from './core/options'
import vite from './vite'
import webpack from './webpack'

/**
 * Nuxt module
 *
 * @example
 * 	// nuxt.config.ts
 * 	export default defineNuxtConfig({
 * 		modules: ['@kitschpatrol/unplugin-aphex/nuxt'],
 * 	})
 */
export default defineNuxtModule<Options>({
	meta: {
		configKey: 'aphex',
		name: '@kitschpatrol/unplugin-aphex',
	},
	setup(options) {
		addVitePlugin(() => vite(options))
		addWebpackPlugin(() => webpack(options))
	},
})
