import { rollupBuild, testFixtures } from '@sxzz/test-utils'
import path from 'node:path'
import { describe } from 'vitest'
import Starter from '../src/rollup'

describe('rollup', async () => {
	// eslint-disable-next-line node/no-unsupported-features/node-builtins
	const { dirname } = import.meta
	await testFixtures(
		'*.js',
		async (args, id) => {
			const { snapshot } = await rollupBuild(id, [Starter()])
			console.log(args)
			return snapshot
		},
		{ cwd: path.resolve(dirname, 'fixtures'), promise: true },
	)
})
