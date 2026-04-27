import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './core/options'
import { AphexExport } from './core/aphex'

const VIRTUAL_PREFIX = '\0aphex:'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options) => {
	const aphexExport = new AphexExport(options)

	return {
		async buildEnd() {
			// Save cache after each build (works in both dev and prod)
			await aphexExport.savePersistentCache()
		},
		async buildStart() {
			await aphexExport.initialize()
		},
		async closeBundle() {
			await aphexExport.close()
		},
		enforce: 'pre',
		load: {
			filter: {
				id: new RegExp(`^${VIRTUAL_PREFIX}`),
			},
			handler(id) {
				const identifier = id.slice(VIRTUAL_PREFIX.length)
				const result = aphexExport.getCachedResult(identifier)
				if (result === undefined || typeof result === 'string') {
					throw new Error(
						`unplugin-aphex: missing metadata for "${identifier}". This indicates the plugin's resolveId/load state was lost between hooks.`,
					)
				}
				return `export default ${JSON.stringify(result)}`
			},
		},
		name: 'unplugin-aphex',
		resolveId: {
			filter: {
				id: aphexExport.identifierPattern,
			},
			async handler(id) {
				const result = await aphexExport.exportPhoto(id)
				if (typeof result === 'string') {
					return aphexExport.resolveFromCache(result)
				}

				return `${VIRTUAL_PREFIX}${id}`
			},
		},
		async writeBundle() {
			// Only fires on "build", not in dev/middleware modes.
			// TODO is this a problem for middleware?
			await aphexExport.pruneCache()
		},
	}
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

// Ugly but adheres to: https://unplugin.unjs.io/guide/plugin-conventions.html
/** @alias unplugin */
export default unplugin
