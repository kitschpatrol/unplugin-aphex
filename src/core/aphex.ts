import type { ExportOptions as ResolvedAphexOptions } from '@kitschpatrol/aphex'
import { exportPhoto, mergeDefaultExportOptions } from '@kitschpatrol/aphex'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { Options, ResolvedOptions as ResolvedPluginOptions } from './options'
import { resolveOptions } from './options'

export type AphexImageResultMetadata = {
	format: string
	height: number
	src: string
	width: number
}

export class AphexExport {
	public get identifierPattern(): RegExp {
		return /^~(?:photos|aphex)\/.+/
	}

	private readonly aphexOptions: ResolvedAphexOptions

	// Just for cleanup, aphex does its own cache monitoring / difference detection
	private readonly pathsSeen: Set<string> = new Set<string>()

	private readonly pluginOptions: ResolvedPluginOptions

	constructor(options?: Options) {
		this.pluginOptions = resolveOptions(options)

		this.aphexOptions = mergeDefaultExportOptions({
			exportOptions: this.pluginOptions.exportOptions ?? undefined,
			processOptions: this.pluginOptions.processOptions ?? undefined,
		})

		// Apply proxied options...
		assertEnabled(this.aphexOptions.metadataOptions)
		this.aphexOptions.metadataOptions.validate = this.pluginOptions.validateMetadata

		assertEnabled(this.aphexOptions.syncOptions)
		this.aphexOptions.syncOptions.deleteOthers = false // Always disable, dangerous
		this.aphexOptions.syncOptions.forceUpdate = this.pluginOptions.forceExport
	}

	public async exportPhoto(identifier: string): Promise<AphexImageResultMetadata | string> {
		const startTime = performance.now()

		const cleanIdentifier = identifier.replace(/^~(?:photos|aphex)\/+/, '')

		const result = await exportPhoto(
			cleanIdentifier,
			this.pluginOptions.cacheDirectory,
			this.aphexOptions,
		)

		// TODO verbose...
		// console.log('----------------------------------')
		// console.log(result)

		if (this.pluginOptions.pruneCacheOnBuild) {
			this.pathsSeen.add(result.path)
		}

		if (this.pluginOptions.verbose) {
			const endTime = performance.now()
			const duration = ((endTime - startTime) / 1000).toFixed(2)
			console.log(`Aphex resolved "${identifier}" to "${result.path}" in ${duration}s`)
		}

		if (this.pluginOptions.returnMetadata) {
			return {
				format: path.extname(result.path).toLowerCase(),
				height: result.photoInfo.edited?.height ?? result.photoInfo.original.height,
				src: result.path,
				width: result.photoInfo.edited?.width ?? result.photoInfo.original.width,
			}
		}

		return result.path
	}

	public getAllExportedPaths(): Set<string> {
		return this.pathsSeen
	}

	public getAssetFileName(photoPath: string): string {
		return path.basename(photoPath)
	}

	public async initialize(): Promise<void> {
		await fs.mkdir(this.pluginOptions.cacheDirectory, { recursive: true })

		if (this.pluginOptions.verbose) {
			console.log(`Aphex plugin initialized with cache at "${this.pluginOptions.cacheDirectory}"`)
		}
	}

	public isIdentifier(identifier: unknown): boolean {
		return typeof identifier === 'string' && this.identifierPattern.test(identifier)
	}

	public async pruneCache(): Promise<void> {
		if (this.pluginOptions.pruneCacheOnBuild) {
			const destinationFiles = await fs.readdir(this.pluginOptions.cacheDirectory, {})
			const fileNamesToKeep = new Set(
				[...this.pathsSeen].map((filePath) => path.basename(filePath)),
			)

			for (const destinationFile of destinationFiles) {
				if (!fileNamesToKeep.has(destinationFile)) {
					if (this.pluginOptions.verbose) {
						console.log(`Cleaning up unused Aphex image: ${destinationFile}`)
					}
					await fs.rm(path.join(this.pluginOptions.cacheDirectory, destinationFile))
				}
			}
		} else if (this.pluginOptions.verbose) {
			console.log('Skipping cache pruning because pruneCacheOnBuild is disabled')
		}
	}

	public async readPhotoContent(photoPath: string): Promise<Uint8Array> {
		return fs.readFile(photoPath)
	}
}

function assertEnabled<T>(option: T): asserts option is Exclude<T, 'disabled'> {
	if (option === 'disabled') {
		throw new Error('Bad Aphex default: disabled')
	}
}
