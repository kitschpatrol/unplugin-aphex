import type { ExportOptions } from 'aphex'

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {}

export type Options = {
	/**
	 * Delete all files in the destination directory that are not in the exported
	 * image set at the end of a full build.
	 * @default false
	 */
	cleanDestinationOnBuild?: boolean
	/**
	 * Folder to store images exported from Photos.app.
	 * @default './.aphex-cache'
	 */
	destinationDirectory?: string
	/**
	 * Export options. Sensible defaults provided if undefined
	 * @default undefined
	 */
	exportOptions?: Simplify<Partial<ExportOptions['exportOptions']>> | undefined
	/**
	 * Force image re-export even if existing image in the `destinationDirectory` appears unchanged from the source in Photos.app. This will be slow!
	 * @default false
	 */
	forceExport?: boolean
	/**
	 * Additional image processing options. (Resizing, color profile enforcement, etc.) Sensible defaults provided if undefined.
	 * @default 'undefined'
	 */
	processOptions?: Simplify<Partial<ExportOptions['processOptions']>> | undefined
	/**
	 * Require certain metadata fields to be present in the source files.
	 * @default false
	 */
	validateMetadata?: boolean
	/**
	 * Log actions and performance information.
	 * @default false
	 */
	verbose?: boolean
}
