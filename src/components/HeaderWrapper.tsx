
import { Header as OriginalHeader } from "./Header";  
import { ThemeToggle } from "./theme-toggle";

export function Header(props: React.ComponentProps<typeof OriginalHeader>) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-finance-light/30 to-transparent dark:from-finance-dark/30 dark:to-transparent backdrop-blur-sm z-0"></div>
      <div className="relative z-10">
        <OriginalHeader {...props} />
      </div>
      <div className="absolute right-4 top-2.5 z-20">
        <ThemeToggle />
      </div>
    </div>
  );
}
