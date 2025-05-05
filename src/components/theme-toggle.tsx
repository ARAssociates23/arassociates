
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="outline"
      size="icon"
      className="theme-toggle-button rounded-full w-10 h-10 bg-white/40 dark:bg-slate-800/60 backdrop-blur-lg border border-white/30 dark:border-slate-700/50 transition-all duration-300 hover:scale-110 shadow-lg"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-amber-200" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-blue-900" />
      )}
    </Button>
  );
}
