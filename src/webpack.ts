/**
 * This entry file is for webpack plugin.
 * @module
 */

import { createWebpackPlugin } from 'unplugin'
import { unpluginFactory } from './index'

// @case-police-ignore webpack

/**
 * Webpack plugin
 * @example
 * ```js
 * // webpack.config.js
 * import Plugin from 'unplugin-aphex/webpack'
 *
 * export default {
 *   plugins: [Plugin()],
 * }
 * ```
 */
export default createWebpackPlugin(unpluginFactory)
