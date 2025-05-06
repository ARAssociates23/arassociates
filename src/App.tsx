
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { initApiNinjasService } from './services/apiNinjasService';

function App() {
  useEffect(() => {
    // Initialize the API Ninjas service
    initApiNinjasService();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <BrowserRouter>
        <div className="app dark">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <SonnerToaster richColors position="top-center" />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
