import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="notfound">
      <button
        type="button"
        className="notfound__theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Aktifkan light mode' : 'Aktifkan dark mode'}
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <div className="notfound__content animate-fade-in-up">
        <div className="notfound__code gradient-text">404</div>
        <h1>Halaman Tidak Ditemukan</h1>
        <p>Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
        <div className="notfound__actions">
          <Link to="/" className="btn btn-primary btn-lg">
            <Home size={18} /> Ke Beranda
          </Link>
          <button className="btn btn-secondary btn-lg" onClick={() => window.history.back()}>
            <ArrowLeft size={18} /> Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
