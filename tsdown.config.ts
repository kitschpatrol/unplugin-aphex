import { defineConfig } from 'tsdown'

export default defineConfig({
	clean: true,
	entry: ['./src/*.ts'],
	tsconfig: './tsconfig.build.json',
})
