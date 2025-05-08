
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Login from './components/Login';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { initMfApiService } from './services/mfApiService';

function App() {
  useEffect(() => {
    // Initialize the MF API service
    initMfApiService();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app dark">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
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
