/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('neuronpath_theme');
    const userSelectedTheme = localStorage.getItem('neuronpath_theme_user_set') === 'true';
    if (userSelectedTheme && (saved === 'light' || saved === 'dark')) return saved;
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('neuronpath_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    localStorage.setItem('neuronpath_theme_user_set', 'true');
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
