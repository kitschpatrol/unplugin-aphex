import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'
import aphexPlugin from './src/vite'

export default defineConfig({
	plugins: [aphexPlugin({ verbose: true })],
	root: './test',
	test: {
		browser: {
			enabled: true,
			headless: true,
			instances: [{ browser: 'chromium' }],
			provider: playwright(),
			screenshotFailures: false,
		},
		dir: 'test',
		env: {
			// eslint-disable-next-line ts/naming-convention
			PROJECT_ROOT: import.meta.dirname,
		},
		// Silent: 'passed-only',
	},
})
