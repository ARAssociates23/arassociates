
import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";

export function ThemeToggle() {
  // Always in dark mode, button is now just decorative
  return (
    <Button
      variant="outline"
      size="icon"
      className="theme-toggle-button rounded-full w-10 h-10 bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 transition-all duration-300 shadow-lg"
      aria-label="Dark theme"
      disabled
    >
      <Moon className="h-[1.2rem] w-[1.2rem] text-blue-200" />
    </Button>
  );
}
