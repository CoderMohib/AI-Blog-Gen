import { createContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// Provider component
export function ThemeProvider({ children }) {
  // Initialize state based on saved preference or system default
  const [isDark, setIsDark] = useState(() => {
    // This part runs once on component mount
    if (typeof window === "undefined") return false; // SSR safety

    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Use saved theme if it exists, otherwise use system preference
    return savedTheme === "dark" || (savedTheme === null && systemPrefersDark);
  });

  // Effect to apply the theme to the document and manage local storage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Effect to listen for system preference changes
  useEffect(() => {
    // Only listen for changes if there is NO saved theme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e) => {
      // Check if the user has not explicitly set a theme
      if (localStorage.getItem("theme") === null) {
        setIsDark(e.matches);
      }
    };
    
    // Check initial match and update if no saved theme
    if (localStorage.getItem("theme") === null) {
      setIsDark(mediaQuery.matches);
    }

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []); // Empty dependency array means this effect runs only once

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext };