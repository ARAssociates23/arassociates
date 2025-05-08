
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  name?: string;
}

// Helper function to clean up all auth tokens
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('user');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });

  // Also check sessionStorage
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const signIn = async ({ email, password }: LoginCredentials) => {
  try {
    // Clean up existing auth state
    cleanupAuthState();
    
    // Try global sign out first to prevent auth conflicts
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Continue even if this fails
      console.log("Pre-signout failed, continuing with login", err);
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Login Failed", {
        description: error.message
      });
      return { success: false, error: error.message };
    }

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(data.user));
    
    // Return success but don't force reload - let the auth listener handle navigation
    return { success: true, data };
  } catch (error: any) {
    toast.error("Login Failed", {
      description: error.message || "An error occurred during login"
    });
    return { success: false, error: error.message };
  }
};

export const signUp = async ({ email, password, name }: SignUpCredentials) => {
  try {
    // Clean up existing auth state first
    cleanupAuthState();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    if (error) {
      toast.error("Registration Failed", {
        description: error.message
      });
      return { success: false, error: error.message };
    }

    toast.success("Registration Successful", {
      description: "Please check your email to confirm your account"
    });
    return { success: true, data };
  } catch (error: any) {
    toast.error("Registration Failed", {
      description: error.message || "An error occurred during registration"
    });
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    // Clean up auth state first
    cleanupAuthState();
    
    // Then perform the actual sign out
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) {
      toast.error("Logout Failed", {
        description: error.message
      });
      return { success: false, error: error.message };
    }

    toast.success("Logged out successfully");
    
    // Force page reload for a clean state with explicit path
    setTimeout(() => {
      window.location.href = '/login';
    }, 300);
    
    return { success: true };
  } catch (error: any) {
    toast.error("Logout Failed", {
      description: error.message || "An error occurred during logout"
    });
    return { success: false, error: error.message };
  }
};

export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error);
      return { success: false, error: error.message };
    }
    
    if (data.session) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(data.session.user));
      return { success: true, session: data.session };
    }
    
    // No active session found
    return { success: false, error: "No active session" };
  } catch (error: any) {
    console.error("Session check error:", error);
    return { success: false, error: error.message };
  }
};
