type AphexImageResultMetadata = {
	// Manually maintained from IMAGE_MIME_TYPES in @kitschpatrol/aphex
	format:
		| 'arw'
		| 'avif'
		| 'bmp'
		| 'cr2'
		| 'cr3'
		| 'crw'
		| 'dng'
		| 'gif'
		| 'heic'
		| 'heif'
		| 'jpeg'
		| 'nef'
		| 'pef'
		| 'png'
		| 'psd'
		| 'svg+xml'
		| 'tga'
		| 'tiff'
		| 'webp'
	height: number
	src: string
	width: number
}

declare module '~aphex/*' {
	const content: AphexImageResultMetadata | string
	export default content
}
