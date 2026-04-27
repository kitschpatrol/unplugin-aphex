import type { ImageMimeType } from '@kitschpatrol/aphex'

type AphexImageResultMetadata = {
	format: ImageMimeType
	height: number
	src: string
	width: number
}

declare module '~aphex/*' {
	const content: AphexImageResultMetadata | string
	export default content
}
