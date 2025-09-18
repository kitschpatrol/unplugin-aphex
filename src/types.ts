import type { ExportOptions } from 'aphex'

export type Options = {
	// Define your plugin options here
	destinationDirectory?: string
	exportOptions?: ExportOptions
	verbose?: boolean
}
