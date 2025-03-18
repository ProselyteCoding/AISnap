import { create } from "zustand"

interface AISnapState {
  content: string
  setContent: (content: string) => void
  template: string
  setTemplate: (template: string) => void
  isCapturing: boolean
  setIsCapturing: (isCapturing: boolean) => void
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export const useStore = create<AISnapState>((set) => ({
  // Content state
  content: "",
  setContent: (content) => set({ content }),

  // Template state
  template: "default",
  setTemplate: (template) => set({ template }),

  // UI states
  isCapturing: false,
  setIsCapturing: (isCapturing) => set({ isCapturing }),

  // Theme state
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}))

