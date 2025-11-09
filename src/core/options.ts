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
	 * Export options.
	 * Sensible defaults provided if undefined.
	 */
	exportOptions?: PartialDeep<ExportOptions['exportOptions']>
	/**
	 * Force image re-export even if existing image in the `cacheDirectory` appears unchanged from the source in Photos.app. This will be slow!
	 * @default false
	 */
	forceExport?: boolean
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
	// Gui export is just so slow in this context, we only
	// use it if explicitly requested by the user...
	exportOptions: {
		engineEdited: 'swift-photokit',
		engineEditedAlpha: 'swift-photokit',
		engineOriginal: 'swift-photokit',
		engineOriginalAlpha: 'swift-photokit',
		fileNameAppendUuidFragment: true,
	},
	forceExport: false,
	processOptions: undefined,
	pruneCacheOnBuild: false,
	validateMetadata: false,
	verbose: true,
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

// import type { FilterPattern } from 'unplugin-utils'

// export interface Options {
// 	enforce?: 'post' | 'pre' | undefined
// 	exclude?: FilterPattern
// 	include?: FilterPattern
// }
