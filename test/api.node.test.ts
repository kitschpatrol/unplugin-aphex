import { endExiftool } from '@kitschpatrol/aphex'
import fs from 'node:fs'
import path from 'node:path'
import { afterAll, afterEach, describe, expect, it } from 'vitest'
import { AphexExport } from '../src/api'

const cacheDirectories: string[] = []

function createAphex(
	options: ConstructorParameters<typeof AphexExport>[0] & { cacheDirectory: string },
) {
	cacheDirectories.push(options.cacheDirectory)
	return new AphexExport(options)
}

afterEach(() => {
	for (const directory of cacheDirectories) {
		fs.rmSync(directory, { force: true, recursive: true })
	}

	cacheDirectories.length = 0
})

// Only shut down exiftool once after all tests
afterAll(async () => {
	await endExiftool()
})

const identifier = '~aphex/Tiny/tiny'

describe('isIdentifier', () => {
	const aphex = new AphexExport()

	it('accepts ~aphex/ prefix', () => {
		expect(aphex.isIdentifier('~aphex/Album/photo')).toBe(true)
	})

	it('rejects ~photos/ prefix', () => {
		expect(aphex.isIdentifier('~photos/Album/photo')).toBe(false)
	})

	it('rejects plain strings', () => {
		expect(aphex.isIdentifier('not-an-aphex-identifier')).toBe(false)
	})

	it('rejects non-string types', () => {
		expect(aphex.isIdentifier(42)).toBe(false)
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(aphex.isIdentifier(undefined)).toBe(false)
		// eslint-disable-next-line unicorn/no-null
		expect(aphex.isIdentifier(null)).toBe(false)
	})

	it('rejects bare prefix without path', () => {
		expect(aphex.isIdentifier('~aphex/')).toBe(false)
	})
})

describe('exportPhoto', () => {
	it('returns a string path by default', async () => {
		const aphex = createAphex({
			cacheDirectory: './node_modules/.cache/aphex-test-export',
			verbose: true,
		})
		await aphex.initialize()
		const result = await aphex.exportPhoto(identifier)
		expect(typeof result).toBe('string')
		expect(result).toContain('node_modules/.cache/aphex-test-export/tiny')
	})

	it('returns metadata object when returnMetadata is true', async () => {
		const aphex = createAphex({
			cacheDirectory: './node_modules/.cache/aphex-test-metadata',
			returnMetadata: true,
			verbose: true,
		})
		await aphex.initialize()
		const result = await aphex.exportPhoto(identifier)
		expect(result).toMatchInlineSnapshot(`
			{
			  "format": "png",
			  "height": 1080,
			  "src": "node_modules/.cache/aphex-test-metadata/tiny-294e4ad3.png",
			  "width": 1620,
			}
		`)
	})
})

describe('request deduplication', () => {
	it('returns the same result for concurrent duplicate requests', async () => {
		const aphex = createAphex({
			cacheDirectory: './node_modules/.cache/aphex-test-second-request',
		})
		await aphex.initialize()
		const [result1, result2, result3] = await Promise.all([
			aphex.exportPhoto(identifier),
			aphex.exportPhoto(identifier),
			aphex.exportPhoto(identifier),
		])
		expect(result1).toEqual(result2)
		expect(result2).toEqual(result3)
	})
})

describe('cache modes', () => {
	it('aggressive mode returns cached result on second call', async () => {
		const aphex = createAphex({
			cacheDirectory: './node_modules/.cache/aphex-test-aggressive',
			cacheMode: 'aggressive',
		})
		await aphex.initialize()

		const result1 = await aphex.exportPhoto(identifier)
		const result2 = await aphex.exportPhoto(identifier)
		expect(result1).toEqual(result2)
	})

	it('enabled mode re-validates on second call', async () => {
		const aphex = createAphex({
			cacheDirectory: './node_modules/.cache/aphex-test-enabled',
			cacheMode: 'enabled',
		})
		await aphex.initialize()

		const result1 = await aphex.exportPhoto(identifier)
		const result2 = await aphex.exportPhoto(identifier)
		expect(result1).toEqual(result2)
	})

	it('disabled mode forces re-export', async () => {
		const aphex = createAphex({
			cacheDirectory: './node_modules/.cache/aphex-test-disabled',
			cacheMode: 'disabled',
		})
		await aphex.initialize()

		const result = await aphex.exportPhoto(identifier)
		expect(typeof result).toBe('string')
		expect(result).toContain('tiny')
	})
})

