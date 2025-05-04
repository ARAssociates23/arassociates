
import { Header as OriginalHeader } from "./Header";  
import { ThemeToggle } from "./theme-toggle";

export function Header(props: React.ComponentProps<typeof OriginalHeader>) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-finance-light/40 to-transparent dark:from-finance-dark/40 dark:to-transparent backdrop-blur-md z-0"></div>
      <div className="relative z-10 flex items-center px-4 py-2">
        <div className="flex-shrink-0 mr-4">
          <img 
            src="https://raw.githubusercontent.com/ARAssociates23/AR-Associates-logo/main/AR%20Associates%20Logo.png" 
            alt="AR Associates Logo" 
            className="h-10 w-auto object-contain"
          />
        </div>
        <OriginalHeader {...props} />
      </div>
      <div className="absolute right-4 top-2.5 z-20">
        <ThemeToggle />
      </div>
    </div>
  );
}
