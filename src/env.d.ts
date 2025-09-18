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
