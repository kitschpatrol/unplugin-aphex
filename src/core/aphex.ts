import type { ExportOptions as ResolvedAphexOptions } from '@kitschpatrol/aphex'
import {
	endExiftool,
	exportPhoto,
	interactiveSessionStart,
	interactiveSessionStop,
	mergeDefaultExportOptions,
	setLogger,
} from '@kitschpatrol/aphex'
import { getChildLogger, log, setDefaultLogOptions } from 'lognow'
import fs from 'node:fs/promises'
import path from 'node:path'
import pLimit from 'p-limit'
import type { Options, ResolvedOptions as ResolvedPluginOptions } from './options'
import { resolveOptions } from './options'

export type AphexImageResultMetadata = {
	format: string
	height: number
	src: string
	width: number
}

type PersistentCacheEntry = {
	result: AphexImageResultMetadata | string
}

type PersistentCache = Record<string, PersistentCacheEntry>

const CACHE_FILE_NAME = '.aphex-plugin-cache.json'

export class AphexExport {
	public get identifierPattern(): RegExp {
		return /^~aphex\/.+/
	}

	private readonly aphexOptions: ResolvedAphexOptions

	// Concurrency limiter for exports
	private readonly exportLimit: ReturnType<typeof pLimit>

	// Just for cleanup, aphex does its own cache monitoring / difference detection
	private readonly pathsSeen: Set<string> = new Set<string>()

	// In-flight request deduplication: prevents concurrent duplicate calls to aphex library
	private readonly pendingRequests = new Map<string, Promise<AphexImageResultMetadata | string>>()

	// Dirty flag for batched cache writes
	private persistentCacheDirty = false

	private readonly pluginOptions: ResolvedPluginOptions

	// Result cache: prevents re-processing already completed requests (in-memory + persisted)
	private readonly resolvedCache = new Map<string, AphexImageResultMetadata | string>()

	// In-flight request timing: tracks how long each request takes
	private readonly startTimesByIdentifier = new Map<string, number>()

	private get cacheFilePath(): string {
		return path.join(this.pluginOptions.cacheDirectory, CACHE_FILE_NAME)
	}

	constructor(options?: Options) {
		this.pluginOptions = resolveOptions(options)
		this.exportLimit = pLimit(this.pluginOptions.maxConcurrentExports)

		this.aphexOptions = mergeDefaultExportOptions({
			exportOptions: this.pluginOptions.exportOptions ?? undefined,
			processOptions: this.pluginOptions.processOptions ?? undefined,
		})

		// Apply proxied options...
		assertEnabled(this.aphexOptions.metadataOptions)
		this.aphexOptions.metadataOptions.validate = this.pluginOptions.validateMetadata

		assertEnabled(this.aphexOptions.syncOptions)
		this.aphexOptions.syncOptions.deleteOthers = false // Always disable, dangerous
		this.aphexOptions.syncOptions.forceUpdate = this.pluginOptions.cacheMode === 'disabled'

		setDefaultLogOptions({
			name: 'unplugin-aphex',
			verbose: this.pluginOptions.verbose,
		})

		const aphexLogger = getChildLogger(log, 'aphex')

		// Use the lognow logger for the aphex library
		setLogger(aphexLogger)
	}

	public async close(): Promise<void> {
		if (this.pluginOptions.interactiveSession) {
			log.debug('Closing session...')
			await interactiveSessionStop()
		} else {
			// Log.debug('Cleaning up exiftool...')
			await endExiftool()
		}
	}

	public async exportPhoto(identifier: string): Promise<AphexImageResultMetadata | string> {
		// Only use cache lookup in 'aggressive' mode (fastest, may be outdated)
		// 'enabled' and 'disabled' modes skip cache lookup to let aphex library validate
		if (this.pluginOptions.cacheMode === 'aggressive') {
			const cached = this.resolvedCache.get(identifier)
			if (cached !== undefined) {
				const cachedPath = typeof cached === 'string' ? cached : cached.src
				if (await this.fileExists(cachedPath)) {
					log.debug(`Cache hit for "${identifier}"`)

					if (this.pluginOptions.pruneCacheOnBuild) {
						this.pathsSeen.add(cachedPath)
					}

					return cached
				}

				// Cached file no longer exists, remove stale entry
				this.resolvedCache.delete(identifier)
				this.persistentCacheDirty = true
			}
		}

		// If already processing this identifier, wait for the existing promise (deduplication)
		const pending = this.pendingRequests.get(identifier)
		if (pending !== undefined) {
			log.debug(`Waiting for in-flight request for "${identifier}"`)
			return pending
		}

		// Create the export promise and store it for deduplication
		// Wrap with limiter to throttle concurrent exports
		const exportPromise = this.exportLimit(async () => this.doExport(identifier))
		this.pendingRequests.set(identifier, exportPromise)

		try {
			const result = await exportPromise
			// Always cache the result (all modes write to cache, only 'aggressive' reads from it)
			this.resolvedCache.set(identifier, result)
			this.persistentCacheDirty = true
			// Save immediately since exports are infrequent and expensive
			await this.savePersistentCache()
			return result
		} finally {
			// Clean up pending request (whether success or failure)
			this.pendingRequests.delete(identifier)
		}
	}

