
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./components/Login";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";

import './App.css';
import { useEffect, useState } from "react";
import { getCurrentSession } from "./services/authService";
import { initMfToolService } from "./services/mfToolService";

// Auth check HOC
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { success } = await getCurrentSession();
      setIsAuthenticated(success);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950 transition-all duration-500 bg-pattern">
      <div className="glass p-8 rounded-xl">
        <div className="w-12 h-12 border-4 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Remove error notification and add blue-themed colors
const ErrorNotificationRemover = () => {
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
    `;
    document.head.appendChild(style);
    
    // Initialize MFTool service
    initMfToolService();
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes (previously cacheTime)
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner theme="dark" position="top-right" />
        <ErrorNotificationRemover />
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-all duration-500 bg-pattern">
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

export default App;
