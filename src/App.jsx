import { useRef } from 'react'
import { useStore } from './store'
import AvatarScene from './components/avatar/AvatarScene'
import InputForm from './components/ui/InputForm'
import PromptPanel from './components/ui/PromptPanel'
import Gallery from './components/ui/Gallery'

function App() {
  const sceneRef = useRef()
  const { metrics, currentPose, addGeneratedImage, setLoading } = useStore()

  const handleGenerate = async (prompt) => {
    setLoading(true)
    try {
      const poseImage = sceneRef.current?.capture()
      if (!poseImage) {
        console.warn('Scene not ready')
        return
      }

      addGeneratedImage(poseImage)
    } catch (err) {
      console.error('Generation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-screen h-screen bg-gray-50">
      <div className="w-1/3 p-4 border-r overflow-y-auto bg-white">
        <h1 className="text-xl font-bold mb-4">3D Virtual Fitting</h1>
        <InputForm />
        <PromptPanel onGenerate={handleGenerate} />
      </div>

      <div className="w-1/3 relative bg-gray-100">
        <AvatarScene ref={sceneRef} metrics={metrics} pose={currentPose} />
      </div>

      <div className="w-1/3 p-4 border-l overflow-y-auto bg-white">
        <Gallery />
      </div>
    </div>
  )
}

export default App
