/* eslint-disable unicorn/no-anonymous-default-export */
/* eslint-disable ts/no-explicit-any */
/* eslint-disable ts/no-unsafe-call */
/* eslint-disable ts/no-unsafe-member-access */
/* eslint-disable ts/require-await */

import type { Options } from './types'
import { unplugin } from '.'

export default (options: Options): any => ({
	hooks: {
		async 'astro:config:setup'(astro: any) {
			astro.config.vite.plugins ??= []
			astro.config.vite.plugins.push(unplugin.vite(options))
		},
	},
	name: 'unplugin-apple-photos',
})
