import { Link } from 'react-router-dom';
import { Zap, Brain, BarChart3, Sparkles, ArrowRight, Shield, Clock, Users } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Animated background */}
      <div className="landing__bg">
        <div className="landing__orb landing__orb--1" />
        <div className="landing__orb landing__orb--2" />
        <div className="landing__orb landing__orb--3" />
      </div>

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
            <Link to="/login" className="btn btn-ghost">Masuk</Link>
            <Link to="/register" className="btn btn-primary">Mulai Gratis</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero__content animate-fade-in-up">
          <div className="hero__badge">
            <Sparkles size={14} />
            <span>Platform Asesmen Cerdas</span>
          </div>
          <h1 className="hero__title">
            Temukan <span className="gradient-text">Neural Network</span> Gaya Belajarmu
          </h1>
          <p className="hero__desc">
            NeuronPath menganalisis Gaya Belajar (Visual, Auditori, Kinestetik) dan 
            Pola Belajar (Consistent, Fast, Reflective, Balanced) Anda secara instan 
            berdasarkan perhitungan heuristik terstruktur. Tanpa perlu histori data.
          </p>
          <div className="hero__actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Mulai Analisis
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sudah Punya Akun
            </Link>
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-number">15</span>
              <span className="hero__stat-label">Pertanyaan</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">&lt;5</span>
              <span className="hero__stat-label">Menit</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">Sistem</span>
              <span className="hero__stat-label">Analisis</span>
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
            Daftar Sekarang — Gratis
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
          <p>© 2026 NeuronPath. Software Engineering for Startup.</p>
        </div>
      </footer>
    </div>
  );
}
