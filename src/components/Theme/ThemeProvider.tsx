"use client";
import { createContext, useContext, useState } from "react";
type Theme = "light";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: "light", toggle: () => {} });
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useState<Theme>("light");
  return <ThemeContext.Provider value={{ theme, toggle: () => {} }}><div data-theme={theme}>{children}</div></ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
