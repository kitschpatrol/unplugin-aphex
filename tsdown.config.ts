import { defineConfig } from 'tsdown'

export default defineConfig({
	clean: true,
	// @ts-expect-error - Not defined yet?
	dts: { transformer: 'oxc' },
	entry: ['./src/*.ts'],
	format: 'esm',
	target: 'node18.12',
	tsconfig: './tsconfig.build.json',
})
