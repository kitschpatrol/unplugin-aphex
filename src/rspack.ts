/**
 * This entry file is for Rspack plugin.
 * @module
 */

import { createRspackPlugin } from 'unplugin'
import { unpluginFactory } from './index'

/**
 * Rspack plugin
 * @example
 * ```js
 * // rspack.config.js
 * import Plugin from 'unplugin-aphex/rspack'
 *
 * export default {
 *   plugins: [Plugin()],
 * }
 * ```
 */
export default createRspackPlugin(unpluginFactory)
