import { create } from 'zustand'

const useWebcamStore = create((set, get) => ({
  // Video and canvas state
  video: null,
  canvas: null,
  ctx: null,
  isWebcamStarted: false,
  isProcessing: false,

  // Style transfer state
  styleNet: null,
  activeStyleCanvas: null,
  activeStyleName: null,
  backgroundStyleCanvas: null,
  backgroundStyleName: null,
  isPreparingStyle: false,
  pendingStyleSwitch: false,
  isCanvasReady: false,

  // Performance metrics
  frameCount: 0,
  lastTime: performance.now(),
  fps: 0,
  latencySum: 0,
  latencyCount: 0,
  avgLatency: 0,

  // UI state
  selectedStyle: 'starry_night',
  selectedResolution: 256,
  status: 'Ready to start...',

  // Custom styles
  customStyles: new Map(),
  customStyleCounter: 1,

  // Animation frame ID
  animationId: null,

  // Actions
  setVideo: (video) => set({ video }),
  setCanvas: (canvas) => set({ canvas }),
  setCtx: (ctx) => set({ ctx }),
  setWebcamStarted: (started) => set({ isWebcamStarted: started }),
  setProcessing: (processing) => set({ isProcessing: processing }),
  setStyleNet: (styleNet) => set({ styleNet }),
  setActiveStyle: (canvas, name) => set({ activeStyleCanvas: canvas, activeStyleName: name }),
  setBackgroundStyle: (canvas, name) => set({ backgroundStyleCanvas: canvas, backgroundStyleName: name }),
  setPreparingStyle: (preparing) => set({ isPreparingStyle: preparing }),
  setPendingStyleSwitch: (pending) => set({ pendingStyleSwitch: pending }),
  setCanvasReady: (ready) => set({ isCanvasReady: ready }),
  setSelectedStyle: (style) => set({ selectedStyle: style }),
  setSelectedResolution: (resolution) => set({ selectedResolution: resolution }),
  setStatus: (status) => set({ status }),
  setAnimationId: (id) => set({ animationId: id }),

  // Performance metrics actions
  updateFPS: () => {
    const state = get()
    const frameCount = state.frameCount + 1
    const currentTime = performance.now()
    const deltaTime = currentTime - state.lastTime

    if (deltaTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / deltaTime)
      set({
        fps,
        frameCount: 0,
        lastTime: currentTime
      })
    } else {
      set({ frameCount })
    }
  },

  updateLatency: (processingTime) => {
    const state = get()
    const latencySum = state.latencySum + processingTime
    const latencyCount = state.latencyCount + 1

    if (latencyCount >= 10) {
      const avgLatency = Math.round(latencySum / latencyCount)
      set({
        avgLatency,
        latencySum: 0,
        latencyCount: 0
      })
    } else {
      set({ latencySum, latencyCount })
    }
  },

  resetCounters: () => set({
    frameCount: 0,
    lastTime: performance.now(),
    fps: 0,
    latencySum: 0,
    latencyCount: 0,
    avgLatency: 0
  }),

  // Custom styles actions
  addCustomStyle: (id, url) => {
    const state = get()
    const newCustomStyles = new Map(state.customStyles)
    newCustomStyles.set(id, url)
    set({
      customStyles: newCustomStyles,
      customStyleCounter: state.customStyleCounter + 1
    })
  },

  // Style switching actions
  performStyleSwitch: () => {
    const state = get()
    if (!state.pendingStyleSwitch || !state.backgroundStyleCanvas) return

    set({
      activeStyleCanvas: state.backgroundStyleCanvas,
      activeStyleName: state.backgroundStyleName,
      backgroundStyleCanvas: null,
      backgroundStyleName: null,
      pendingStyleSwitch: false
    })

    const displayName = state.backgroundStyleName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    set({ status: `Style transfer active. Now using ${displayName}.` })
  },

  // Cleanup action
  cleanup: () => {
    const state = get()
    if (state.animationId) {
      cancelAnimationFrame(state.animationId)
    }
    set({
      isProcessing: false,
      activeStyleCanvas: null,
      activeStyleName: null,
      backgroundStyleCanvas: null,
      backgroundStyleName: null,
      isPreparingStyle: false,
      pendingStyleSwitch: false,
      isCanvasReady: false,
      animationId: null
    })
  }
}))

export default useWebcamStore