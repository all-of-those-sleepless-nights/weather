import { createContext } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "todays-weather.theme";

export type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);
