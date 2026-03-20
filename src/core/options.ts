import type { ExportOptions } from '@kitschpatrol/aphex'
import type { Merge, PartialDeep, Simplify } from 'type-fest'
import { defu } from 'defu'
import { normalizePath } from 'unplugin-utils'

export type Options = {
	/**
	 * Directory to store images exported from Photos.app.
	 * @default './node_modules/.cache/aphex'
	 */
	cacheDirectory?: string
	/**
	 * Cache mode to use for the plugin.
	 * - 'disabled': Never cache any images. Force image re-export even if there's an existing image in the `cacheDirectory` appears unchanged from the source in Photos.app. This will be slow!
	 * - 'enabled': Use the cached image, but check for changes in Photos.app.
	 * - 'aggressive': Use the first cached image forever (Fastest, may be outdated, suitable for development.)
	 * @default 'enabled'
	 */
	cacheMode?: 'aggressive' | 'disabled' | 'enabled'
	/**
	 * Export options.
	 * Sensible defaults provided if undefined.
	 */
	exportOptions?: PartialDeep<ExportOptions['exportOptions']>
	/**
	 * Experimental mode persists a single aphex-swift session for all requests, which can improve performance.
	 * @default false
	 */
	interactiveSession?: boolean
	/**
	 * Maximum number of concurrent image exports.
	 * Lower values reduce load on Photos.app and system resources.
	 * @default 4
	 */
	maxConcurrentExports?: number
	/**
	 * Additional image processing options. (Resizing, color profile enforcement, etc.)
	 * Sensible defaults provided if undefined.
	 */
	processOptions?: PartialDeep<ExportOptions['processOptions']>
	/**
	 * Delete all files in `cacheDirectory` that are not in the exported
	 * image set at the end of a full build.
	 * @default false
	 */
	pruneCacheOnBuild?: boolean
	/**
	 * Returns an object with some extra details on the image instead of a plain path string. Occasionally useful for integration with other platforms.
	 * @default false
	 */
	returnMetadata?: boolean
	/**
	 * Require certain metadata fields to be present in the source files.
	 * This is highly opinionated and not currently configurable.
	 * @default false
	 */
	validateMetadata?: boolean
	/**
	 * Log actions and performance information to the console.
	 * @default false
	 */
	verbose?: boolean
}

export type ResolvedOptions = Simplify<
	Merge<
		Required<Options>,
		{
			exportOptions?: PartialDeep<ExportOptions['exportOptions']>
			processOptions?: PartialDeep<ExportOptions['processOptions']>
		}
	>
>

export const DEFAULT_OPTIONS: ResolvedOptions = {
	cacheDirectory: './node_modules/.cache/aphex',
	cacheMode: 'enabled',
	// GUI export is just so slow in this context, we only
	// use it if explicitly requested by the user...
	exportOptions: {
		engineEdited: 'swift-photokit',
		engineEditedAlpha: 'swift-photokit',
		engineOriginal: 'swift-photokit',
		engineOriginalAlpha: 'swift-photokit',
		fileNameAppendUuidFragment: true,
	},
	interactiveSession: false,
	maxConcurrentExports: 4,
	processOptions: undefined,
	pruneCacheOnBuild: false,
	returnMetadata: false,
	validateMetadata: false,
	verbose: false,
}

/**
 * Resolve and normalize user options.
 */
export function resolveOptions(options?: Options): ResolvedOptions {
	const resolved = defu(options, DEFAULT_OPTIONS)
	resolved.cacheDirectory = normalizePath(resolved.cacheDirectory)
	// eslint-disable-next-line ts/no-unsafe-type-assertion
	return resolved as ResolvedOptions
}
