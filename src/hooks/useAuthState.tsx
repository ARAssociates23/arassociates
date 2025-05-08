
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { signIn, signUp, LoginCredentials, SignUpCredentials, cleanupAuthState } from '@/services/authService';
import { toast } from "sonner";

export const useAuthState = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session && isMounted) {
          // Prevent immediate redirect to avoid flickering
          setTimeout(() => {
            if (isMounted && window.location.pathname === '/login') {
              navigate('/');
            }
          }, 100);
        }
      } catch (err) {
        // Handle error silently
        console.error("Error checking authentication:", err);
        // Clean up auth state to be safe
        cleanupAuthState();
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in login:", event);
      if (event === 'SIGNED_IN' && session && isMounted) {
        // Use timeout to prevent immediate redirect
        setTimeout(() => {
          if (isMounted && window.location.pathname === '/login') {
            navigate('/');
          }
        }, 100);
      }
    });
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = async (credentials: LoginCredentials) => {
    setError('');
    setLoading(true);
    
    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn(credentials);
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
      // Successful login is handled by the signIn function and auth state listener
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (credentials: SignUpCredentials) => {
    setError('');
    setLoading(true);
    
    if (!credentials.email || !credentials.password) {
      setError('Please enter email and password');
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(credentials);
      
      if (result.success) {
        toast.success("Registration Successful", {
          description: "Please check your email for verification link"
        });
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    isCheckingAuth,
    handleLogin,
    handleSignUp
  };
};
