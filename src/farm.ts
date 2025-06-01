/**
 * This entry file is for Farm plugin.
 * @module
 */

import { Starter } from './index'

/**
 * Farm plugin
 * @example
 * ```ts
 * // farm.config.js
 * import Starter from 'unplugin-apple-photos/farm'
 *
 * export default {
 *   plugins: [Starter()],
 * }
 * ```
 */
const { farm } = Starter
export default farm
export { farm as 'module.exports' }
