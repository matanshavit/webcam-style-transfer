// diable depreecation warnings for TensorFlow.js
ENV.set('DEPRECATION_WARNINGS_ENABLED', false);

const STYLE_CHECKPOINT_URL =
    'https://storage.googleapis.com/magentadata/js/checkpoints/style/arbitrary/predictor';
const TRANSFORM_CHECKPOINT_URL =
    'https://storage.googleapis.com/magentadata/js/checkpoints/style/arbitrary/transformer';

const MODEL_FILE = '/tensorflowjs_model.pb';
const WEIGHTS_FILE = '/weights_manifest.json'

class ArbitraryStyleTransferNetwork {

  isInitialized() {
    return this.initialized;
  }

  async initialize() {
    this.dispose();

    [this.styleNet, this.transformNet] = await Promise.all([
      tf.loadFrozenModel(
          STYLE_CHECKPOINT_URL + MODEL_FILE,
          STYLE_CHECKPOINT_URL + WEIGHTS_FILE),
      tf.loadFrozenModel(
          TRANSFORM_CHECKPOINT_URL + MODEL_FILE,
          TRANSFORM_CHECKPOINT_URL + WEIGHTS_FILE),
    ]);

    this.initialized = true;
  }

  dispose() {
    if (this.styleNet) {
      this.styleNet.dispose();
    }
    if (this.transformNet) {
      this.transformNet.dispose();
    }

    this.initialized = false;
  }

  predictStyleParameters(style) {
    return tf.tidy(() => {
      return this.styleNet.predict(
          tf.browser.fromPixels(style).toFloat().div(tf.scalar(255)).expandDims());
    });
  }

  produceStylized(
      content,
      bottleneck) {
    return tf.tidy(() => {
      const image = this.transformNet.predict([
        tf.browser.fromPixels(content).toFloat().div(tf.scalar(255)).expandDims(),
        bottleneck
      ]);
      return image.squeeze();
    });
  }

  stylize(
      content,
      style,
      strength) {
    return new Promise((resolve, reject) => {
      let styleRepresentation = this.predictStyleParameters(style);
      if (strength !== undefined) {
        styleRepresentation = styleRepresentation.mul(tf.scalar(strength))
                                  .add(this.predictStyleParameters(content).mul(
                                      tf.scalar(1.0 - strength)));
      }
      const stylized = this.produceStylized(content, styleRepresentation);
      return tf.browser.toPixels(stylized).then((bytes) => {
        const imageData =
            new ImageData(bytes, stylized.shape[1], stylized.shape[0]);
        styleRepresentation.dispose();
        stylized.dispose();
        resolve(imageData);
      });
    });
  }
}
