import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './core/options'
import { AphexExport } from './core/aphex'

const VIRTUAL_PREFIX = '\0aphex:'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options) => {
	const aphexExport = new AphexExport(options)
	const metadataById = new Map<string, string>()

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
				const json = metadataById.get(id)
				if (json !== undefined) {
					return `export default ${json}`
				}
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

				const virtualId = `${VIRTUAL_PREFIX}${id}`
				metadataById.set(virtualId, JSON.stringify(result))
				return virtualId
			},
		},
		async writeBundle() {
			// On "build" only...
			// TODO a problem for middleware?
			await aphexExport.pruneCache()
		},
	}
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

// Ugly but adheres to: https://unplugin.unjs.io/guide/plugin-conventions.html
/** @alias unplugin */
export default unplugin
