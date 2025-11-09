/**
 * This entry file is for Rollup plugin.
 * @module
 */

import { createRollupPlugin } from 'unplugin'
import { unpluginFactory } from '.'

/**
 * Rollup plugin
 * @example
 * ```ts
 * // rollup.config.js
 * import Plugin from 'unplugin-aphex/rollup'
 *
 * export default {
 *   plugins: [Plugin()],
 * }
 * ```
 */
export default createRollupPlugin(unpluginFactory)
