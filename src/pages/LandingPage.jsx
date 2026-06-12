import { Link } from 'react-router-dom';
import { Zap, Brain, BarChart3, Sparkles, ArrowRight, Shield, Clock, Users, Globe2, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './LandingPage.css';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing__nav">
        <div className="landing__nav-inner">
          <div className="landing__logo">
            <div className="landing__logo-icon">
              <Zap size={22} />
            </div>
            <span className="landing__logo-text">NeuronPath</span>
          </div>
          <div className="landing__nav-actions">
            <button
              type="button"
              className="landing__theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Aktifkan light mode' : 'Aktifkan dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <span className="landing__language">
              <Globe2 size={18} />
              ID
            </span>
            <Link to="/login" className="btn btn-ghost">Masuk</Link>
            <Link to="/register" className="btn btn-primary">Mulai Tes</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero__card animate-fade-in-up">
          <div className="hero__content">
            <h1 className="hero__title">
              Temukan <span>siapa dirimu</span> lewat gaya belajar
            </h1>
            <p className="hero__desc">
              Dengan tes ini, kamu akan mengetahui gaya belajar dan pola belajar
              yang paling cocok untuk memahami materi dengan lebih percaya diri.
            </p>
            <div className="hero__actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Mulai Tes Belajar
                <ArrowRight size={18} />
              </Link>
            </div>
            <p className="hero__note">
              Gratis untuk memulai. Hasil personal bisa dilihat setelah tes selesai.
            </p>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <div className="phone">
              <div className="phone__speaker" />
              <div className="phone__screen">
                <div className="phone__status">
                  <span>9:41</span>
                  <span>78%</span>
                </div>
                <div className="phone__brand">
                  <div className="phone__brand-icon">
                    <Zap size={17} />
                  </div>
                  <div>
                    <strong>NeuronPath</strong>
                    <span>Analisis belajar</span>
                  </div>
                </div>
                <div className="phone__progress">
                  <span>48%</span>
                  <span>Langkah 6 dari 12</span>
                </div>
                <div className="phone__bar">
                  <span />
                </div>
                <h3>Pilih jawaban yang paling menggambarkan dirimu.</h3>
                <div className="phone__scale">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="phone__question">
                  <p>Saya lebih mudah paham saat melihat diagram atau contoh visual.</p>
                  <div className="phone__scale phone__scale--small">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className="phone__question">
                  <p>Saya suka mengulang materi dengan ritme yang konsisten.</p>
                  <div className="phone__scale phone__scale--small">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="features__inner">
          <h2 className="features__title">
            Bagaimana <span className="gradient-text">NeuronPath</span> Bekerja
          </h2>
          <p className="features__subtitle">
            Tiga langkah sederhana untuk menemukan profil belajar Anda yang unik
          </p>
          <div className="features__grid">
            <div className="feature-card glass-card">
              <div className="feature-card__icon feature-card__icon--blue">
                <Brain size={28} />
              </div>
              <h3 className="feature-card__title">Pretest Cerdas</h3>
              <p className="feature-card__desc">
                Jawab 15 pertanyaan yang dirancang khusus untuk menganalisis
                preferensi dan kebiasaan belajar Anda.
              </p>
              <div className="feature-card__step">01</div>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-card__icon feature-card__icon--purple">
                <BarChart3 size={28} />
              </div>
              <h3 className="feature-card__title">Analisis Sistem</h3>
              <p className="feature-card__desc">
                Sistem kami menganalisis jawaban Anda untuk memetakan gaya
                dan pola belajar secara terstruktur dan akurat.
              </p>
              <div className="feature-card__step">02</div>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-card__icon feature-card__icon--green">
                <Sparkles size={28} />
              </div>
              <h3 className="feature-card__title">Insight Personal</h3>
              <p className="feature-card__desc">
                Dapatkan rekomendasi personalisasi dan strategi belajar
                yang sesuai dengan profil unik Anda.
              </p>
              <div className="feature-card__step">03</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="trust">
        <div className="trust__inner">
          <div className="trust__grid">
            <div className="trust__item">
              <Shield size={24} className="trust__icon" />
              <h4>Data Aman</h4>
              <p>Privasi data Anda terjaga sepenuhnya</p>
            </div>
            <div className="trust__item">
              <Clock size={24} className="trust__icon" />
              <h4>Hasil Instan</h4>
              <p>Analisis selesai dalam hitungan detik</p>
            </div>
            <div className="trust__item">
              <Users size={24} className="trust__icon" />
              <h4>Akurat</h4>
              <p>Didukung perhitungan logika kustom</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta__inner glass-card">
          <h2 className="cta__title">Siap Menemukan Potensi Belajarmu?</h2>
          <p className="cta__desc">
            Bergabung sekarang dan temukan gaya belajar yang paling efektif untukmu.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Daftar Sekarang - Gratis
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing__footer">
        <div className="landing__footer-inner">
          <div className="landing__footer-brand">
            <Zap size={18} />
            <span>NeuronPath</span>
          </div>
          <p>Copyright 2026 NeuronPath. Software Engineering for Startup.</p>
        </div>
      </footer>
    </div>
  );
}
