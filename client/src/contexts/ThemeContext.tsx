'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Theme, THEME_KEY } from './theme.types';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  // Update the theme class on the HTML element
  const updateThemeClass = useCallback((theme: Theme) => {
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    // 1. Get saved theme from localStorage
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    
    // 2. If user has a saved preference, use it
    if (savedTheme) {
      setThemeState(savedTheme);
      updateThemeClass(savedTheme);
    } else {
      // 3. Otherwise, use system preference but don't save it yet
      updateThemeClass('system');
    }
    
    setMounted(true);
  }, [updateThemeClass]);

  // Update theme class when theme changes
  useEffect(() => {
    updateThemeClass(theme);
  }, [theme, updateThemeClass]);

  // Watch for system theme changes when in 'system' mode
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      if (e.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Set theme and save to localStorage
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    updateThemeClass(newTheme);
  }, [updateThemeClass]);

  // Toggle between light and dark (skips system theme)
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Prevent flash of wrong theme on initial render
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        toggleTheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}