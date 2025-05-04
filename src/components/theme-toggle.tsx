
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full w-10 h-10 bg-white/20 dark:bg-gray-800/60 backdrop-blur-lg border border-white/30 dark:border-gray-700/40 transition-all duration-300 hover:scale-110 shadow-md"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-amber-300 rotate-0 scale-100 transition-all duration-300" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-slate-700 rotate-0 scale-100 transition-all duration-300" />
      )}
    </Button>
  );
}
