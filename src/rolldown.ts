/**
 * This entry file is for Rolldown plugin.
 * @module
 */

import { createRolldownPlugin } from 'unplugin'
import { unpluginFactory } from './index'

/**
 * Rolldown plugin
 * @example
 * ```ts
 * // rolldown.config.js
 * import Plugin from 'unplugin-aphex/rolldown'
 *
 * export default {
 *   plugins: [Plugin()],
 * }
 * ```
 */
export default createRolldownPlugin(unpluginFactory)
