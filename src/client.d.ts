// TODO decide on a prefix...
// declare module 'photos://*' {
// 	const content: string
// 	export default content
// }

declare module '~photos/*' {
	const content: string
	export default content
}

declare module '~aphex/*' {
	const content: string
	export default content
}

// /**
//  * Type declarations for the virtual:aphex-loader module
//  * @module
//  */

// declare module 'virtual:aphex-loader' {
// 	/**
// 	 * Dynamically load a photo module from Apple Photos.app.
// 	 *
// 	 * This function imports a photo module dynamically, with caching to avoid
// 	 * duplicate imports. The path can be specified with or without the `~aphex/` prefix.
// 	 * @param path - The photo identifier (e.g., '~aphex/Album/photo' or 'Album/photo')
// 	 * @returns A promise that resolves to the imported module
// 	 * @example
// 	 * ```ts
// 	 * import { loadAphex } from 'virtual:aphex-loader'
// 	 *
// 	 * // Both formats work:
// 	 * const module1 = await loadAphex('~aphex/Favorites/my-photo')
// 	 * const module2 = await loadAphex('Favorites/my-photo')
// 	 *
// 	 * // Use the default export (URL/path)
// 	 * const img = document.createElement('img')
// 	 * img.src = module1.default
// 	 * ```
// 	 */
// 	export function loadAphex(path: string): Promise<{ default: string }>

// 	/**
// 	 * Resolve a photo path from Apple Photos.app without importing it.
// 	 *
// 	 * This function returns the URL/path for a photo without performing a full import.
// 	 * In development mode, it returns a dev server URL (/__aphex/...).
// 	 * In production builds, it triggers a dynamic import to get the asset path.
// 	 * @param path - The photo identifier (e.g., '~aphex/Album/photo' or 'Album/photo')
// 	 * @returns A promise that resolves to the URL/path of the photo
// 	 * @example
// 	 * ```ts
// 	 * import { resolveAphexPath } from 'virtual:aphex-loader'
// 	 *
// 	 * // Get the path directly
// 	 * const photoUrl = await resolveAphexPath('Favorites/my-photo')
// 	 * const img = document.createElement('img')
// 	 * img.src = photoUrl
// 	 * ```
// 	 */
// 	export function resolveAphexPath(path: string): Promise<string>
// }
