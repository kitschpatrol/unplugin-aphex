import photoTestBasic from '~aphex/Tiny/tiny'
import { expect, it } from 'vitest'

it('imports static paths', () => {
	expect(photoTestBasic).toMatchInlineSnapshot(`"/@fs/node_modules/.cache/aphex/tiny-294e4ad3.png"`)
})

it('imports dynamic paths with static identifiers', async () => {
	const photoTestDynamic = await import('~aphex/Tiny/tiny')
	expect(photoTestDynamic.default).toMatchInlineSnapshot(
		`"/@fs/node_modules/.cache/aphex/tiny-294e4ad3.png"`,
	)
})

// Nope
it.skip('imports dynamic paths with variable identifiers', async () => {
	const temp = '~aphex/Tiny/tiny'
	// eslint-disable-next-line ts/no-unsafe-assignment
	const photoTestDynamicVariable = await import(/* @vite-ignore */ temp)
	// eslint-disable-next-line ts/no-unsafe-member-access
	expect(photoTestDynamicVariable.default).toMatchInlineSnapshot()
})
