import { useState, useEffect } from 'react'
import { useStore } from '../../store'

// 카테고리별 태그 데이터
const PROMPT_TAGS = {
  상의: ['티셔츠', '셔츠', '후드티', '니트', '맨투맨', '자켓', '코트'],
  하의: ['슬랙스', '청바지', '치노팬츠', '와이드팬츠', '반바지'],
  스타일: ['오버핏', '슬림핏', '스트릿', '미니멀', '빈티지'],
  소재: ['면', '데님', '가죽', '린넨', '캐시미어']
}

const LOADING_STEPS = [
  '아바타 포즈 분석 중...',
  '의상 실루엣 생성 중...',
  '원단 질감 입히는 중...',
  '디테일 마무리 중...'
]

export default function PromptPanel({ onGenerate }) {
  const [prompt, setPrompt] = useState('')
  const [stepIndex, setStepIndex] = useState(0)
  
  // 💡 Zustand 전역 스토어에서 로딩 상태와 프롬프트 저장 함수 가져오기
  const isLoading = useStore((state) => state.isLoading)
  const setGlobalPrompt = useStore((state) => state.setPrompt)

  // 태그 클릭 시 프롬프트에 추가하는 함수
  const handleTagClick = (tag) => {
    if (isLoading) return
    setPrompt((prev) => {
      const trimmed = prev.trim()
      if (!trimmed) return tag
      if (trimmed.includes(tag)) return prev // 이미 있으면 추가 안 함
      return `${trimmed}, ${tag}` // 쉼표로 구분하여 추가
    })
  }

  useEffect(() => {
    let interval;
    if (isLoading) {
      setStepIndex(0);
      interval = setInterval(() => {
        setStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 1500); 
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="space-y-4 border-t pt-6 mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">옷 입혀보기</h2>
        <button 
          onClick={() => setPrompt('')}
          className="text-[10px] text-gray-400 hover:text-red-500 underline"
        >
          초기화
        </button>
      </div>

      {/* 프롬프트 입력창 */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="태그를 클릭하거나 직접 묘사하세요."
        className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
        rows={3}
        disabled={isLoading}
      />

      {/* 태그 추천 섹션 */}
      <div className="space-y-3">
        {Object.entries(PROMPT_TAGS).map(([category, tags]) => (
          <div key={category}>
            <p className="text-[10px] font-bold text-gray-400 mb-1.5 ml-1">{category}</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  disabled={isLoading}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    prompt.includes(tag)
                      ? 'bg-blue-100 text-blue-600 border-blue-200 border'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'
                  } disabled:opacity-50`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 생성 버튼 */}
      <button
        onClick={() => {
          setGlobalPrompt(prompt); // 🛠️ 버튼 누르는 순간 한글 텍스트를 Zustand 전역 저장소에 즉시 각인
          onGenerate(prompt);      // 이후 이미지 생성 트리거 작동
        }}
        disabled={isLoading || !prompt.trim()}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
          isLoading 
            ? 'bg-amber-400 text-amber-900 scale-95' 
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg active:scale-95'
        }`}
      >
        {isLoading ? (
          <div className="flex flex-col items-center">
            <span className="animate-pulse">✨ {LOADING_STEPS[stepIndex]}</span>
          </div>
        ) : (
          '지금 피팅하기'
        )}
      </button>
    </div>
  )
}