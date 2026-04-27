type AphexImageResultMetadata = {
	// Manually maintained from IMAGE_MIME_TYPES in @kitschpatrol/aphex.
	// Don't import the type — `client.d.ts` is loaded as ambient types via
	// `types: [...]` / triple-slash, and adding an import turns this file
	// into a module, breaking the ambient `declare module '~aphex/*'`
	// resolution in some downstream TS setups.
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
