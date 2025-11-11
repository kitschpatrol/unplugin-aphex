import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './core/options'
import { AphexExport } from './core/aphex'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options) => {
	const aphexExport = new AphexExport(options)

	return {
		async buildStart() {
			await aphexExport.initialize()
		},
		enforce: 'pre',
		loadInclude(id) {
			return aphexExport.isIdentifier(id)
		},
		name: 'unplugin-aphex',
		resolveId: {
			filter: {
				id: aphexExport.identifierPattern,
			},
			async handler(id) {
				const result = await aphexExport.exportPhoto(id)
				return typeof result === 'string' ? result : JSON.stringify(result)
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
