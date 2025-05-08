
import { Header as OriginalHeader } from "./Header";  
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Header(props: React.ComponentProps<typeof OriginalHeader>) {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    toast.loading("Logging out...");
    const { success } = await signOut();
    if (!success) {
      toast.error("Failed to log out");
    }
  };
  
  return (
    <div className="relative bg-gradient-to-r from-blue-900 to-blue-950 dark:from-slate-900 dark:to-slate-950 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-blue-950/80 backdrop-blur-md z-0 dark:from-blue-950/80 dark:to-blue-900/60"></div>
      <div className="relative z-10 flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-1.5 bg-white/90 rounded-md shadow-lg">
            <img 
              src="https://raw.githubusercontent.com/ARAssociates23/AR-Associates-logo/main/AR%20Associates%20Logo.png" 
              alt="AR Associates Logo" 
              className="h-10 w-auto object-contain transition-all duration-300"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-blue-100 text-xs md:text-sm opacity-90">Advanced Client Search</span>
          <Button 
            variant="ghost" 
            className="text-blue-100 hover:text-white hover:bg-blue-800/50 transition-all"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
