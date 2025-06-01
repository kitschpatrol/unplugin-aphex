import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options) => ({
	name: 'unplugin-apple-photos',
	transform(code) {
		return code.replace(
			'__UNPLUGIN__',
			`Hello Unplugin! ${options ? `Options: ${JSON.stringify(options)}` : ''}`,
		)
	},
	transformInclude(id) {
		return id.endsWith('main.ts')
	},
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

// export default unplugin
