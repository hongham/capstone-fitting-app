// src/App.jsx
import { useRef } from 'react'
import { useStore } from './store'
import AvatarScene from './components/avatar/AvatarScene'
import InputForm from './components/ui/InputForm'
import PromptPanel from './components/ui/PromptPanel'
import Gallery from './components/ui/Gallery'
import { generateImage } from './api/generate'

function App() {
  const sceneRef = useRef()
  
  // Zustand 스토어에서 필요한 전역 상태값 로드
  const { metrics, currentPose, addGeneratedImage, setLoading, isDarkMode, toggleDarkMode, gender } = useStore()

  // PromptPanel에서 버튼 누를 때 인자로 넘어오는 최신 텍스트(currentRawPrompt) 수급
  const handleGenerate = async (currentRawPrompt) => {
    if (!currentRawPrompt || !currentRawPrompt.trim()) {
      alert("의상 스타일을 입력하거나 태그를 선택해주세요.")
      return
    }

    setLoading(true)
    try {
      console.log("🎯 [App.jsx -> 백엔드] 다이렉트 주입 텍스트:", currentRawPrompt)

      // 아바타 씬 캡처
      let poseImage = sceneRef.current?.capture()
      
      if (!poseImage) {
        poseImage = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=512"
      }

      // 인자값 최신 문자열을 그대로 백엔드 API에 꽂아 연동
      const result = await generateImage(poseImage, currentRawPrompt, gender)
      
      if (result) {
        addGeneratedImage(result)
      }
    } catch (err) {
      console.error('피팅 생성 실패:', err)
      alert("생성 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally { // 💡 [오타 수정] 기존 final { 에서 finally { 로 완벽 수정 완료!
      setLoading(false)
    }
  }

  return (
    <div className={`flex w-screen h-screen transition-colors duration-500 overflow-hidden ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      
      {/* 좌측 패널 (조작창) */}
      <div className={`w-1/3 p-6 border-r overflow-y-auto z-10 transition-colors ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h1 className="text-2xl font-black mb-8 text-blue-500 italic tracking-tighter">3D VIRTUAL FITTING</h1>
        <InputForm />
        <PromptPanel onGenerate={handleGenerate} />
      </div>

      {/* 중앙 패널 (3D 아바타) */}
      <div className="flex-1 relative bg-gray-100 z-0 h-full">
        <AvatarScene 
          ref={sceneRef} 
          metrics={metrics} 
          pose={currentPose} 
          gender={gender} 
        />
      </div>

      {/* 우측 패널 (갤러리 결과창) */}
      <div className={`w-1/3 p-6 border-l overflow-y-auto relative z-30 transition-colors ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className="text-xl font-bold mb-6 text-blue-500 uppercase tracking-widest border-b pb-2">Fitting Gallery</h2>
        <Gallery />
      </div>

      {/* 다크모드 토글 버튼 */}
      <button 
        onClick={(e) => {
          e.stopPropagation()
          toggleDarkMode()
        }}
        className="fixed bottom-8 right-8 z-[100] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl border-2 bg-white dark:bg-gray-800 border-blue-500 transition-transform active:scale-90"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  )
}

export default App