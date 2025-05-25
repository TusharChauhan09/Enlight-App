import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "forest", // default theme
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
  loadTheme: () => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("chat-theme");
      if (storedTheme) {
        set({ theme: storedTheme });
      }
    }
  },
}));
