import { useRef } from 'react'
import { useStore } from './store'
import AvatarScene from './components/avatar/AvatarScene'
import InputForm from './components/ui/InputForm'
import PromptPanel from './components/ui/PromptPanel'
import Gallery from './components/ui/Gallery'
import { generateImage } from './api/generate'

function App() {
  const sceneRef = useRef()
  // 1. store에서 gender(성별) 값을 가져옵니다. 
  // (store에 gender가 없다면 metrics 내부에 있거나 별도 상태로 관리되어야 합니다)
  const { metrics, currentPose, addGeneratedImage, setLoading, isDarkMode, toggleDarkMode, gender } = useStore()

  const handleGenerate = async (prompt) => {
    setLoading(true)
    try {
      // 1. 아바타 씬 캡처
      let poseImage = sceneRef.current?.capture()
      
      if (!poseImage) {
        poseImage = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=512"
      }

      // 2. AI 이미지 생성 API 호출
      const result = await generateImage(poseImage, prompt);
      
      if (result) {
        addGeneratedImage(result);
      }
    } catch (err) {
      console.error('피팅 생성 실패:', err)
      alert("생성 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`flex w-screen h-screen transition-colors duration-500 overflow-hidden ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      
      {/* 좌측 패널 */}
      <div className={`w-1/3 p-6 border-r overflow-y-auto z-10 transition-colors ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h1 className="text-2xl font-black mb-8 text-blue-500 italic tracking-tighter">3D VIRTUAL FITTING</h1>
        <InputForm />
        <PromptPanel onGenerate={handleGenerate} />
      </div>

      {/* 중앙 패널 (3D 아바타) */}
      <div className="flex-1 relative bg-gray-100 z-0 h-full">
        {/* [중요] AvatarScene에 gender props를 전달합니다. */}
        <AvatarScene 
          ref={sceneRef} 
          metrics={metrics} 
          pose={currentPose} 
          gender={gender} 
        />
      </div>

      {/* 우측 패널 (갤러리) */}
      <div className={`w-1/3 p-6 border-l overflow-y-auto relative z-30 transition-colors ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className="text-xl font-bold mb-6 text-blue-500 uppercase tracking-widest border-b pb-2">Fitting Gallery</h2>
        <Gallery />
      </div>

      {/* 다크모드 토글 버튼 */}
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