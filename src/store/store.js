import { create } from 'zustand'

export const useStore = create((set) => ({
  metrics: {
    height: 175,    // 키: 175cm (적당한 높이)
    shoulder: 45,   // 어깨: 45cm (슬라이더 중간)
    chest: 95,      // 가슴: 95cm
    waist: 85,      // 허리: 85cm (너무 마르지 않은 수치)
    hip: 95,        // 엉덩이: 95cm
  },
  gender: 'male',
  currentPose: 'pose1',
  generatedImages: [],
  isLoading: false,
  isDarkMode: false,

  setGender: (gender) => set({ gender }),
  setPose: (poseId) => set({ currentPose: poseId }),
  updateMetric: (id, value) => set((state) => ({
    metrics: { ...state.metrics, [id]: value }
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  addGeneratedImage: (url) => set((state) => ({ 
    generatedImages: [url, ...state.generatedImages] 
  })),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}))