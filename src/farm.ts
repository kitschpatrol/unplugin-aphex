/**
 * This entry file is for Farm plugin.
 *
 * @module
 */

import { createFarmPlugin } from 'unplugin'
import { unpluginFactory } from './index'

/**
 * Farm plugin
 *
 * @example
 * 	// farm.config.js
 * 	import Plugin from '@kitschpatrol/unplugin-aphex/farm'
 *
 * 	export default {
 * 		plugins: [Plugin()],
 * 	}
 */
const plugin = /* #__PURE__ */ createFarmPlugin(unpluginFactory)

export default plugin
