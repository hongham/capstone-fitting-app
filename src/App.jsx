import { useRef } from 'react'
import { useStore } from './store'
import AvatarScene from './components/avatar/AvatarScene'
import InputForm from './components/ui/InputForm'
import PromptPanel from './components/ui/PromptPanel'
import Gallery from './components/ui/Gallery'
// import { generateImage } from './api/generate'  // C 모듈 완성 후 활성화

function App() {
  const sceneRef = useRef()
  const { metrics, currentPose, addGeneratedImage, setLoading } = useStore()

  const handleGenerate = async (prompt) => {
    setLoading(true)
    try {
      // 1. A 모듈: 현재 화면 캡처
      const poseImage = sceneRef.current?.capture()
      if (!poseImage) {
        console.warn('Scene not ready')
        return
      }

      // 2. C 모듈: API 호출 (구현 후 주석 해제)
      // const result = await generateImage(poseImage, prompt)
      // addGeneratedImage(result)

      // 임시: 캡처된 이미지를 갤러리에 그대로 추가
      addGeneratedImage(poseImage)
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
