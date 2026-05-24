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
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const dataUrl = canvas.toDataURL("image/png");
        
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      img.onerror = () => {
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
        <div className="grid grid-cols-2 gap-4 pb-20 overflow-y-auto">
          {generatedImages.map((img) => {
            const isSelected = compareList.some(item => item.id === img.id);
            return (
              <div
                key={img.id}
                className={`group relative w-full aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  isSelected ? 'ring-4 ring-blue-500 scale-95' : 'hover:shadow-xl'
                }`}
                onClick={() => setSelectedImage(img.url)}
              >
                <img src={img.url} className="w-full h-full object-cover block" alt="result" />
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

      {/* --- 확대 모달 (정사각형 비율 고정 수정) --- */}
      {selectedImage && !isCompareMode && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-lg w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            
            {/* 🛠️ [여기 수정 1] aspect-square와 object-contain을 주어 모달창에서도 무조건 1:1 정사각형 유지 */}
            <div className="w-full aspect-square bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
              <img src={selectedImage} className="w-full h-full object-contain" alt="Zoom" />
            </div>

            <div className="mt-6 flex gap-3 w-full max-w-md">
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

      {/* --- 비교 모드 (정사각형 비율 고정 수정) --- */}
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
              <div key={img.id} className="flex-1 flex flex-col gap-4 h-full max-h-[80vh] items-center justify-center">
                
                {/* 🛠️ [여기 수정 2] 비교 모드 카드 프레임을 가로 세로 1:1 정방형 박스로 제한하고 강제 늘어남 현상 제거 */}
                <div className="w-full aspect-square max-w-[60vh] rounded-[40px] overflow-hidden border-4 border-blue-500 bg-gray-900 shadow-2xl relative flex items-center justify-center">
                  <img src={img.url} className="w-full h-full object-contain" alt={`compare-${idx}`} />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">STYLE 0{idx + 1}</div>
                </div>

                <button 
                  onClick={(e) => handleDownload(e, img.url, `style-0${idx+1}.png`)}
                  className="w-full max-w-[60vh] py-5 bg-blue-600 text-white rounded-[20px] font-bold shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:bg-blue-700 transition-all active:scale-95"
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