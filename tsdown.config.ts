import { defineConfig } from 'tsdown'

export default defineConfig({
	copy: ['./src/client.d.ts'],
	entry: ['./src/*.ts'],
	fixedExtension: false,
	tsconfig: './tsconfig.build.json',
})
