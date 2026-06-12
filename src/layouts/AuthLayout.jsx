import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AuthLayout() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="auth-layout">
      <button
        type="button"
        className="auth-back"
        onClick={handleBack}
        aria-label="Kembali"
        title="Kembali"
      >
        <ArrowLeft size={18} />
        <span>Kembali</span>
      </button>
      <button
        type="button"
        className="auth-theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Aktifkan light mode' : 'Aktifkan dark mode'}
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <Outlet />
    </div>
  );
}
