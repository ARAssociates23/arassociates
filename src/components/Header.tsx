
import React, { useEffect, useState } from 'react';
import { LogIn, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { signOut, getCurrentSession } from '@/services/authService';
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { success, session } = await getCurrentSession();
      setIsAuthenticated(success);
      if (success && session) {
        setUsername(session.user?.email || '');
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
        setUsername(session?.user?.email || '');
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    const { success } = await signOut();
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="bg-[#003366] bg-gradient-to-r from-[#003366] to-[#004080] text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0 justify-center w-full sm:w-auto">
          <div className="bg-white rounded-lg p-2 flex justify-center items-center">
            <div className="flex flex-col items-center">
              {/* Adding error handling for the image */}
              <img 
                src="/images/AR Associates Logo.png" 
                alt="AR Associates" 
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  console.error('Logo failed to load');
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-[#003366] font-semibold text-sm mt-1">AR Associates</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto space-y-3 sm:space-y-0">
          <div className="text-center sm:text-left text-sm opacity-80 sm:mr-6 mb-2 sm:mb-0">
            Advanced Client Search Portal
          </div>
          
          <div className="w-full sm:w-auto">
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">
                <div className="flex items-center sm:mr-4 text-sm">
                  <User className="h-4 w-4 mr-2" />
                  <span className="truncate max-w-[180px]">{username}</span>
                </div>
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  className="text-white border-white hover:bg-white hover:text-[#003366] bg-[#003366]/50 w-full sm:w-auto"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleLogin}
                className="text-white border-white hover:bg-white hover:text-[#003366] flex items-center w-full sm:w-auto justify-center"
                size="sm"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
