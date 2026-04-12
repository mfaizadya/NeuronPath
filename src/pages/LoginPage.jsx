import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import './AuthPages.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Mohon isi semua field');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@neuronpath.com');
    setPassword('demo12345678');
    setLoading(true);
    setError('');
    try {
      await login('demo@neuronpath.com', 'demo12345678');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb--1" />
        <div className="auth-orb auth-orb--2" />
      </div>

      <div className="auth-container animate-fade-in">
        <Link to="/" className="auth-logo">
          <div className="auth-logo__icon"><Zap size={22} /></div>
          <span className="auth-logo__text">NeuronPath</span>
        </Link>

        <div className="auth-card glass-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">Selamat Datang Kembali</h1>
            <p className="auth-card__subtitle">Masuk ke akun NeuronPath Anda</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  className="form-input form-input--icon"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input form-input--icon"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="input-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? <Loader2 size={18} className="spin" /> : <>Masuk <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="auth-divider">
            <span>atau</span>
          </div>

          <button className="btn btn-secondary auth-demo" onClick={handleDemoLogin} disabled={loading}>
            🚀 Coba Mode Demo
          </button>

          <p className="auth-footer-text">
            Belum punya akun?{' '}
            <Link to="/register" className="auth-link">Daftar Sekarang</Link>
          </p>
        </div>

        <p className="auth-demo-info">
          Demo: <code>demo@neuronpath.com</code> / <code>demo12345678</code>
        </p>
      </div>
    </div>
  );
}
