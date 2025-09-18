import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import ApplePhotos from '../src/vite'

export default defineConfig({
	plugins: [Inspect(), ApplePhotos()],
})
