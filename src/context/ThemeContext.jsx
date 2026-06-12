/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('neuronpath_theme');
    const userSelectedTheme = localStorage.getItem('neuronpath_theme_user_set') === 'true';
    if (userSelectedTheme && (saved === 'light' || saved === 'dark')) return saved;
    return 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('neuronpath_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    localStorage.setItem('neuronpath_theme_user_set', 'true');
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
