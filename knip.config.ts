import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	ignore: ['tests/fixtures/basic.js'],
	ignoreDependencies: ['tsx', 'vite'],
})
