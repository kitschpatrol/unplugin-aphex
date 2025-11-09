import { expect, it } from 'vitest'
import photoTest1 from '~/aphex/Tiny/tiny'

it('imports static paths', async () => {
	expect(photoTest1).toMatchInlineSnapshot()
})