	public getAllExportedPaths(): Set<string> {
		return this.pathsSeen
	}

	public getAssetFileName(photoPath: string): string {
		return path.basename(photoPath)
	}

	public async initialize(): Promise<void> {
		if (this.pluginOptions.interactiveSession) {
			log.debug('Initializing interactive session...')
			await interactiveSessionStart()
		}

		await fs.mkdir(this.pluginOptions.cacheDirectory, { recursive: true })

		// Load persistent cache from disk
		await this.loadPersistentCache()
		log.debug(`Initialized with cache at "${this.pluginOptions.cacheDirectory}"`)
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
				// Never delete the persistent cache file
				if (destinationFile === CACHE_FILE_NAME) {
					continue
				}

				if (!fileNamesToKeep.has(destinationFile)) {
					log.debug(`Cleaning up unused image: ${destinationFile}`)
					await fs.rm(path.join(this.pluginOptions.cacheDirectory, destinationFile))
				}
			}
		} else {
			log.debug('Skipping cache pruning because pruneCacheOnBuild is disabled')
		}
	}

	public async readPhotoContent(photoPath: string): Promise<Uint8Array> {
		return fs.readFile(photoPath)
	}

	/**
	 * Persist the in-memory cache to disk. Call this after builds or periodically during dev.
	 */
	public async savePersistentCache(): Promise<void> {
		if (!this.persistentCacheDirty) {
			return
		}

		const cache: PersistentCache = {}
		for (const [identifier, result] of this.resolvedCache.entries()) {
			cache[identifier] = { result }
		}

		await fs.writeFile(this.cacheFilePath, JSON.stringify(cache, undefined, 2))
		this.persistentCacheDirty = false

		log.debug(`Saved ${this.resolvedCache.size} entries to persistent cache`)
	}

	private async doExport(identifier: string): Promise<AphexImageResultMetadata | string> {
		this.startTimesByIdentifier.set(identifier, performance.now())

		const cleanIdentifier = identifier.replace(/^~aphex\/+/, '')

		const result = await exportPhoto(
			cleanIdentifier,
			this.pluginOptions.cacheDirectory,
			this.aphexOptions,
		)

		if (this.pluginOptions.pruneCacheOnBuild) {
			this.pathsSeen.add(result.path)
		}

		if (this.pluginOptions.verbose) {
			const startTime = this.startTimesByIdentifier.get(identifier)
			if (startTime === undefined) {
				throw new Error(`Start time not found for identifier "${identifier}"`)
			}

			const endTime = performance.now()
			const duration = ((endTime - startTime) / 1000).toFixed(2)
			log.debug(`Resolved "${identifier}" to "${result.path}" in ${duration}s`)
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

	private async fileExists(filePath: string): Promise<boolean> {
		try {
			await fs.access(filePath)
			return true
		} catch {
			return false
		}
	}

	private async loadPersistentCache(): Promise<void> {
		try {
			const cacheContent = await fs.readFile(this.cacheFilePath, 'utf8')
			// eslint-disable-next-line ts/no-unsafe-type-assertion
			const cache = JSON.parse(cacheContent) as PersistentCache

			let validEntries = 0
			let staleEntries = 0

			for (const [identifier, entry] of Object.entries(cache)) {
				const cachedPath = typeof entry.result === 'string' ? entry.result : entry.result.src

				// Only load entries whose files actually exist on disk
				if (await this.fileExists(cachedPath)) {
					this.resolvedCache.set(identifier, entry.result)
					validEntries++
				} else {
					// Mark cache as dirty so stale entries are removed on save
					this.persistentCacheDirty = true
					staleEntries++
				}
			}

			if (staleEntries > 0) {
				log.debug(
					`Removed ${staleEntries} stale entries from cache (files no longer exist on disk)`,
				)
			}

			log.debug(`Registered ${validEntries} entries from persistent cache`)
		} catch {
			// Cache file doesn't exist or is invalid, start fresh
		}
	}
}

function assertEnabled<T>(option: T): asserts option is Exclude<T, 'disabled'> {
	if (option === 'disabled') {
		throw new Error('Bad Aphex default: disabled')
	}
}
