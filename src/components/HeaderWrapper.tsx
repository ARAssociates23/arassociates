
import { Header as OriginalHeader } from "./Header";  
import { ThemeToggle } from "./theme-toggle";

export function Header(props: React.ComponentProps<typeof OriginalHeader>) {
  return (
    <div className="relative">
      <OriginalHeader {...props} />
      <div className="absolute right-4 top-2.5">
        <ThemeToggle />
      </div>
    </div>
  );
}
