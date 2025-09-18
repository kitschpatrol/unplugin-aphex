console.log('Loaded main!')

import photoPath from '~aphex/test-album/lab-5'
// import photoPathProtocol from 'photos://52B90B1B-731F-44CE-B46E-ABBC752FF3DB'

console.log(photoPath)

const img = document.createElement('img')
img.src = photoPath
document.body.append(img)

const photoPathElement = document.createElement('p')
photoPathElement.innerHTML = photoPath
document.body.append(photoPathElement)
