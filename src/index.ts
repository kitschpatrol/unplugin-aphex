import type { UnpluginFactory } from 'unplugin'
import { exportPhoto, mergeDefaultExportOptions } from 'aphex'
import { defu } from 'defu'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'

const defaultOptions: Required<Omit<Options, 'exportOptions' | 'processOptions'>> = {
	cleanDestinationOnBuild: true, // TODO change this
	destinationDirectory: './.aphex-cache',
	forceExport: false,
	validateMetadata: false,
	verbose: true, // TODO change this
}

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options) => {
	const resolvedPluginOptions = defu(options, defaultOptions)

	const resolvedAphexOptions = mergeDefaultExportOptions({
		exportOptions: resolvedPluginOptions.exportOptions,
		processOptions: resolvedPluginOptions.processOptions,
	})

	// Apply proxied options...
	assertEnabled(resolvedAphexOptions.metadataOptions)
	resolvedAphexOptions.metadataOptions.validate = resolvedPluginOptions.validateMetadata

	assertEnabled(resolvedAphexOptions.syncOptions)
	resolvedAphexOptions.syncOptions.deleteOthers = false // Always disable, dangerous
	resolvedAphexOptions.syncOptions.forceUpdate = resolvedPluginOptions.forceExport

	// Actively used options
	const { cleanDestinationOnBuild, destinationDirectory, verbose } = resolvedPluginOptions

	const pathsSeen = new Set<string>()

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
				const startTime = performance.now()
				const identifier = id.replace(/^~(?:photos|aphex)\/+/, '')
				const result = await exportPhoto(identifier, destinationDirectory, resolvedAphexOptions)

				if (cleanDestinationOnBuild) {
					pathsSeen.add(result.path)
				}

				if (verbose) {
					const endTime = performance.now()
					const duration = ((endTime - startTime) / 1000).toFixed(2)
					console.log(`Aphex resolved "${id}" to "${result.path}" in ${duration}s`)
					// Even more logging...
					// console.log(JSON.stringify(result.results, undefined, 2))
				}

				return result.path
			},
		},
		async writeBundle() {
			// On "build" only...
			if (cleanDestinationOnBuild) {
				const destinationFiles = await fs.readdir(destinationDirectory, {})
				const fileNamesToKeep = new Set([...pathsSeen].map((filePath) => path.basename(filePath)))

				for (const destinationFile of destinationFiles) {
					if (!fileNamesToKeep.has(destinationFile)) {
						if (verbose) {
							console.log(`Cleaning up unused Aphex image: ${destinationFile}`)
						}
						await fs.rm(path.join(destinationDirectory, destinationFile))
					}
				}
			}
		},
	}
}

function assertEnabled<T>(option: T): asserts option is Exclude<T, 'disabled'> {
	if (option === 'disabled') {
		throw new Error('Bad Aphex default: disabled')
	}
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

// Ugly but adheres to: https://unplugin.unjs.io/guide/plugin-conventions.html
export default unplugin