describe('persistent cache', () => {
	it('saves and loads cache across instances', async () => {
		const cacheDirectory = './node_modules/.cache/aphex-test-persistent'
		const cacheFilePath = path.join(cacheDirectory, '.aphex-plugin-cache.json')

		// First instance: export and save
		const aphex1 = createAphex({
			cacheDirectory,
			cacheMode: 'aggressive',
		})
		await aphex1.initialize()
		const result1 = await aphex1.exportPhoto(identifier)
		await aphex1.savePersistentCache()

		expect(fs.existsSync(cacheFilePath)).toBe(true)
		// eslint-disable-next-line ts/no-unsafe-assignment
		const cacheContent = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'))
		expect(cacheContent).toHaveProperty(identifier)

		// Second instance: should load from persistent cache
		const aphex2 = createAphex({
			cacheDirectory,
			cacheMode: 'aggressive',
		})
		// Re-register so cleanup only happens once
		cacheDirectories.pop()
		await aphex2.initialize()
		const result2 = await aphex2.exportPhoto(identifier)
		expect(result2).toEqual(result1)
	})

	it('removes stale entries when cached file is deleted', async () => {
		const cacheDirectory = './node_modules/.cache/aphex-test-stale'
		const cacheFilePath = path.join(cacheDirectory, '.aphex-plugin-cache.json')

		// Export and save
		const aphex1 = createAphex({
			cacheDirectory,
			cacheMode: 'aggressive',
		})
		await aphex1.initialize()
		const result = await aphex1.exportPhoto(identifier)
		await aphex1.savePersistentCache()

		// Delete the exported file but keep the cache json
		const exportedPath = typeof result === 'string' ? result : result.src
		fs.rmSync(exportedPath)

		// New instance should detect stale entry
		const aphex2 = createAphex({
			cacheDirectory,
			cacheMode: 'aggressive',
		})
		// Re-register so cleanup only happens once
		cacheDirectories.pop()
		await aphex2.initialize()

		// Cache file should be marked dirty and re-saved without the stale entry
		await aphex2.savePersistentCache()
		// eslint-disable-next-line ts/no-unsafe-assignment
		const updatedCache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'))
		expect(updatedCache).not.toHaveProperty(identifier)
	})
})

describe('cache pruning', () => {
	it('removes files not in the exported set when pruneCacheOnBuild is true', async () => {
		const cacheDirectory = './node_modules/.cache/aphex-test-prune'
		fs.mkdirSync(cacheDirectory, { recursive: true })

		// Plant a dummy file that should be pruned
		const dummyFile = path.join(cacheDirectory, 'orphan-image.png')
		fs.writeFileSync(dummyFile, 'dummy')

		const aphex = createAphex({
			cacheDirectory,
			pruneCacheOnBuild: true,
		})
		await aphex.initialize()
		await aphex.exportPhoto(identifier)
		await aphex.pruneCache()

		expect(fs.existsSync(dummyFile)).toBe(false)
	})

	it('preserves the cache json file during pruning', async () => {
		const cacheDirectory = './node_modules/.cache/aphex-test-prune-json'

		const aphex = createAphex({
			cacheDirectory,
			pruneCacheOnBuild: true,
		})
		await aphex.initialize()
		await aphex.exportPhoto(identifier)
		await aphex.savePersistentCache()
		await aphex.pruneCache()

		const cacheFilePath = path.join(cacheDirectory, '.aphex-plugin-cache.json')
		expect(fs.existsSync(cacheFilePath)).toBe(true)
	})

	it('does not prune when pruneCacheOnBuild is false', async () => {
		const cacheDirectory = './node_modules/.cache/aphex-test-no-prune'
		fs.mkdirSync(cacheDirectory, { recursive: true })

		const dummyFile = path.join(cacheDirectory, 'should-remain.png')
		fs.writeFileSync(dummyFile, 'dummy')

		const aphex = createAphex({
			cacheDirectory,
			pruneCacheOnBuild: false,
		})
		await aphex.initialize()
		await aphex.exportPhoto(identifier)
		await aphex.pruneCache()

		expect(fs.existsSync(dummyFile)).toBe(true)
	})
})
