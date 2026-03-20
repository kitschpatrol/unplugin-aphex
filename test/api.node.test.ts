import fs from 'node:fs'
import { expect, it } from 'vitest'
import { AphexExport } from '../src/api'

it('works via the api ', async () => {
	const cacheDirectory = './node_modules/.cache/aphex-node-test'
	const identifier = '~aphex/Tiny/tiny'
	const aphex = new AphexExport({ cacheDirectory, verbose: true })
	await aphex.initialize()
	expect(aphex.isIdentifier(identifier)).toBe(true)
	expect(aphex.isIdentifier('not-an-aphex-identifier')).toBe(false)
	const exportedPath = await aphex.exportPhoto(identifier)
	expect(exportedPath).toContain('node_modules/.cache/aphex-node-test/tiny')
	await aphex.close()
	fs.rmSync(cacheDirectory, { force: true, recursive: true })
})
