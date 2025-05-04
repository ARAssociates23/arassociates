
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

// Add custom CSS variables for finance theme
document.documentElement.style.setProperty('--finance', '#0c4b36');
document.documentElement.style.setProperty('--finance-dark', '#083828');
document.documentElement.style.setProperty('--finance-light', '#e0f4ed');
document.documentElement.style.setProperty('--finance-highlight', '#f0f9f6');

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
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-finance text-lg animate-pulse">Loading...</p>
    </div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-white transition-colors duration-300">
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
