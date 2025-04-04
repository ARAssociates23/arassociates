
import React, { useEffect, useState } from 'react';
import { Search, LogIn, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication status from localStorage
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const user = localStorage.getItem('user');
    
    setIsAuthenticated(authStatus);
    setUsername(user || '');
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    
    setIsAuthenticated(false);
    setUsername('');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    
    // Navigate to login page
    navigate('/login');
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
            Advanced Investor Search Portal
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
                  className="text-white border-white hover:bg-white hover:text-finance"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleLogin}
                className="text-white border-white hover:bg-white hover:text-finance flex items-center"
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
