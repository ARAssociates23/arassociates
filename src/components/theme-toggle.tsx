
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full w-10 h-10 bg-white/20 dark:bg-white/10 backdrop-blur-lg border border-white/10 transition-all duration-300 hover:scale-110 shadow-lg"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-white" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-blue-900" />
      )}
    </Button>
  );
}
