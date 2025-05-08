
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

export const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      const hasSession = !!data.session;
      setIsAuthenticated(hasSession);
      
      if (!hasSession) {
        console.log("No active session found, redirecting to login");
        navigate('/login');
        return;
      }
      
      setIsAuthChecking(false);
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      const isAuth = !!session;
      setIsAuthenticated(isAuth);
      
      if (!isAuth && event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { isAuthenticated, isAuthChecking };
};
