
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check local storage first
    const storedTheme = localStorage.getItem(storageKey);
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
    // Otherwise use default
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Store the theme preference
    localStorage.setItem(storageKey, theme);
    
    // Update color scheme variables based on theme
    if (theme === "dark") {
      // Dark theme colors - using blue from the logo
      document.documentElement.style.setProperty('--finance', '#4a9eff');
      document.documentElement.style.setProperty('--finance-dark', '#3182ce');
      document.documentElement.style.setProperty('--finance-light', '#d1e5f7');
      document.documentElement.style.setProperty('--finance-highlight', '#1e293b');
      document.documentElement.style.setProperty('--background-color', '#0f172a');
      document.documentElement.style.setProperty('--card-bg', '#1e293b');
      document.documentElement.style.setProperty('--text-primary', '#f8fafc');
      document.documentElement.style.setProperty('--text-secondary', '#cbd5e1');
    } else {
      // Light theme colors - using blue from the logo
      document.documentElement.style.setProperty('--finance', '#003366');
      document.documentElement.style.setProperty('--finance-dark', '#002244');
      document.documentElement.style.setProperty('--finance-light', '#d1e5f7');
      document.documentElement.style.setProperty('--finance-accent', '#2376e6');
      document.documentElement.style.setProperty('--finance-highlight', '#e9f2fb');
      document.documentElement.style.setProperty('--background-color', '#ffffff');
      document.documentElement.style.setProperty('--card-bg', '#ffffff');
      document.documentElement.style.setProperty('--text-primary', '#1e293b');
      document.documentElement.style.setProperty('--text-secondary', '#475569');
    }
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
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
