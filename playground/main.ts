console.log('Loaded main!')

import photoPath from '~aphex/test-album/lab-5'
import anotherPhotoPath from '~aphex/test-album/prototype'
// import photoPathProtocol from 'photos://52B90B1B-731F-44CE-B46E-ABBC752FF3DB'

console.log(photoPath)
console.assert(photoPath === '/@fs/node_modules/.cache/aphex/lab-5.png')

const img = document.createElement('img')
img.src = photoPath
document.body.append(img)

const img2 = document.createElement('img')
img2.src = anotherPhotoPath
document.body.append(img2)

const photoPathElement = document.createElement('p')
photoPathElement.innerHTML = photoPath
document.body.append(photoPathElement)
