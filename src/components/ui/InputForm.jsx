import React from 'react'
import { useStore } from '../../store'
import { POSES } from '../avatar/poses'

export default function InputForm() {
  const { gender, setGender, metrics, updateMetric, currentPose, setPose, isLoading } = useStore()

  const metricFields = [
    { id: 'height', label: '키', unit: 'cm', min: 150, max: 200 },
    { id: 'shoulder', label: '어깨 너비', unit: 'cm', min: 30, max: 60 },
    { id: 'chest', label: '가슴둘레', unit: 'cm', min: 70, max: 120 },
    { id: 'waist', label: '허리둘레', unit: 'cm', min: 60, max: 110 },
    { id: 'hip', label: '엉덩이둘레', unit: 'cm', min: 70, max: 120 },
  ]

  return (
    <div className="space-y-6 mb-8 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* 성별 선택 */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">👤 성별 설정</h3>
        <div className="flex gap-2">
          {[{ id: 'male', name: '남성' }, { id: 'female', name: '여성' }].map((g) => (
            <button
              key={g.id}
              onClick={() => setGender(g.id)}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                gender === g.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-500 border'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* 신체 지수 조절 */}
      <div className="space-y-6 pt-4 border-t border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">신체 정보 설정</h2>
        {metricFields.map((field) => {
          // 핵심: 현재 metrics에 값이 없으면 field의 기본 범위를 고려해 값을 강제 표시
          const displayValue = metrics[field.id] !== undefined ? metrics[field.id] : 
                               (field.id === 'shoulder' ? 45 : 
                                field.id === 'height' ? 175 : 85);

          return (
            <div key={field.id} className="group">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-gray-500">
                  {field.label} ({field.unit})
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={displayValue}
                    disabled={isLoading}
                    onChange={(e) => updateMetric(field.id, parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-right font-black text-blue-600 border rounded bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
              <input
                type="range"
                min={field.min}
                max={field.max}
                value={displayValue}
                disabled={isLoading}
                onChange={(e) => updateMetric(field.id, parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}