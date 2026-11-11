import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeConfig, DEFAULT_THEME_CONFIG } from '../components/ui/ThemeCustomizerModal';

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (newTheme: ThemeConfig) => void;
  toggleSidebarMode: () => void;
  isSlim: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('icms_theme_config');
      return saved ? JSON.parse(saved) : DEFAULT_THEME_CONFIG;
    } catch {
      return DEFAULT_THEME_CONFIG;
    }
  });

  const setTheme = (newTheme: ThemeConfig) => {
    localStorage.setItem('icms_theme_config', JSON.stringify(newTheme));
    setThemeState(newTheme);
  };

  const toggleSidebarMode = () => {
    const updated: ThemeConfig = {
      ...theme,
      sidebarMode: theme.sidebarMode === 'EXPANDED' ? 'SLIM' : 'EXPANDED',
    };
    setTheme(updated);
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'icms_theme_config' && e.newValue) {
        try {
          setThemeState(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleSidebarMode,
        isSlim: theme.sidebarMode === 'SLIM',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeConfig = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: DEFAULT_THEME_CONFIG,
      setTheme: () => {},
      toggleSidebarMode: () => {},
      isSlim: false,
    };
  }
  return context;
};

