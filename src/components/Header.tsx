
import React, { useEffect, useState } from 'react';
import { Search, LogIn, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { signOut, getCurrentSession } from '@/services/authService';
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';

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
    <div className="bg-finance text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Search className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">AR Associates</h1>
        </div>
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="text-sm opacity-80 mr-4">
            Advanced Client Search Portal
          </div>
          <div>
            {isAuthenticated ? (
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <User className="h-4 w-4 mr-2" />
                  <span className="text-sm">{username}</span>
                </div>
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  className="text-white border-white hover:bg-Black hover:text-finance"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleLogin}
                className="text-white border-white hover:bg-Black hover:text-finance flex items-center"
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
