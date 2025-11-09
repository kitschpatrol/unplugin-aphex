import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import mkcert from 'vite-plugin-mkcert'
import Aphex from '../src/vite'
process.env.BROWSER = 'chromium'

export default defineConfig({
	plugins: [
		mkcert(),
		Inspect(),
		Aphex(),
		{
			load(id) {
				if (id === '\0virtual:config') {
					const config = {
						apiUrl: process.env.API_URL || 'https://api.example.com',
						version: '1.0.0',
					}
					return `export default ${JSON.stringify(config)}`
				}
			},
			name: 'virtual-config-plugin',
			resolveId(id) {
				// Handle both direct and dynamic import cases
				if (id === 'virtual:config' || id === '\0virtual:config') {
					return '\0virtual:config' // \0 marks it as internal (Vite won't try to fetch over network)
				}
			},
			// Optional but helpful: rewrite dynamic imports during dev
			transform(code, id) {
				if (id.endsWith('.ts') || id.endsWith('.js')) {
					console.log('----------------------------------')
					console.log(code)
					return code.replaceAll(
						/\bimport\s*\(\s*['"]virtual:config['"]\s*\)/g,
						String.raw`import('\0virtual:config')`,
					)
				}
			},
		},
	],
	server: {
		hmr: {
			host: 'localhost',
			protocol: 'wss',
		},
		open: true,
	},
})
