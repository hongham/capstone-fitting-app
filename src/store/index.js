import { create } from 'zustand'

/**
 * 전역 상태 관리 (Zustand)
 */
export const useStore = create((set) => ({
  // ===== 테마 설정 =====
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  // ===== 성별 설정 =====
  gender: 'male', 
  setGender: (gender) => set({ gender }),

  // ===== 신체지수 =====
  metrics: {
    height: 182,
    weight: 75,
    shoulder: 45,
    chest: 92,
    waist: 80,
    hip: 95,
  },
  updateMetric: (key, value) =>
    set((state) => ({
      metrics: { ...state.metrics, [key]: value }
    })),

  // ===== 현재 포즈 =====
  currentPose: 'idle',
  setPose: (pose) => set({ currentPose: pose }),

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
  setLoading: (isLoading) => set({ isLoading }),
}))
