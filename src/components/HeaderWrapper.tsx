
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
    try {
      const { success } = await signOut();
      if (!success) {
        toast.error("Failed to log out");
      }
      // We no longer need to navigate as signOut will handle the redirection
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An unexpected error occurred during logout");
    }
  };
  
  return (
    <div className="relative">
      {/* Blurred background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-950/90 backdrop-blur-md z-0"></div>
      
      {/* Header content */}
      <div className="relative z-10 flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center flex-shrink-0">
          <div className="flex-shrink-0 p-1 sm:p-1.5 bg-white/90 rounded-md shadow-lg">
            <img 
              src="https://raw.githubusercontent.com/ARAssociates23/AR-Associates-logo/main/AR%20Associates%20Logo.png" 
              alt="AR Associates Logo" 
              className="h-8 sm:h-10 w-auto object-contain transition-all duration-300"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <span className="text-blue-100 text-xs sm:text-sm opacity-90 hidden sm:block">Advanced Client Search</span>
          <Button 
            variant="ghost" 
            className="text-blue-100 hover:text-white hover:bg-blue-800/50 transition-all text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
            onClick={handleLogout}
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
