import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ViewMode } from "@/types/patient";

interface UIState {
  viewMode: ViewMode;
  sidebarOpen: boolean;
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      viewMode: "grid",
      sidebarOpen: true,
      setViewMode: (viewMode) => set({ viewMode }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    { name: "healthcare-ui" }
  )
);
