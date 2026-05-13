import { useRef } from 'react'
import { useStore } from './store'
import AvatarScene from './components/avatar/AvatarScene'
import InputForm from './components/ui/InputForm'
import PromptPanel from './components/ui/PromptPanel'
import Gallery from './components/ui/Gallery'
import { generateImage } from './api/generate'

const handleGenerate = async (prompt) => {
  console.log("handleGenerate 호출됨, prompt:", prompt) // 추가
  setLoading(true)
  try {
    let poseImage = sceneRef.current?.capture()
    console.log("poseImage:", poseImage) // 추가

    if (!poseImage) {
      poseImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=512"
    }

    const result = await generateImage(poseImage, prompt)
    addGeneratedImage(result)
  } catch (err) {
    console.error('Generation failed:', err)
  } finally {
    setLoading(false)
  }
}

function App() {
  const sceneRef = useRef()
  const { metrics, currentPose, addGeneratedImage, setLoading } = useStore()

  const handleGenerate = async (prompt) => {
    setLoading(true)
    try {
      let poseImage = sceneRef.current?.capture()

      // 아바타 미완성이면 임시 이미지 사용
      if (!poseImage) {
        poseImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=512"
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
      {/* 좌측: 입력 폼 + 프롬프트 */}
      <div className="w-1/3 p-4 border-r overflow-y-auto bg-white">
        <h1 className="text-xl font-bold mb-4">3D Virtual Fitting</h1>
        <InputForm />
        <PromptPanel onGenerate={handleGenerate} />
      </div>

      {/* 중앙: 3D 씬 */}
      <div className="w-1/3 relative bg-gray-100">
        <AvatarScene ref={sceneRef} metrics={metrics} pose={currentPose} />
      </div>

      {/* 우측: 갤러리 */}
      <div className="w-1/3 p-4 border-l overflow-y-auto bg-white">
        <Gallery />
      </div>
    </div>
  )
}

export default App
