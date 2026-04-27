import type { ImageMimeType, ExportOptions as ResolvedAphexOptions } from '@kitschpatrol/aphex'
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
	format: ImageMimeType
	height: number
	src: string
	width: number
}

type PersistentCacheEntry = {
	result: AphexImageResultMetadata | string
}

type PersistentCache = Record<string, PersistentCacheEntry>

const CACHE_FILE_NAME = '.aphex-plugin-cache.json'
const IDENTIFIER_REGEX = /^~aphex\/.+/
const CLEAN_IDENTIFIER_REGEX = /^~aphex\/+/

export class AphexExport {
	/** Regular expression matching the `~aphex/...` identifier prefix. */
	public get identifierPattern(): RegExp {
		return IDENTIFIER_REGEX
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

	// Whether the host can run the underlying Photos.app export pipeline.
	// On unsupported platforms the plugin still serves pre-resolved cache entries.
	private readonly platformSupported: boolean

	private readonly pluginOptions: ResolvedPluginOptions

	// Result cache: prevents re-processing already completed requests (in-memory + persisted)
	private readonly resolvedCache = new Map<string, AphexImageResultMetadata | string>()

	// In-flight request timing: tracks how long each request takes
	private readonly startTimesByIdentifier = new Map<string, number>()

	private get cacheFilePath(): string {
		return path.join(this.pluginOptions.cacheDirectory, CACHE_FILE_NAME)
	}

	constructor(options?: Options) {
		this.platformSupported = process.platform === 'darwin' && process.arch === 'arm64'

		this.pluginOptions = resolveOptions(options)
		this.exportLimit = pLimit(this.pluginOptions.maxConcurrentExports)

		this.aphexOptions = mergeDefaultExportOptions({
			exportOptions: this.pluginOptions.exportOptions,
			processOptions: this.pluginOptions.processOptions,
		})

		// Apply proxied options...
		assertEnabled(this.aphexOptions.metadataOptions, 'metadataOptions')
		this.aphexOptions.metadataOptions.validate = this.pluginOptions.validateMetadata

		assertEnabled(this.aphexOptions.syncOptions, 'syncOptions')
		this.aphexOptions.syncOptions.deleteOthers = false // Always disable, dangerous
		this.aphexOptions.syncOptions.forceUpdate = this.pluginOptions.cacheMode === 'disabled'

		setDefaultLogOptions({
			name: 'unplugin-aphex',
			verbose: this.pluginOptions.verbose,
		})

		const aphexLogger = getChildLogger(log, 'aphex')

		// Use the lognow logger for the aphex library
		setLogger(aphexLogger)

		if (!this.platformSupported) {
			log.warn(
				`Running on ${process.platform}/${process.arch}; Photos.app export is unavailable. Only previously-cached entries in "${this.pluginOptions.cacheDirectory}" will resolve.`,
			)
		}
	}

	/**
	 * Tear down long-lived resources (interactive Photos.app session or
	 * exiftool subprocess). Safe to call multiple times.
	 */
	public async close(): Promise<void> {
		if (!this.platformSupported) {
			return
		}

		if (this.pluginOptions.interactiveSession) {
			log.debug('Closing session...')
			await interactiveSessionStop()
		} else {
			await endExiftool()
		}
	}

	/**
	 * Resolve a `~aphex/...` identifier to either a relative cache path or a
	 * metadata object (per `returnMetadata`). Concurrent duplicate calls are
	 * deduplicated; throughput is capped by `maxConcurrentExports`.
	 */
	public async exportPhoto(identifier: string): Promise<AphexImageResultMetadata | string> {
		// On unsupported platforms we can't talk to Photos.app, so always try
		// the cache first regardless of mode and refuse on a miss.
		// Aggressive mode also short-circuits on cache hits for performance.
		if (!this.platformSupported || this.pluginOptions.cacheMode === 'aggressive') {
			const cached = this.resolvedCache.get(identifier)
			if (cached !== undefined) {
				const cachedPath = typeof cached === 'string' ? cached : cached.src
				const absoluteCachedPath = this.resolveFromCache(cachedPath)
				if (await this.fileExists(absoluteCachedPath)) {
					log.debug(`Cache hit for "${identifier}"`)

					if (this.pluginOptions.pruneCacheOnBuild) {
						this.pathsSeen.add(absoluteCachedPath)
					}

					return cached
				}

				// Cached file no longer exists, remove stale entry
				this.resolvedCache.delete(identifier)
				this.persistentCacheDirty = true
			}

			if (!this.platformSupported) {
				throw new Error(
					`unplugin-aphex: "${identifier}" is not in the cache, and exporting from Photos.app requires macOS on Apple Silicon (got ${process.platform}/${process.arch}). Run a build on a supported host to populate "${this.pluginOptions.cacheDirectory}" first.`,
				)
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

	/**
	 * Look up an already-resolved result without triggering an export. Returns
	 * `undefined` if the identifier hasn't been processed yet in this session.
	 */
	public getCachedResult(identifier: string): AphexImageResultMetadata | string | undefined {
		return this.resolvedCache.get(identifier)
	}

	/**
	 * Prepare the export pipeline: ensure the cache directory exists and load
	 * any persisted cache entries from previous runs. Must be awaited before
	 * the first `exportPhoto` call.
	 */
	public async initialize(): Promise<void> {
		if (this.platformSupported && this.pluginOptions.interactiveSession) {
			log.debug('Initializing interactive session...')
			await interactiveSessionStart()
		}

		await fs.mkdir(this.pluginOptions.cacheDirectory, { recursive: true })

		// Load persistent cache from disk
		await this.loadPersistentCache()
		log.debug(`Initialized with cache at "${this.pluginOptions.cacheDirectory}"`)
	}

	/** Type-narrowing check for whether a value is a `~aphex/...` identifier. */
	public isIdentifier(identifier: unknown): boolean {
		return typeof identifier === 'string' && this.identifierPattern.test(identifier)
	}

	/**
	 * Delete files in the cache directory that weren't referenced this
	 * session. No-op unless `pruneCacheOnBuild` is enabled. Should only be
	 * called when `pathsSeen` is known to be complete (i.e. after a full
	 * production build, not a dev session).
	 */
	public async pruneCache(): Promise<void> {
		if (this.pluginOptions.pruneCacheOnBuild) {
			const destinationFiles = await fs.readdir(this.pluginOptions.cacheDirectory, {})
			const fileNamesToKeep = new Set(
				Array.from(this.pathsSeen, (filePath) => path.basename(filePath)),
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

	/** Resolve a cache-relative path to an absolute filesystem path. */
	public resolveFromCache(relativePath: string): string {
		return path.resolve(this.pluginOptions.cacheDirectory, relativePath)
	}

	/**
	 * Persist the in-memory cache to disk. Call this after builds or periodically
	 * during dev.
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

		const cleanIdentifier = identifier.replace(CLEAN_IDENTIFIER_REGEX, '')

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
				log.debug(`Resolved "${identifier}" to "${result.path}" (timing unavailable)`)
			} else {
				const endTime = performance.now()
				const duration = ((endTime - startTime) / 1000).toFixed(2)
				log.debug(`Resolved "${identifier}" to "${result.path}" in ${duration}s`)
			}
		}

		this.startTimesByIdentifier.delete(identifier)

		const relativePath = path.relative(this.pluginOptions.cacheDirectory, result.path)

		if (this.pluginOptions.returnMetadata) {
			const processedOutput = result.results.processResult?.output
			const format =
				processedOutput?.mime ??
				// eslint-disable-next-line ts/no-unsafe-type-assertion
				(path.extname(result.path).toLowerCase().slice(1) as ImageMimeType)
			const height =
				processedOutput?.dimensionsPixels.height ??
				result.photoInfo.edited?.height ??
				result.photoInfo.original.height
			const width =
				processedOutput?.dimensionsPixels.width ??
				result.photoInfo.edited?.width ??
				result.photoInfo.original.width

			return {
				format,
				height,
				src: relativePath,
				width,
			}
		}

		return relativePath
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
		let cacheContent: string
		try {
			cacheContent = await fs.readFile(this.cacheFilePath, 'utf8')
		} catch (error) {
			if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
				// First run on this cache directory; nothing to load
				return
			}

			log.warn(
				`Failed to read persistent cache at "${this.cacheFilePath}", starting fresh: ${error instanceof Error ? error.message : String(error)}`,
			)
			return
		}

		let cache: PersistentCache
		try {
			// eslint-disable-next-line ts/no-unsafe-type-assertion
			cache = JSON.parse(cacheContent) as PersistentCache
		} catch (error) {
			log.warn(
				`Persistent cache at "${this.cacheFilePath}" is malformed and will be rewritten: ${error instanceof Error ? error.message : String(error)}`,
			)
			this.persistentCacheDirty = true
			return
		}

		let validEntries = 0
		let staleEntries = 0

		for (const [identifier, entry] of Object.entries(cache)) {
			const cachedPath = typeof entry.result === 'string' ? entry.result : entry.result.src

			// Only load entries whose files actually exist on disk
			if (await this.fileExists(this.resolveFromCache(cachedPath))) {
				this.resolvedCache.set(identifier, entry.result)
				validEntries++
			} else {
				// Mark cache as dirty so stale entries are removed on save
				this.persistentCacheDirty = true
				staleEntries++
			}
		}

		if (staleEntries > 0) {
			log.debug(`Removed ${staleEntries} stale entries from cache (files no longer exist on disk)`)
		}

		log.debug(`Registered ${validEntries} entries from persistent cache`)
	}
}

function assertEnabled<T>(option: T, optionName: string): asserts option is Exclude<T, 'disabled'> {
	if (option === 'disabled') {
		throw new Error(
			`unplugin-aphex requires \`${optionName}\` to be enabled; set \`exportOptions.${optionName}\` to a configuration object instead of 'disabled'.`,
		)
	}
}
