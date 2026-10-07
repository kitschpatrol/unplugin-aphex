import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	ignoreExportsUsedInFile: true,
	ignoreUnresolved: [/^~aphex\//v],
})
