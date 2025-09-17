import * as tf from '@tensorflow/tfjs'
import * as mi from '@magenta/image'

export const preprocessStyleImage = async (styleName, customStyles) => {
  const { getStyleImageUrl } = await import('./styleImages.js')
  const styleImageUrl = getStyleImageUrl(styleName, customStyles)
  const styleImage = new Image()
  styleImage.crossOrigin = 'anonymous'

  await new Promise((resolve, reject) => {
    styleImage.onload = resolve
    styleImage.onerror = reject
    styleImage.src = styleImageUrl
  })

  const styleImageTensor = tf.browser.fromPixels(styleImage).div(255.0)
  const resizedStyleTensor = tf.image.resizeBilinear(styleImageTensor, [256, 256])

  const styleCanvas = document.createElement('canvas')
  styleCanvas.width = 256
  styleCanvas.height = 256
  await tf.browser.toPixels(resizedStyleTensor, styleCanvas)

  styleImageTensor.dispose()
  resizedStyleTensor.dispose()

  return styleCanvas
}

export const initializeStyleTransferModel = async () => {
  const styleNet = new mi.ArbitraryStyleTransferNetwork()
  await styleNet.initialize()
  return styleNet
}