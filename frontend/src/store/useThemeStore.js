import { create } from "zustand";

export const useThemeStore = create((set) => ({
//  store the theme in local storage of the browser
  theme: localStorage.getItem("chat-theme") || "Forest",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));