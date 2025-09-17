import { useRef, useEffect } from 'preact/hooks'
import useWebcamStore from '../stores/useWebcamStore.js'

const VideoDisplay = () => {
  const videoRef = useRef()
  const canvasRef = useRef()

  const {
    setVideo,
    setCanvas,
    setCtx,
    isCanvasReady,
    isProcessing,
    fps,
    avgLatency
  } = useWebcamStore()

  useEffect(() => {
    if (videoRef.current) {
      setVideo(videoRef.current)
    }
  }, [setVideo])

  useEffect(() => {
    if (canvasRef.current) {
      setCanvas(canvasRef.current)
      setCtx(canvasRef.current.getContext('2d'))
    }
  }, [setCanvas, setCtx])

  const updateContainerDimensions = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) return

    const videoAspectRatio = video.videoWidth / video.videoHeight
    const isVertical = videoAspectRatio < 1 // Height is greater than width

    let maxHeight, maxWidth, maxWidthPercent
    if (window.innerWidth >= 1600) {
      maxHeight = 750
      maxWidth = 1000
      maxWidthPercent = 0.7
    } else if (window.innerWidth >= 1200) {
      maxHeight = 600
      maxWidth = 800
      maxWidthPercent = 0.8
    } else if (window.innerWidth <= 768) {
      maxHeight = 300
      maxWidth = 600
      maxWidthPercent = 0.9
    } else {
      maxHeight = 450
      maxWidth = 600
      maxWidthPercent = 0.9
    }

    let newWidth, newHeight

    if (isVertical) {
      // For vertical video: maintain width, let height grow
      const maxContainerWidth = Math.min(maxWidth, window.innerWidth * maxWidthPercent)
      newWidth = maxContainerWidth
      newHeight = Math.round(newWidth / videoAspectRatio)

      // Still cap the height to prevent it from being too tall
      if (newHeight > maxHeight * 1.5) {
        newHeight = maxHeight * 1.5
        newWidth = Math.round(newHeight * videoAspectRatio)
      }
    } else {
      // For horizontal video: maintain height, adjust width
      const containerHeight = Math.min(maxHeight, window.innerWidth * maxWidthPercent * 0.75)
      newHeight = containerHeight
      newWidth = Math.round(containerHeight * videoAspectRatio)
    }

    const container = videoRef.current?.parentElement
    if (container) {
      container.style.width = `${newWidth}px`
      container.style.height = `${newHeight}px`
    }

    if (canvasRef.current) {
      canvasRef.current.width = newWidth
      canvasRef.current.height = newHeight
    }
  }

  useEffect(() => {
    const handleResize = () => updateContainerDimensions()
    window.addEventListener('resize', handleResize)

    const handleVideoMetadata = () => updateContainerDimensions()
    const video = videoRef.current
    if (video) {
      video.addEventListener('loadedmetadata', handleVideoMetadata)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      if (video) {
        video.removeEventListener('loadedmetadata', handleVideoMetadata)
      }
    }
  }, [])

  return (
    <>
      <div id="fps">FPS: {fps || '--'}</div>
      <div id="latency">Latency: {avgLatency ? `${avgLatency}ms` : '--'}</div>

      <div id="container">
        <div>
          <video
            ref={videoRef}
            id="video"
            autoplay
            muted
            playsinline
          />
          <canvas
            ref={canvasRef}
            id="output"
            style={{ display: isCanvasReady ? 'block' : 'none' }}
          />
        </div>
      </div>
    </>
  )
}

export default VideoDisplay