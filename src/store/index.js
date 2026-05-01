import { create } from 'zustand'

/**
 * 전역 상태 관리 (Zustand)
 *
 * 사용 규칙:
 * - metrics: B가 쓰고, A가 읽음
 * - currentPose: B가 쓰고, A가 읽음
 * - generatedImages: C가 쓰고, B가 읽음
 * - isLoading: C가 쓰고, B가 읽음
 */
export const useStore = create((set) => ({
  // ===== 신체지수 =====
  metrics: {
    height: 175,    // cm
    weight: 70,     // kg
    chest: 92,      // cm
    waist: 80,      // cm
    hip: 95,        // cm
  },
  setMetrics: (metrics) => set({ metrics }),
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
        ...state.generatedImages,
        {
          id: Date.now(),
          url: image,
          createdAt: new Date().toISOString(),
        }
      ]
    })),
  clearImages: () => set({ generatedImages: [] }),

  // ===== 로딩 상태 =====
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}))
