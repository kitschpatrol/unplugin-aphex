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
		load(id) {
			console.log('load', id)
			// Generate virtual loader module
			if (id === '\0virtual:aphex-loader') {
				return String.raw`
				export async function loadAphex(photoId) {
					const cleanId = photoId.replace(/^~(?:photos|aphex)\/+/, '')
					const response = await fetch('/__aphex/' + cleanId)
					if (!response.ok) {
						throw new Error('Failed to load photo: ' + cleanId)
					}
					return response.text()
				}
				`
			}
		},
		name: 'unplugin-aphex',
		async resolveId(id) {
			// Virtual loader module
			if (id === 'virtual:aphex-loader') {
				console.log('resolveId', id)
				return '\0virtual:aphex-loader'
			}

			// Static imports: ~photos/... or ~aphex/...
			if (aphexExport.isIdentifier(id)) {
				console.log('resolveId', id)
				return aphexExport.exportPhoto(id) // Returns path, updates pathsSeen
			}
		},
		// Vite-specific features
		vite: {
			configureServer(server) {
				server.middlewares.use(async (request, response, next) => {
					if (!request.url?.startsWith('/__aphex/')) {
						next()
						return
					}

					try {
						const photoId = request.url.slice('/__aphex/'.length)
						// Export photo and update pathsSeen
						const photoPath = await aphexExport.exportPhoto(`~photos/${photoId}`)

						// Use Vite's /@fs/ prefix to serve absolute file paths...

						// Return the photo path as text
						response.setHeader('Content-Type', 'text/plain')
						response.setHeader('Cache-Control', 'no-cache')
						response.end(`/@fs/${photoPath}`)

						// Next()
					} catch (error) {
						console.error('[aphex] Error:', error)
						response.statusCode = 500
						response.end('Error resolving photo')
					}
				})
			},
		},
		async writeBundle() {
			// On "build" only - prune unused cache files
			await aphexExport.pruneCache()
		},
	}
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

// Ugly but adheres to: https://unplugin.unjs.io/guide/plugin-conventions.html
/** @alias unplugin */
export default unplugin
