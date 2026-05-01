import { useStore } from '../../store'

/**
 * Gallery
 * - 생성된 이미지 갤러리 (B 담당)
 *
 * TODO:
 *   - 이미지 클릭 시 확대 모달
 *   - 즐겨찾기, 비교 기능
 *   - 다운로드 버튼
 */
export default function Gallery() {
  const { generatedImages, clearImages } = useStore()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">갤러리</h2>
        {generatedImages.length > 0 && (
          <button
            onClick={clearImages}
            className="text-xs text-red-500"
          >
            모두 지우기
          </button>
        )}
      </div>

      {generatedImages.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-12">
          생성된 이미지가 없습니다.<br />
          좌측에서 옷을 입혀보세요.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {generatedImages.map((img) => (
            <div
              key={img.id}
              className="aspect-[3/4] bg-gray-100 rounded overflow-hidden"
            >
              <img
                src={img.url}
                alt="Generated"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
