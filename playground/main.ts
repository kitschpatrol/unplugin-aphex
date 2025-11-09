console.log('Loaded main!')

const test = 'virtual:config'

const config = await import(test);

console.log('Config:', config)
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
const imageDynamic = await import('~aphex/Tiny/tiny')
console.log('Dynamic import:', imageDynamic.default)

const imageDynamicElement = document.createElement('img')
imageDynamicElement.src = imageDynamic.default
imageDynamicElement.width = 100
document.body.append(imageDynamicElement)

// -----------------------------------------------
document.body.append(document.createElement('hr'))
// -----------------------------------------------


// Support for dynamic imports with variable path

try {
  const photoPath = '~aphex/Tiny/tiny'
  const imageTemplate = await import(photoPath) as { default: string }
  const imageTemplateElement = document.createElement('img')
  imageTemplateElement.src = imageTemplate.default
  imageTemplateElement.width = 100
  document.body.append(imageTemplateElement)
}
catch (error) {
  console.log(error)
}

// -----------------------------------------------
document.body.append(document.createElement('hr'))
// -----------------------------------------------
 
