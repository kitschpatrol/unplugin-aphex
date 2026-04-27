/**
 * This entry file is for esbuild plugin.
 *
 * @module
 */

import { createEsbuildPlugin } from 'unplugin'
import { unpluginFactory } from './index'

// @case-police-ignore esbuild

/**
 * Esbuild plugin
 *
 * @example
 * 	import { build } from 'esbuild'
 * 	import Plugin from '@kitschpatrol/unplugin-aphex/esbuild'
 *
 * 	build({ plugins: [Plugin()] })
 */
export default createEsbuildPlugin(unpluginFactory)
