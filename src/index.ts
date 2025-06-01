import { createUnplugin, type UnpluginInstance } from 'unplugin'
import { createFilter } from 'unplugin-utils'
import { resolveOptions, type Options } from './core/options'

export const Starter: UnpluginInstance<Options | undefined, false> =
  createUnplugin((rawOptions = {}) => {
    const options = resolveOptions(rawOptions)
    const filter = createFilter(options.include, options.exclude)

    const name = 'unplugin-apple-photos'
    return {
      name,
      enforce: options.enforce,

      transformInclude(id) {
        return filter(id)
      },

      // eslint-disable-next-line unused-imports/no-unused-vars
      transform(code, id) {
        return `// unplugin-apple-photos injected\n${code}`
      },
    }
  })
