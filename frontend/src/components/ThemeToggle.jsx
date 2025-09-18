import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { isDark, setIsDark } = useTheme();

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="px-4 py-2 rounded bg-primary text-white"
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
