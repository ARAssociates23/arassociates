
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
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-finance-light/40 to-transparent backdrop-blur-md z-0"></div>
      <div className="relative z-10 flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-4">
            <img 
              src="https://raw.githubusercontent.com/ARAssociates23/AR-Associates-logo/main/AR%20Associates%20Logo.png" 
              alt="AR Associates Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>
          <OriginalHeader {...props} />
        </div>
        
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 text-finance hover:bg-finance-light/50"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </div>
  );
}
