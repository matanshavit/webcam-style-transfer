import useWebcamStore from '../stores/useWebcamStore.js'

const StatusDisplay = () => {
  const { status } = useWebcamStore()

  return (
    <div id="status">{status}</div>
  )
}

export default StatusDisplay