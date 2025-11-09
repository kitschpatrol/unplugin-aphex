import { rollupBuild, testFixtures } from '@sxzz/test-utils'
import path from 'node:path'
import { describe } from 'vitest'
import AphexPlugin from '../src/rollup'

describe('rollup', async () => {
	const { dirname } = import.meta
	await testFixtures(
		'*.js',
		async (_args, id) => {
			const { snapshot } = await rollupBuild(id, [AphexPlugin()])
			return snapshot
		},
		{ cwd: path.resolve(dirname, 'fixtures'), promise: true },
	)
})
