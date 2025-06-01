/**
 * This entry file is for esbuild plugin.
 * @module
 */

import { Starter } from './index'

/**
 * Example esbuild plugin
 * @example
 * ```ts
 * import { build } from 'esbuild'
 * import Starter from 'unplugin-apple-photos/esbuild'
 * 
 * build({ plugins: [Starter()] })
```
 */
const { esbuild } = Starter
export default esbuild
export { esbuild as 'module.exports' }
