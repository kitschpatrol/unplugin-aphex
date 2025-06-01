/**
 * This entry file is for webpack plugin.
 * @module
 */

import { Starter } from './index'

/**
 * Your webpack plugin
 * @example
 * ```js
 * // webpack.config.js
 * import Starter from 'unplugin-apple-photos/webpack'
 *
 * default export {
 *  plugins: [Starter()],
 * }
 * ```
 */
const { webpack } = Starter
export default webpack
export { webpack as 'module.exports' }
