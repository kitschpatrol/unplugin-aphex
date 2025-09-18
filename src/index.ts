import type { UnpluginFactory } from 'unplugin'
import { exportPhoto } from 'aphex'
import { defu } from 'defu'
import fs from 'node:fs/promises'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'

const defaultOptions = {
	destinationDirectory: './.aphex-cache',
	// Aphex will use its defaults
	exportOptions: undefined,
	verbose: true, // TODO change this
}

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options) => {
	const { destinationDirectory, exportOptions, verbose } = defu(options, defaultOptions)

	return {
		async buildStart() {
			await fs.mkdir(destinationDirectory, { recursive: true })
		},
		enforce: 'pre',
		name: 'unplugin-aphex',
		resolveId: {
			filter: {
				id: /^~(?:photos|aphex)\/.+/,
			},
			async handler(id) {
				if (verbose) {
					console.time('Time')
				}

				const identifier = id.replace(/^~(?:photos|aphex)\//, '')
				const result = await exportPhoto(identifier, destinationDirectory, exportOptions)

				if (verbose) {
					console.log(`Aphex resolved "${id}" to "${result.path}"`)
					console.timeEnd('Time')
				}

				return result.path
			},
		},
	}
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

// Ugly but adheres to: https://unplugin.unjs.io/guide/plugin-conventions.html
export default unplugin
