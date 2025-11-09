import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Mkcert from 'vite-plugin-mkcert'
import Aphex from '../src/vite'

process.env.BROWSER = 'chromium'

export default defineConfig({
	plugins: [Mkcert(), Inspect(), Aphex()],
	server: {
		hmr: {
			host: 'localhost',
			protocol: 'wss',
		},
		open: true,
	},
})
