
import { Header as OriginalHeader } from "./Header";  
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Header(props: React.ComponentProps<typeof OriginalHeader>) {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    const { success } = await signOut();
    if (success) {
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };
  
  return (
    <div className="relative bg-blue-900/90 dark:bg-blue-950">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-blue-950/80 backdrop-blur-md z-0 dark:from-blue-950/80 dark:to-blue-900/60"></div>
      <div className="relative z-10 flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img 
              src="https://raw.githubusercontent.com/ARAssociates23/AR-Associates-logo/main/AR%20Associates%20Logo.png" 
              alt="AR Associates Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-white text-xs md:text-sm opacity-80">Advanced Client Search Portal</span>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-blue-800/50"
            onClick={handleLogout}
          >
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
