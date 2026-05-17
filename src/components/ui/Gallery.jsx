import { useState } from 'react'
import { useStore } from '../../store'

export default function Gallery() {
  const { generatedImages, clearImages, isDarkMode } = useStore()
  const [selectedImage, setSelectedImage] = useState(null)
  const [compareList, setCompareList] = useState([])
  const [isCompareMode, setIsCompareMode] = useState(false)

  // --- [핵심: 보안을 뚫고 즉시 저장하는 함수] ---
  const handleDownload = async (e, url, filename = 'fitting-result.png') => {
    e.stopPropagation();
    
    try {
      const img = new Image();
      img.crossOrigin = "anonymous"; // 보안 허용 요청
      img.src = url;

      img.onload = () => {
        // 가상 도화지(Canvas) 생성
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        
        // 도화지에 원본 이미지를 그림
        ctx.drawImage(img, 0, 0);

        // 도화지 내용을 내 로컬 데이터(PNG)로 변환 (CORS 우회 핵심)
        const dataUrl = canvas.toDataURL("image/png");
        
        // 가상 링크를 만들어 즉시 다운로드 실행
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      img.onerror = () => {
        // 캔버스 방식도 실패할 경우 (최후의 보루)
        window.open(url, '_blank');
      };
    } catch (error) {
      console.error("저장 실패:", error);
      window.open(url, '_blank');
    }
  }

  const toggleCompare = (e, img) => {
    e.stopPropagation();
    const isAlreadyIn = compareList.some(item => item.id === img.id);
    if (isAlreadyIn) {
      setCompareList(prev => prev.filter(item => item.id !== img.id));
    } else {
      if (compareList.length >= 2) {
        alert("최대 2개까지만 비교 가능합니다.");
        return;
      }
      setCompareList(prev => [...prev, img]);
    }
  }

  return (
    <div className="relative h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>갤러리</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsCompareMode(true)}
            disabled={compareList.length !== 2}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
              compareList.length === 2 
                ? 'bg-blue-600 text-white cursor-pointer shadow-md' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            비교하기 ({compareList.length}/2)
          </button>
          <button onClick={clearImages} className="text-[10px] text-red-400 font-bold hover:underline">비우기</button>
        </div>
      </div>

      {generatedImages.length === 0 ? (
        <div className="flex-1 border-2 border-dashed border-gray-300 rounded-3xl flex items-center justify-center">
          <p className="text-gray-400 text-sm italic">피팅 결과를 생성해 보세요 ✨</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 pb-20">
          {generatedImages.map((img) => {
            const isSelected = compareList.some(item => item.id === img.id);
            return (
              <div
                key={img.id}
                className={`group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  isSelected ? 'ring-4 ring-blue-500 scale-95' : 'hover:shadow-xl'
                }`}
                onClick={() => setSelectedImage(img.url)}
              >
                <img src={img.url} className="w-full h-full object-cover" alt="result" />
                <button
                  type="button"
                  onClick={(e) => toggleCompare(e, img)}
                  className={`absolute top-2 left-2 w-8 h-8 rounded-full border-2 flex items-center justify-center z-40 transition-all ${
                    isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'bg-black/30 border-white/50 text-transparent'
                  }`}
                > ✓ </button>
              </div>
            );
          })}
        </div>
      )}

      {/* --- 확대 모달 (저장 버튼 포함) --- */}
      {selectedImage && !isCompareMode && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} className="w-full h-auto max-h-[70vh] object-contain rounded-3xl shadow-2xl" alt="Zoom" />
            <div className="mt-6 flex gap-3">
              <button 
                onClick={(e) => handleDownload(e, selectedImage, 'fitting-zoom.png')} 
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
              >
                저장하기 💾
              </button>
              <button onClick={() => setSelectedImage(null)} className="px-8 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20">닫기</button>
            </div>
          </div>
        </div>
      )}

      {/* --- 비교 모드 (전체 화면) --- */}
      {isCompareMode && (
        <div className={`fixed inset-0 z-[600] flex flex-col p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
          <div className="flex justify-between items-center mb-6 w-full max-w-7xl mx-auto">
            <h2 className="text-3xl font-black italic text-blue-500 tracking-tighter">STYLE COMPARISON</h2>
            <button 
              onClick={() => setIsCompareMode(false)} 
              className="px-10 py-3 bg-gray-800 text-white rounded-full font-bold shadow-xl hover:bg-gray-700 transition-all"
            >
              EXIT
            </button>
          </div>
          
          <div className="flex-1 flex gap-8 items-center justify-center max-w-7xl mx-auto w-full overflow-hidden">
            {compareList.map((img, idx) => (
              <div key={img.id} className="flex-1 flex flex-col gap-4 h-full max-h-[85vh]">
                <div className="flex-1 min-h-0 rounded-[40px] overflow-hidden border-4 border-blue-500 bg-gray-50 shadow-2xl relative">
                  <img src={img.url} className="w-full h-full object-contain" alt={`compare-${idx}`} />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">STYLE 0{idx + 1}</div>
                </div>
                <button 
                  onClick={(e) => handleDownload(e, img.url, `style-0${idx+1}.png`)}
                  className="w-full py-5 bg-blue-600 text-white rounded-[20px] font-bold shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:bg-blue-700 transition-all active:scale-95"
                >
                  📥 이 스타일 저장
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}