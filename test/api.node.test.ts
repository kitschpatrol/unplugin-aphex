import { expect, it } from 'vitest'
import { AphexExport } from '../src/api'

it('works via the api ', async () => {
	const identifier = '~aphex/Tiny/tiny'
	const aphex = new AphexExport({ verbose: true })
	expect(aphex.isIdentifier(identifier)).toBe(true)
	expect(aphex.isIdentifier('not-an-aphex-identifier')).toBe(false)
	const exportedPath = await aphex.exportPhoto(identifier)
	expect(exportedPath).toContain('node_modules/.cache/aphex/tiny')
})
