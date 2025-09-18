import { createContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// Provider component
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false; 
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return savedTheme === "dark" || (savedTheme === null && systemPrefersDark);
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e) => {
      // Check if the user has not explicitly set a theme
      if (localStorage.getItem("theme") === null) {
        setIsDark(e.matches);
      }
    };
    if (localStorage.getItem("theme") === null) {
      setIsDark(mediaQuery.matches);
    }

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []); 

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext };