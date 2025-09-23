import type { ExportOptions } from '@kitschpatrol/aphex'

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {}

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
	exportOptions?: Simplify<Partial<ExportOptions['exportOptions']>> | undefined
	/**
	 * Force image re-export even if existing image in the `cacheDirectory` appears unchanged from the source in Photos.app. This will be slow!
	 * @default false
	 */
	forceExport?: boolean
	/**
	 * Additional image processing options. (Resizing, color profile enforcement, etc.)
	 * Sensible defaults provided if undefined.
	 */
	processOptions?: Simplify<Partial<ExportOptions['processOptions']>> | undefined
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
