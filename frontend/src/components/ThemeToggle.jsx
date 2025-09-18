import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }) {
  const { isDark, setIsDark } = useTheme();
//  hover:bg-border bg-card transition-colors duration-200
  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className={`
        flex items-center gap-2 
        px-6 py-1.5 text-[18px] rounded-xl
         text-text
        cursor-pointer
        ${className}
      `}
    >
      {isDark ? (
        <>
          <Moon className="w-6 h-6" /> <span>Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-6 h-6" /> <span>Light</span>
        </>
      )}
    </button>
  );
}
