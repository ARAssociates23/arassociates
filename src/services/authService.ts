
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  name?: string;
}

export const signIn = async ({ email, password }: LoginCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }

    localStorage.setItem("isAuthenticated", "true");
    return { success: true, data };
  } catch (error: any) {
    toast({
      title: "Login Failed",
      description: error.message || "An error occurred during login",
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};

export const signUp = async ({ email, password, name }: SignUpCredentials) => {
  try {
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
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }

    toast({
      title: "Registration Successful",
      description: "Please check your email to confirm your account",
    });
    return { success: true, data };
  } catch (error: any) {
    toast({
      title: "Registration Failed",
      description: error.message || "An error occurred during registration",
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }

    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    return { success: true };
  } catch (error: any) {
    toast({
      title: "Logout Failed",
      description: error.message || "An error occurred during logout",
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};

export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      return { success: false, error: error.message };
    }
    
    if (data.session) {
      localStorage.setItem("isAuthenticated", "true");
      return { success: true, session: data.session };
    }
    
    return { success: false };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
