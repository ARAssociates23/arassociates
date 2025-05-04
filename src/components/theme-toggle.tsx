
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  // No longer functional toggle, kept for UI consistency
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full w-10 h-10 bg-white/20 backdrop-blur-lg border border-white/30 transition-all duration-300 hover:scale-110 shadow-md"
      aria-label="Theme toggle (disabled)"
    >
      {/* No icon */}
    </Button>
  );
}
