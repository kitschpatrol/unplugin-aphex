/**
 * This entry file is for Vite plugin.
 *
 * @module
 */

import { createVitePlugin } from 'unplugin'
import { unpluginFactory } from './index'

/**
 * Vite plugin
 *
 * @example
 * 	// vite.config.ts
 * 	import Plugin from '@kitschpatrol/unplugin-aphex/vite'
 *
 * 	export default defineConfig({
 * 		plugins: [Plugin()],
 * 	})
 */
const plugin = /* #__PURE__ */ createVitePlugin(unpluginFactory)

export default plugin
