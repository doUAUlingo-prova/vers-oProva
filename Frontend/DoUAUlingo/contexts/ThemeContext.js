import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

// 🎨 TEMAS FICAM AQUI
const darkTheme = {
  background: "#0a0a0a",
  card: "#1a1a1a",
  box: "#222",
  text: "#fff",
  subtext: "#aaa",
  muted: "#666",
  primary: "#e11d48",
  progressBg: "#333"
};

const lightTheme = {
  background: "#f5f5f5",
  card: "#ffffff",
  box: "#f0f0f0",
  text: "#000",
  subtext: "#555",
  muted: "#888",
  primary: "#e11d48",
  progressBg: "#ddd"
};

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(true);

  const toggleTheme = () => setDark(!dark);

  const theme = dark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);