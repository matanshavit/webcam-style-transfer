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

    let maxHeight, maxWidthPercent
    if (window.innerWidth >= 1600) {
      maxHeight = 750
      maxWidthPercent = 0.7
    } else if (window.innerWidth >= 1200) {
      maxHeight = 600
      maxWidthPercent = 0.8
    } else if (window.innerWidth <= 768) {
      maxHeight = 300
      maxWidthPercent = 0.9
    } else {
      maxHeight = 450
      maxWidthPercent = 0.9
    }

    const containerHeight = Math.min(maxHeight, window.innerWidth * maxWidthPercent * 0.75)
    const newWidth = Math.round(containerHeight * videoAspectRatio)

    const container = videoRef.current?.parentElement
    if (container) {
      container.style.width = `${newWidth}px`
      container.style.height = `${containerHeight}px`
    }

    if (canvasRef.current) {
      canvasRef.current.width = newWidth
      canvasRef.current.height = containerHeight
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