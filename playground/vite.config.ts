import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Aphex from '../src/vite'

export default defineConfig({
	plugins: [Inspect(), Aphex()],
})
