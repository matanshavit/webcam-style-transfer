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
      <h1 style={{ fontSize: '22px', margin: '8px 0' }}>Webcam Style Transfer</h1>
      <VideoDisplay />
      <Controls />
      <StatusDisplay />
    </div>
  )
}

export default App