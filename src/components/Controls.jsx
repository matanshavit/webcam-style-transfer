import useWebcamStore from '../stores/useWebcamStore.js'
import { isValidImageUrl, testImageLoad } from '../utils/styleImages.js'

const Controls = () => {
  const {
    isWebcamStarted,
    isProcessing,
    selectedStyle,
    selectedResolution,
    customStyles,
    customStyleCounter,
    setWebcamStarted,
    setProcessing,
    setSelectedStyle,
    setSelectedResolution,
    setStatus,
    addCustomStyle,
    video
  } = useWebcamStore()

  const handleStartWebcam = async () => {
    try {
      setStatus('Accessing webcam...')
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      video.srcObject = stream
      setWebcamStarted(true)
      setStatus('Webcam started. Click "Apply Style" to begin.')
    } catch (err) {
      setStatus('Error accessing webcam: ' + err.message)
      console.error('Error accessing webcam:', err)
    }
  }

  const handleApplyStyle = () => {
    if (isProcessing) {
      setProcessing(false)
      setStatus('Style transfer stopped.')
    } else {
      setProcessing(true)
      setStatus('Initializing style transfer...')
    }
  }

  const handleStyleChange = async (e) => {
    const selectedValue = e.target.value

    if (selectedValue === 'add_custom') {
      await handleAddCustomStyle()
      return
    }

    setSelectedStyle(selectedValue)
  }

  const handleAddCustomStyle = async () => {
    const imageUrl = prompt('Enter image URL:')

    if (!imageUrl) {
      setSelectedStyle('starry_night')
      return
    }

    if (!isValidImageUrl(imageUrl)) {
      alert('Please enter a valid image URL (jpg, jpeg, png, gif, webp, bmp)')
      setSelectedStyle('starry_night')
      return
    }

    const originalStatus = useWebcamStore.getState().status
    setStatus('Loading custom style...')

    try {
      await testImageLoad(imageUrl)

      const styleId = `custom_${Date.now()}`
      const styleName = `Custom Image #${customStyleCounter}`

      addCustomStyle(styleId, imageUrl)
      setSelectedStyle(styleId)

      setStatus(`Added ${styleName}`)
      setTimeout(() => {
        setStatus(originalStatus)
      }, 2000)

    } catch (error) {
      console.error('Error loading custom style:', error)
      setStatus('Error loading image. Please check the URL.')
      setSelectedStyle('starry_night')
      setTimeout(() => {
        setStatus(originalStatus)
      }, 3000)
    }
  }

  const renderStyleOptions = () => {
    const builtInOptions = [
      { value: 'starry_night', label: 'Starry Night (Van Gogh)' },
      { value: 'great_wave', label: 'The Great Wave Off Kanagawa (Hokusai)' },
      { value: 'the_scream', label: 'The Scream (Munch)' },
      { value: 'the_water_lily_pond', label: 'The Water Lily Pond (Monet)' },
      { value: 'girl_with_pearl_earring', label: 'Girl with Pearl Earring (Vermeer)' },
      { value: 'the_kiss', label: 'The Kiss (Klimt)' },
      { value: 'american_gothic', label: 'American Gothic (Wood)' },
      { value: 'birth_of_venus', label: 'The Birth of Venus (Botticelli)' },
      { value: 'last_supper', label: 'The Last Supper (Da Vinci)' },
      { value: 'sunday_afternoon', label: 'A Sunday Afternoon on the Island of La Grande Jatte (Seurat)' },
      { value: 'potato_eaters', label: 'The Potato Eaters (Van Gogh)' },
      { value: 'garden_earthly_delights', label: 'The Garden of Earthly Delights (Bosch)' },
      { value: 'hay_wain', label: 'The Hay Wain (Constable)' },
      { value: 'mondrian_composition', label: 'Composition II in Red, Blue, and Yellow (Mondrian)' },
      { value: 'kandinsky_composition', label: 'Composition VIII (Kandinsky)' },
      { value: 'christinas_world', label: 'Christina\'s World (Wyeth)' },
      { value: 'music', label: 'Music in Pink and Blue No. 2 (O\'Keefe)' }
    ]

    const customOptions = Array.from(customStyles.entries()).map(([id], index) => ({
      value: id,
      label: `Custom Image #${index + 1}`
    }))

    return [
      ...builtInOptions,
      ...customOptions,
      { value: 'add_custom', label: '+ Add Custom Style...', italic: true }
    ]
  }

  return (
    <div id="controls">
      {!isWebcamStarted ? (
        <button
          id="startBtn"
          className="start"
          onClick={handleStartWebcam}
        >
          Start Webcam
        </button>
      ) : (
        <button
          id="applyStyleBtn"
          className={isProcessing ? 'stop' : ''}
          onClick={handleApplyStyle}
        >
          {isProcessing ? 'Stop' : 'Apply Style'}
        </button>
      )}

      <select
        id="styleSelect"
        value={selectedStyle}
        onChange={handleStyleChange}
        disabled={false}
      >
        {renderStyleOptions().map(option => (
          <option
            key={option.value}
            value={option.value}
            style={option.italic ? { fontStyle: 'italic' } : {}}
            disabled={isProcessing && option.value === 'add_custom'}
          >
            {option.label}
          </option>
        ))}
      </select>

      <select
        id="resolutionSelect"
        value={selectedResolution}
        onChange={(e) => setSelectedResolution(parseInt(e.target.value))}
      >
        <option value={128}>128x128 (Fast)</option>
        <option value={192}>192x192 (Balanced)</option>
        <option value={256}>256x256 (High Quality)</option>
        <option value={384}>384x384 (Ultra Quality - Slow)</option>
        <option value={512}>512x512 (Maximum Quality - Very Slow)</option>
      </select>
    </div>
  )
}

export default Controls