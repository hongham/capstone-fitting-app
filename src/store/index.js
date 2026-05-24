import { create } from 'zustand'

export const useStore = create((set) => ({
  // ===== 테마 설정 =====
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  // ===== 성별 설정 =====
  gender: 'male', 
  setGender: (gender) => set({ gender }),

  // ===== 신체지수 =====
  metrics: {
    height: 175,
    shoulder: 45,
    chest: 95,
    waist: 85,
    hip: 95,
  },
  updateMetric: (id, value) =>
    set((state) => ({
      metrics: { ...state.metrics, [id]: value }
    })),

  // ===== 🛠️ [핵심 추가] 프론트-백엔드 직통 프롬프트 파이프라인 =====
  currentPrompt: '',
  setPrompt: (currentPrompt) => set({ currentPrompt }),

  // ===== 현재 포즈 =====
  currentPose: 'idle',
  setPose: (poseId) => set({ currentPose: poseId }),

  // ===== 생성 결과 =====
  generatedImages: [],
  addGeneratedImage: (image) =>
    set((state) => ({
      generatedImages: [
        {
          id: Date.now(),
          url: image,
          createdAt: new Date().toISOString(),
        },
        ...state.generatedImages,
      ]
    })),
  clearImages: () => set({ generatedImages: [] }),

  // ===== 로딩 상태 =====
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}))