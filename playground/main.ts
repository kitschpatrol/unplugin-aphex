import imageStatic from '~aphex/test-album/lab-4'
import imageStatic2 from '~aphex/Tiny/tiny'

document.body.append(document.createElement('hr'))

console.log('Static import:', imageStatic)

const imageStaticElement = document.createElement('img')
imageStaticElement.src = typeof imageStatic === 'string' ? imageStatic : ''
imageStaticElement.width = 100
document.body.append(imageStaticElement)

console.log('Static import:', imageStatic2)

const imageStatic2Element = document.createElement('img')
imageStatic2Element.src = typeof imageStatic2 === 'string' ? imageStatic2 : ''
imageStatic2Element.width = 100
document.body.append(imageStatic2Element)

document.body.append(document.createElement('hr'))
