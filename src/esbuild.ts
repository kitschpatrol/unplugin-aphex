/**
 * This entry file is for esbuild plugin.
 * @module
 */

import { createEsbuildPlugin } from 'unplugin'
import { unpluginFactory } from './index'

// @case-police-ignore esbuild

/**
 * esbuild plugin
 * @example
 * ```ts
 * import { build } from 'esbuild'
 * import Plugin from 'unplugin-aphex/esbuild'
 * 
 * build({ plugins: [Plugin()] })
```
 */
export default createEsbuildPlugin(unpluginFactory)
