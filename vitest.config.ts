import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'
import aphexPlugin from './src/vite'

export default defineConfig({
	test: {
		env: {
			// eslint-disable-next-line ts/naming-convention
			PROJECT_ROOT: import.meta.dirname,
		},
		fileParallelism: false,
		maxConcurrency: 1,
		maxWorkers: 1,
		projects: [
			// Browser project
			{
				plugins: [
					// @ts-expect-error - types
					aphexPlugin({ verbose: true }),
				],
				test: {
					browser: {
						enabled: true,
						headless: true,
						instances: [{ browser: 'chromium' }],
						provider: playwright(),
						screenshotFailures: false,
					},
					exclude: ['test/**/*.node.test.ts'],
					include: ['test/**/*.test.ts'],
					name: 'browser',
				},
			},
			// Node project
			{
				test: {
					environment: 'node',
					exclude: ['test/**/*.browser.test.ts'],
					include: ['test/**/*.test.ts'],
					name: 'node',
				},
			},
		],
		// Silent: 'passed-only',
	},
})
