
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
import { Suspense, useEffect, useState } from "react";
import { getCurrentSession } from "./services/authService";
import { initMfToolService } from "./services/mfToolService";
import { ThemeToggle } from "./components/theme-toggle";

// Configure React Query for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 10 * 60 * 1000, // 10 minutes for better performance
      gcTime: 15 * 60 * 1000, // 15 minutes (previously cacheTime)
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
      <div className="flex items-center justify-center min-h-screen bg-slate-950 backdrop-blur-md transition-all duration-500 bg-pattern">
        <div className="flex flex-col items-center glass p-8 rounded-2xl animate-fade-in">
          <div className="w-16 h-16 border-4 border-blue-400 rounded-full border-t-transparent animate-spin mb-4"></div>
          <p className="text-blue-400 text-lg animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  const [navDataInitialized, setNavDataInitialized] = useState(false);
  
  // Preload fonts and critical resources
  useEffect(() => {
    // Hide API quota error notifications
    const style = document.createElement('style');
    style.textContent = `
      .api-error-notification, 
      [aria-label="API quota exceeded"],
      [data-toast-description*="quota exceeded"],
      [role="alert"] {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
      }
      
      /* Force dark mode only */
      body, .bg-pattern {
        background-color: #0f172a !important;
      }
      
      .glass-card {
        background-color: rgba(30, 41, 59, 0.8) !important;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3) !important;
        border: 1px solid rgba(51, 65, 85, 0.5) !important;
      }
      
      /* Ensure toggle button is always visible and doesn't overlap */
      .theme-toggle-button {
        position: fixed !important;
        top: 1rem !important;
        right: 1rem !important;
        z-index: 100 !important;
      }
    `;
    document.head.appendChild(style);
    
    // Add background patterns for better glassmorphism
    document.body.classList.add('bg-pattern');
    document.documentElement.classList.add('dark'); // Force dark mode
    
    // Initialize MFTool service
    try {
      console.log("Initializing NAV data service...");
      initMfToolService();
      setNavDataInitialized(true);
    } catch (error) {
      console.error("Failed to initialize NAV data service:", error);
      setNavDataInitialized(false);
    }
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storageKey="ar-associates-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" />
          <ThemeToggle />
          <div className="min-h-screen bg-slate-950 text-white transition-all duration-500 overflow-x-hidden bg-pattern">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-blue-400 rounded-full border-t-transparent animate-spin"></div>
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

export default App;
