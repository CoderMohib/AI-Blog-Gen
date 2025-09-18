import { useContext } from "react";
import { ThemeContext } from "../utils/context/ThemeContext";

export function useTheme() {
  return useContext(ThemeContext);
}