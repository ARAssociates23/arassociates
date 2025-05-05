
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
import { Suspense, lazy, useEffect, useState } from "react";
import { getCurrentSession } from "./services/authService";

// Configure React Query for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 10 * 60 * 1000, // 10 minutes for better performance
      cacheTime: 15 * 60 * 1000, // 15 minutes
    },
  },
});

// Auth check HOC with smooth loading transitions
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { success } = await getCurrentSession();
        setIsAuthenticated(success);
        
        if (!success) {
          // Quietly redirect to login, no error message
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      } finally {
        // Add slight delay for nicer transition
        setTimeout(() => setIsLoading(false), 200);
      }
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 backdrop-blur-md transition-all duration-300 bg-pattern">
        <div className="flex flex-col items-center glass p-8 rounded-2xl animate-fade-in">
          <div className="w-16 h-16 border-4 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent animate-spin mb-4"></div>
          <p className="text-blue-600 dark:text-blue-400 text-lg animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const MainApp = () => {
  // Preload fonts and critical resources
  useEffect(() => {
    // Hide API quota error notifications
    const style = document.createElement('style');
    style.textContent = `
      .api-error-notification, 
      [aria-label="API quota exceeded"] {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
      }
    `;
    document.head.appendChild(style);
    
    // Add background patterns for better glassmorphism
    document.body.classList.add('bg-pattern');
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="ar-associates-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" />
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent animate-spin"></div>
              </div>
            }>
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
            </Suspense>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default MainApp;
