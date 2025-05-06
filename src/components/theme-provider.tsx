
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  // Always use dark theme
  const [theme] = useState<Theme>("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove("light");
    root.classList.add("dark");
    
    // Store the theme preference
    localStorage.setItem(storageKey, "dark");
    
    // Dark theme colors - using blue from the logo
    document.documentElement.style.setProperty('--finance', '#4a9eff');
    document.documentElement.style.setProperty('--finance-dark', '#3182ce');
    document.documentElement.style.setProperty('--finance-light', '#d1e5f7');
    document.documentElement.style.setProperty('--finance-highlight', '#1e293b');
    document.documentElement.style.setProperty('--background-color', '#0f172a');
    document.documentElement.style.setProperty('--card-bg', '#1e293b');
    document.documentElement.style.setProperty('--text-primary', '#f8fafc');
    document.documentElement.style.setProperty('--text-secondary', '#cbd5e1');
  }, [storageKey]);

  const value = {
    theme: "dark" as Theme, // Fix: explicitly cast to Theme type
    setTheme: (theme: Theme) => {
      // No-op function since we only support dark theme
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
