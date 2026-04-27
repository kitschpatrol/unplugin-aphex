/**
 * This entry file is for Rollup plugin.
 *
 * @module
 */

import { createRollupPlugin } from 'unplugin'
import { unpluginFactory } from './index'

/**
 * Rollup plugin
 *
 * @example
 * 	// rollup.config.js
 * 	import Plugin from '@kitschpatrol/unplugin-aphex/rollup'
 *
 * 	export default {
 * 		plugins: [Plugin()],
 * 	}
 */
export default createRollupPlugin(unpluginFactory)
