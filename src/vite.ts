/**
 * This entry file is for Vite plugin.
 * @module
 */

import { Starter } from './index'

/**
 * Vite plugin
 * @example
 * ```ts
 * // vite.config.ts
 * import Starter from 'unplugin-apple-photos/vite'
 *
 * export default defineConfig({
 *   plugins: [Starter()],
 * })
 * ```
 */
const { vite } = Starter
export default vite
export { vite as 'module.exports' }
