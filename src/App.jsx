import { useRef } from 'react'
import { useStore } from './store'
import AvatarScene from './components/avatar/AvatarScene'
import InputForm from './components/ui/InputForm'
import PromptPanel from './components/ui/PromptPanel'
import Gallery from './components/ui/Gallery'
import { generateImage } from './api/generate'

function App() {
  const sceneRef = useRef()
  const { metrics, currentPose, addGeneratedImage, setLoading, isDarkMode, toggleDarkMode } = useStore()

  const handleGenerate = async (prompt) => {
    setLoading(true)
    try {
      // 1. 아바타 씬 캡처 (A 친구 로직 적용)
      const poseImage = sceneRef.current?.capture()
      if (!poseImage) {
        console.warn('Scene not ready')
        return
      }

      // 2. AI 이미지 생성 요청 (C 친구 API 연동)
      const result = await generateImage(poseImage, prompt);
      
      // 3. 결과 갤러리에 추가
      if (result) {
        addGeneratedImage(result);
      }
    } catch (err) {
      console.error('생성 실패:', err)
      alert("이미지 생성 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`flex w-screen h-screen transition-colors duration-500 overflow-hidden ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      
      {/* 좌측 패널 (B님 UI) */}
      <div className={`w-1/3 p-6 border-r overflow-y-auto z-10 transition-colors ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h1 className="text-2xl font-black mb-8 text-blue-500 italic tracking-tighter">3D VIRTUAL FITTING</h1>
        <InputForm />
        <PromptPanel onGenerate={handleGenerate} />
      </div>

      {/* 중앙 3D 씬 (A님 로직) */}
      <div className="w-1/3 relative z-0">
        <AvatarScene ref={sceneRef} metrics={metrics} pose={currentPose} />
      </div>

      {/* 우측 갤러리 패널 (B님 UI) */}
      <div className={`w-1/3 p-6 border-l overflow-y-auto relative z-30 transition-colors ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className="text-xl font-bold mb-6 text-blue-500 uppercase tracking-widest border-b pb-2">Fitting Gallery</h2>
        <Gallery />
      </div>

      {/* 다크모드 버튼 (B님 UI) */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          toggleDarkMode();
        }}
        className="fixed bottom-8 right-8 z-[100] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl border-2 bg-white dark:bg-gray-800 border-blue-500 transition-transform active:scale-90"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  )
}

export default App