import { useStore } from '../../store'
import { POSES } from '../avatar/poses'

/**
 * InputForm
 * - 성별, 신체지수(슬라이더+직접입력), 포즈 선택
 */
export default function InputForm() {
  const { 
    gender, 
    setGender, 
    metrics, 
    updateMetric, 
    currentPose, 
    setPose, 
    isLoading 
  } = useStore()

  const metricFields = [
    { id: 'height', label: '키', unit: 'cm', min: 150, max: 200 },
    { id: 'weight', label: '몸무게', unit: 'kg', min: 40, max: 120 },
    { id: 'chest', label: '가슴둘레', unit: 'cm', min: 70, max: 120 },
    { id: 'waist', label: '허리둘레', unit: 'cm', min: 60, max: 110 },
    { id: 'hip', label: '엉덩이둘레', unit: 'cm', min: 70, max: 120 },
  ]

  // 직접 입력 시 값 검증 및 업데이트 로직
  const handleInputChange = (id, value, min, max) => {
    let numValue = parseInt(value) || 0;
    // 너무 큰 값이 입력되지 않도록 제한 (가이드의 입력 검증 반영)
    if (numValue > max) numValue = max;
    updateMetric(id, numValue);
  };

  return (
    <div className="space-y-6 mb-8 animate-in fade-in slide-in-from-left duration-500">
      {/* 1. 성별 설정 */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          👤 성별 설정
        </h3>
        <div className="flex gap-2">
          {[{ id: 'male', name: '남성' }, { id: 'female', name: '여성' }].map((g) => (
            <button
              key={g.id}
              onClick={() => setGender(g.id)}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                gender === g.id
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-2'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200'
              } disabled:opacity-50`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">신체 정보 설정</h2>
      </div>

      {/* 2. 신체 지수 (슬라이더 + 직접 입력 창) */}
      <div className="space-y-6">
        {metricFields.map((field) => (
          <div key={field.id} className="group">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-gray-500">
                {field.label} ({field.unit})
              </label>
              {/* 직접 입력 가능한 Input창 추가 */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={metrics[field.id]}
                  disabled={isLoading}
                  onChange={(e) => handleInputChange(field.id, e.target.value, field.min, field.max)}
                  className="w-16 px-2 py-1 text-right font-black text-blue-600 border rounded bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <input
              type="range"
              min={field.min}
              max={field.max}
              value={metrics[field.id]}
              disabled={isLoading}
              onChange={(e) => updateMetric(field.id, +e.target.value)}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-30"
            />
          </div>
        ))}
      </div>

      {/* 3. 포즈 선택 */}
      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 mb-3">🧍 포즈 프리셋</h3>
        <div className="grid grid-cols-3 gap-2">
          {POSES.map((pose) => (
            <button
              key={pose.id}
              onClick={() => setPose(pose.id)}
              disabled={isLoading}
              className={`py-2.5 rounded-xl text-[11px] font-bold transition-all ${
                currentPose === pose.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
              } disabled:opacity-50`}
            >
              {pose.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}