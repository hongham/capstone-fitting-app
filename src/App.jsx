import { useRef } from 'react'
import { useStore } from './store'
import AvatarScene from './components/avatar/AvatarScene'
import InputForm from './components/ui/InputForm'
import PromptPanel from './components/ui/PromptPanel'
import Gallery from './components/ui/Gallery'
import { generateImage } from './api/generate'

function App() {
  const sceneRef = useRef()
  const { metrics, currentPose, addGeneratedImage, setLoading } = useStore()

const handleGenerate = async (prompt) => {
    console.log("handleGenerate 호출됨, prompt:", prompt)
    setLoading(true)
    try {
      // let poseImage = sceneRef.current?.capture()  ← 임시 주석
      let poseImage = null  // ← 추가

      if (!poseImage) {
        poseImage = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=512"

      }

      const result = await generateImage(poseImage, prompt)
      addGeneratedImage(result)
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
