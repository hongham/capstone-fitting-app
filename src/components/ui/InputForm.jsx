import { useStore } from '../../store'
import { POSES } from '../avatar/poses'

/**
 * InputForm
 * - 신체지수 입력 (B 담당)
 *
 * TODO:
 *   - 더 예쁜 슬라이더로 교체
 *   - 입력 검증 (음수, 비현실적 값 방지)
 *   - 모바일 반응형
 */
export default function InputForm() {
  const { metrics, updateMetric, currentPose, setPose } = useStore()

  return (
    <div className="space-y-4 mb-6">
      <h2 className="text-lg font-semibold">신체 정보</h2>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          키: {metrics.height} cm
        </label>
        <input
          type="range"
          min={150}
          max={200}
          value={metrics.height}
          onChange={(e) => updateMetric('height', +e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          몸무게: {metrics.weight} kg
        </label>
        <input
          type="range"
          min={40}
          max={120}
          value={metrics.weight}
          onChange={(e) => updateMetric('weight', +e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          가슴둘레: {metrics.chest} cm
        </label>
        <input
          type="range"
          min={70}
          max={120}
          value={metrics.chest}
          onChange={(e) => updateMetric('chest', +e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          허리둘레: {metrics.waist} cm
        </label>
        <input
          type="range"
          min={60}
          max={110}
          value={metrics.waist}
          onChange={(e) => updateMetric('waist', +e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          엉덩이둘레: {metrics.hip} cm
        </label>
        <input
          type="range"
          min={70}
          max={120}
          value={metrics.hip}
          onChange={(e) => updateMetric('hip', +e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold mt-4 mb-2">포즈 선택</h3>
        <div className="flex flex-wrap gap-2">
          {POSES.map((pose) => (
            <button
              key={pose.id}
              onClick={() => setPose(pose.id)}
              className={`px-3 py-1 rounded text-sm ${
                currentPose === pose.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {pose.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
