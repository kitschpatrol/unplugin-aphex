/**
 * This entry file is for Vite plugin.
 * @module
 */

import { createVitePlugin } from 'unplugin'
import { unpluginFactory } from '.'

/**
 * Vite plugin
 * @example
 * ```ts
 * // vite.config.ts
 * import Plugin from 'unplugin-aphex/vite'
 *
 * export default defineConfig({
 *   plugins: [Plugin()],
 * })
 * ```
 */
export default createVitePlugin(unpluginFactory)
