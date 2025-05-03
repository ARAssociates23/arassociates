
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./components/Login";
import { ThemeProvider } from "./components/theme-provider";

import './App.css';
import { useEffect, useState } from "react";
import { getCurrentSession } from "./services/authService";

// Add custom CSS variables for finance theme - dark mode aware
const setFinanceTheme = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  document.documentElement.style.setProperty('--finance', isDarkMode ? '#4ade80' : '#0c4b36');
  document.documentElement.style.setProperty('--finance-dark', isDarkMode ? '#22c55e' : '#083828');
  document.documentElement.style.setProperty('--finance-light', isDarkMode ? '#dcfce7' : '#e0f4ed');
  document.documentElement.style.setProperty('--finance-highlight', isDarkMode ? '#18181b' : '#f0f9f6');
};

// Auth check HOC with smooth loading transitions
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { success } = await getCurrentSession();
        setIsAuthenticated(success);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      } finally {
        // Add slight delay for nicer transition
        setTimeout(() => setIsLoading(false), 300);
      }
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900 transition-all duration-300">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-finance rounded-full border-t-transparent animate-spin mb-4"></div>
          <p className="text-finance dark:text-green-400 text-lg animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Configure React Query for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const MainApp = () => {
  // Move the useEffect hook inside the component function
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === 'class' &&
          mutation.target === document.documentElement
        ) {
          setFinanceTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Set initial theme
    setFinanceTheme();

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner theme="system" />
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <PrivateRoute>
                    <Index initialShowDashboard={true} />
                  </PrivateRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default MainApp;
