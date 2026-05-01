import { useState } from 'react'
import { useStore } from '../../store'

/**
 * PromptPanel
 * - 옷 프롬프트 입력 (B 담당)
 *
 * TODO:
 *   - 프리셋 프롬프트 라이브러리 확장 (C와 협업)
 *   - 좋아요/저장 기능
 */

const PROMPT_PRESETS = [
  '검정 오버사이즈 후드티, 면',
  '흰색 티셔츠, 슬림핏',
  '베이지 트렌치코트',
  '데님 자켓, 빈티지',
  '블랙 가죽자켓',
  '니트 스웨터, 크림색',
]

export default function PromptPanel({ onGenerate }) {
  const [prompt, setPrompt] = useState('')
  const isLoading = useStore((s) => s.isLoading)

  const handleClick = () => {
    if (!prompt.trim()) return
    onGenerate(prompt)
  }

  return (
    <div className="space-y-3 border-t pt-4">
      <h2 className="text-lg font-semibold">옷 입혀보기</h2>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="원하는 옷을 자유롭게 묘사하세요. 예: 검정 후드티, 면 소재, 오버핏"
        className="w-full p-2 border rounded text-sm"
        rows={3}
      />

      <div>
        <p className="text-xs text-gray-500 mb-1">빠른 선택:</p>
        <div className="flex flex-wrap gap-1">
          {PROMPT_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => setPrompt(preset)}
              className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleClick}
        disabled={isLoading || !prompt.trim()}
        className="w-full py-2 bg-blue-500 text-white rounded font-semibold disabled:bg-gray-300"
      >
        {isLoading ? '생성 중...' : '옷 입혀보기'}
      </button>
    </div>
  )
}
