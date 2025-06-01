import type { UnpluginInstance } from 'unplugin'
import { createUnplugin } from 'unplugin'
import { createFilter } from 'unplugin-utils'
import type { Options } from './core/options'
import { resolveOptions } from './core/options'

// eslint-disable-next-line ts/naming-convention
export const Starter: UnpluginInstance<Options | undefined, false> = createUnplugin(
	(rawOptions = {}) => {
		const options = resolveOptions(rawOptions)
		const filter = createFilter(options.include, options.exclude)

		const name = 'unplugin-apple-photos'
		return {
			enforce: options.enforce,
			name,
			transform(code, id) {
				console.log(id)
				return `// unplugin-apple-photos injected\n${code}`
			},
			transformInclude(id) {
				return filter(id)
			},
		}
	},
)
