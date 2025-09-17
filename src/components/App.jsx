import { useEffect } from 'preact/hooks'
import VideoDisplay from './VideoDisplay.jsx'
import Controls from './Controls.jsx'
import StatusDisplay from './StatusDisplay.jsx'
import useStyleTransfer from '../hooks/useStyleTransfer.js'
import useWebcamStore from '../stores/useWebcamStore.js'

const App = () => {
  const { isProcessing } = useWebcamStore()
  useStyleTransfer()

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 300
  }, [])

  return (
    <div>
      <h1 className="app-title">Webcam Style Transfer</h1>
      <VideoDisplay />
      <Controls />
      <StatusDisplay />
      <a
        href="https://github.com/matanshavit/webcam-style-transfer"
        target="_blank"
        rel="noopener noreferrer"
        className="github-link"
      >
        [github.com/matanshavit/webcam-style-transfer]
      </a>
    </div>
  )
}

export default App