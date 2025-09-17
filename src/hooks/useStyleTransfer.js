import { useEffect, useRef } from 'preact/hooks'
import * as tf from '@tensorflow/tfjs'
import useWebcamStore from '../stores/useWebcamStore.js'
import { preprocessStyleImage, initializeStyleTransferModel } from '../utils/styleTransfer.js'

const useStyleTransfer = () => {
  const {
    isProcessing,
    video,
    canvas,
    ctx,
    styleNet,
    selectedStyle,
    selectedResolution,
    activeStyleCanvas,
    activeStyleName,
    backgroundStyleCanvas,
    backgroundStyleName,
    isPreparingStyle,
    pendingStyleSwitch,
    customStyles,
    animationId,
    setStyleNet,
    setActiveStyle,
    setBackgroundStyle,
    setPreparingStyle,
    setPendingStyleSwitch,
    setCanvasReady,
    setStatus,
    setAnimationId,
    updateFPS,
    updateLatency,
    performStyleSwitch,
    cleanup,
    resetCounters
  } = useWebcamStore()

  const isInitializing = useRef(false)

  const initializeStyleTransfer = async () => {
    if (isInitializing.current) return
    isInitializing.current = true

    try {
      setStatus(`Loading ${selectedStyle} style model...`)

      let currentStyleNet = styleNet
      if (!currentStyleNet) {
        currentStyleNet = await initializeStyleTransferModel()
        setStyleNet(currentStyleNet)
      }

      setStatus('Preprocessing style image...')
      const styleCanvas = await preprocessStyleImage(selectedStyle, customStyles)
      setActiveStyle(styleCanvas, selectedStyle)

      setStatus('Model loaded. Starting processing...')
      return true
    } catch (err) {
      setStatus('Error loading model: ' + err.message)
      console.error('Error loading model:', err)
      cleanup()
      return false
    } finally {
      isInitializing.current = false
    }
  }

  const prepareBackgroundStyle = async (styleName) => {
    if (isPreparingStyle || styleName === activeStyleName) return

    setPreparingStyle(true)

    try {
      const displayName = styleName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      setStatus(`Style transfer active. Preparing ${displayName}...`)
      const styleCanvas = await preprocessStyleImage(styleName, customStyles)
      setBackgroundStyle(styleCanvas, styleName)
      setPendingStyleSwitch(true)
      setStatus(`Style transfer active. ${displayName} ready - switching on next frame.`)
    } catch (err) {
      console.error('Error preparing background style:', err)
      setBackgroundStyle(null, null)
      setStatus('Style transfer active. Error preparing new style.')
    } finally {
      setPreparingStyle(false)
    }
  }

  const processFrame = async () => {
    const state = useWebcamStore.getState()
    if (!state.isProcessing) return

    const frameStartTime = performance.now()

    try {
      if (state.pendingStyleSwitch) {
        state.performStyleSwitch()
        // When switching styles, hide canvas until new frame is ready
        state.canvas.style.display = 'none'
        state.setCanvasReady(false)
      }

      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = state.selectedResolution
      tempCanvas.height = state.selectedResolution
      const tempCtx = tempCanvas.getContext('2d')

      tempCtx.drawImage(state.video, 0, 0, tempCanvas.width, tempCanvas.height)

      const stylized = await state.styleNet.stylize(tempCanvas, state.activeStyleCanvas)

      let drawableResult
      if (stylized instanceof HTMLCanvasElement) {
        drawableResult = stylized
      } else if (stylized instanceof ImageData) {
        drawableResult = document.createElement('canvas')
        drawableResult.width = stylized.width
        drawableResult.height = stylized.height
        const resultCtx = drawableResult.getContext('2d')
        resultCtx.putImageData(stylized, 0, 0)
      } else {
        drawableResult = document.createElement('canvas')
        await tf.browser.toPixels(stylized, drawableResult)
      }

      state.ctx.drawImage(drawableResult, 0, 0, state.canvas.width, state.canvas.height)

      // Show canvas after first successful frame
      if (!state.isCanvasReady) {
        state.canvas.style.display = 'block'
        state.setCanvasReady(true)
        state.setStatus('Style transfer active. Processing...')
      }

      const processingTime = performance.now() - frameStartTime
      state.updateFPS()
      state.updateLatency(processingTime)

      const newAnimationId = requestAnimationFrame(processFrame)
      state.setAnimationId(newAnimationId)
    } catch (err) {
      console.error('Error processing frame:', err)
      state.setStatus('Error processing frame: ' + err.message)
    }
  }

  // Handle style changes while processing
  useEffect(() => {
    if (isProcessing && selectedStyle !== activeStyleName && !isPreparingStyle && activeStyleName) {
      prepareBackgroundStyle(selectedStyle)
    }
  }, [selectedStyle, isProcessing, activeStyleName, isPreparingStyle])

  // Main processing effect
  useEffect(() => {
    let mounted = true

    const startProcessing = async () => {
      if (!mounted || !video || !canvas || !ctx) return

      const success = await initializeStyleTransfer()
      if (!success || !mounted) return

      // Hide video but don't show canvas yet - wait for first frame
      video.style.visibility = 'hidden'
      canvas.style.display = 'none'
      setCanvasReady(false)
      resetCounters()

      setStatus('Style transfer active. Processing first frame...')

      // Start processing frames
      processFrame()
    }

    const stopProcessing = () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
        setAnimationId(null)
      }

      if (video && canvas) {
        video.style.visibility = 'visible'
        canvas.style.display = 'none'
        setCanvasReady(false)
      }
    }

    if (isProcessing && video && canvas && ctx) {
      startProcessing()
    } else if (!isProcessing) {
      stopProcessing()
    }

    return () => {
      mounted = false
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isProcessing, video, canvas, ctx])

  return {
    initializeStyleTransfer,
    prepareBackgroundStyle
  }
}

export default useStyleTransfer