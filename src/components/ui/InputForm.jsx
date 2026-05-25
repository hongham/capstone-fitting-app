// src/components/ui/InputForm.jsx
import React from 'react'
import { useStore } from '../../store'

const InputForm = () => {
  // Zustand 스토어에서 전역 신체지수 상태와 수치 변경 함수(updateMetric) 로드
  const { metrics, updateMetric, gender, setGender } = useStore()

  // 슬라이더 리스트 렌더링을 위한 데이터셋 정의
  const sliderItems = [
    { id: 'height', label: '키 (cm)', min: 150, max: 200 },
    { id: 'shoulder', label: '어깨 너비 (cm)', min: 35, max: 60 },
    { id: 'chest', label: '가슴 둘레 (cm)', min: 70, max: 120 },
    { id: 'waist', label: '허리 둘레 (cm)', min: 60, max: 110 },
    { id: 'hip', label: '엉덩이 둘레 (cm)', min: 70, max: 120 }
  ]

  const handleSliderChange = (id, value) => {
    console.log(`📏 [수치 조작 변동] 슬라이더 ID: ${id} ➡️ 변경값: ${value}`)
    updateMetric(id, value)
  }

  return (
    <div className="space-y-6">
      {/* 1. 성별 선택 영역 */}
      {/* 🛠️ [색상 복구] 탁한 bg-slate-900/10을 제거하고 라이트모드에서 완벽한 화이트(bg-white), 다크모드에서 세련된 그레이(dark:bg-gray-800/50)로 원상복구 */}
      <div className="bg-white dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <label className="block text-xs font-black mb-3 tracking-wider text-gray-400 uppercase">GENDER / 성별</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setGender('male')}
            className={`py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              gender === 'male'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20 border-2 border-blue-400'
                : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            👨 남성 (Male)
          </button>
          <button
            type="button"
            onClick={() => setGender('female')}
            className={`py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              gender === 'female'
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20 border-2 border-pink-400'
                : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            👩 여성 (Female)
          </button>
        </div>
      </div>

      {/* 2. 신체 치수 조절 슬라이더 영역 */}
      {/* 🛠️ [색상 복구] 칙칙한 회색빛 찌꺼기를 지우고 본래의 화사하고 깨끗한 레이아웃 테마로 정돈 */}
      <div className="bg-white dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-5">
        <label className="block text-xs font-black mb-1 tracking-wider text-gray-400 uppercase">BODY METRICS / 신체 치수</label>
        
        {sliderItems.map((item) => (
          <div key={item.id} className="flex flex-col space-y-2 py-1 border-b border-gray-50 dark:border-gray-800/60 last:border-none">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{item.label}</span>
              <span className="text-xs font-black text-blue-500 font-mono bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-md border border-blue-100 dark:border-blue-900/30">
                {metrics[item.id]} <span className="text-[9px] text-gray-400 dark:text-slate-500 font-normal">cm</span>
              </span>
            </div>
            
            <input
              type="range"
              min={item.min}
              max={item.max}
              value={metrics[item.id] || item.min}
              onChange={(e) => handleSliderChange(item.id, Number(e.target.value))}
              className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default InputForm