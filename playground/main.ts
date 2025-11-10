// Console.log('Loaded main!')

// -----------------------------------------------
document.body.append(document.createElement('hr'))
// -----------------------------------------------

// Support for static imports
import imageStatic from '~aphex/Tiny/tiny'
console.log('Static import:', imageStatic)

const imageStaticElement = document.createElement('img')
imageStaticElement.src = imageStatic
imageStaticElement.width = 100
document.body.append(imageStaticElement)

// -----------------------------------------------
document.body.append(document.createElement('hr'))
// -----------------------------------------------

// Support for dynamic imports with hardcoded path
const temp = '~aphex/Tiny/tiny'
const imageDynamic = await import(/* @vite-ignore */ temp)
console.log(imageDynamic)
console.log('Dynamic import:', imageDynamic.default)

const imageDynamicElement = document.createElement('img')
imageDynamicElement.src = imageDynamic.default
imageDynamicElement.width = 100
document.body.append(imageDynamicElement)

// -----------------------------------------------
document.body.append(document.createElement('hr'))
// -----------------------------------------------

// Support for dynamic imports with variable path using virtual loader module
// import { loadAphex } from 'virtual:aphex-loader'

// Try {
// const photoPath = '~aphex/Tiny/tiny'

// const imageVirtual = await loadAphex(photoPath)

// 	// const imageReimported = await import(imageVirtual)

// console.log(`Load Aphex Dynamic import:`, imageVirtual)
// 	// Console.log(imageReimported)

// const imageVirtualElement = document.createElement('img')
// imageVirtualElement.src = imageVirtual
// imageVirtualElement.width = 100
// document.body.append(imageVirtualElement)
// } catch (error: unknown) {
// 	console.error('Virtual loader resolveAphexPath failed:', error)
// }

// -----------------------------------------------
document.body.append(document.createElement('hr'))
// -----------------------------------------------
