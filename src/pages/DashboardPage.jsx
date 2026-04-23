import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserDashboardStats } from '../services/testResultService';
import { Link } from 'react-router-dom';
import {
  Brain, Eye, Headphones, Hand, TrendingUp,
  ClipboardList, ArrowRight, Sparkles, BarChart3, Zap, Loader2
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';
import './DashboardPage.css';

const polaColors = {
  consistent: '#00d4ff',
  fast: '#f59e0b',
  reflective: '#7c3aed',
  balanced: '#10b981',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.uid) {
          const dashStats = await getUserDashboardStats(user.uid);
          setStats(dashStats);
        }
      } catch (err) {
        console.warn('Failed to fetch dashboard stats:', err);
        setStats({ totalTests: 0, gayaDominant: '-', polaDominant: '-', averageCompletion: 0, history: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <Loader2 size={32} className="spin" style={{ color: 'var(--accent-blue)' }} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)' }}>Memuat dashboard...</p>
      </div>
    );
  }

  const hasTests = stats && stats.totalTests > 0;

  // Build chart data from latest test result
  const latestResult = hasTests ? stats.history[0] : null;

  const gayaData = latestResult ? [
    { subject: 'Visual', score: latestResult.gayaBelajar?.scores?.visual || 0 },
    { subject: 'Auditori', score: latestResult.gayaBelajar?.scores?.auditori || 0 },
    { subject: 'Kinestetik', score: latestResult.gayaBelajar?.scores?.kinestetik || 0 },
  ] : [];

  const polaData = latestResult ? Object.entries(latestResult.polaBelajar?.scores || {}).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: Math.min(value, 100),
    color: polaColors[key] || '#94a3b8',
  })) : [];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          Dashboard <span className="gradient-text">Neural</span>
        </h1>
        <p className="page-subtitle">
          Ringkasan profil belajar dan insight Anda
        </p>
      </div>

      {/* Stats Cards */}
      <div className="dash-stats">
        <div className="stat-card glass-card">
          <div className="stat-card__icon stat-card__icon--blue">
            <ClipboardList size={22} />
          </div>
          <div className="stat-card__info">
            <span className="stat-card__value">{stats?.totalTests || 0}</span>
            <span className="stat-card__label">Total Tes</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-card__icon stat-card__icon--purple">
            <Eye size={22} />
          </div>
          <div className="stat-card__info">
            <span className="stat-card__value">{stats?.gayaDominant || '-'}</span>
            <span className="stat-card__label">Gaya Belajar</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-card__icon stat-card__icon--green">
            <Brain size={22} />
          </div>
          <div className="stat-card__info">
            <span className="stat-card__value">{stats?.polaDominant || '-'}</span>
            <span className="stat-card__label">Pola Belajar</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-card__icon stat-card__icon--amber">
            <TrendingUp size={22} />
          </div>
          <div className="stat-card__info">
            <span className="stat-card__value">{stats?.averageCompletion || 0}%</span>
            <span className="stat-card__label">Rata-rata</span>
          </div>
        </div>
      </div>

      {hasTests ? (
        <div className="dash-grid">
          {/* Gaya Belajar Chart */}
          <div className="dash-chart glass-card">
            <div className="dash-chart__header">
              <h3><Sparkles size={18} /> Profil Gaya Belajar</h3>
              <span className="dash-chart__badge">Analisis Sistem</span>
            </div>
            <div className="dash-chart__body">
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={gayaData}>
                  <PolarGrid stroke="rgba(100,116,139,0.2)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 13 }} />
                  <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#00d4ff"
                    fill="#00d4ff"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pola Belajar Chart */}
          <div className="dash-chart glass-card">
            <div className="dash-chart__header">
              <h3><BarChart3 size={18} /> Distribusi Pola Belajar</h3>
              <span className="dash-chart__badge">Perhitungan Logika</span>
            </div>
            <div className="dash-chart__body">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={polaData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {polaData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Smart Insight */}
          <div className="dash-insights glass-card">
            <div className="dash-chart__header">
              <h3><Zap size={18} /> Smart Insight</h3>
            </div>
            <div className="insight-list">
              <div className="insight-item">
                <div className="insight-item__icon insight-item__icon--blue">
                  <Eye size={18} />
                </div>
                <div className="insight-item__content">
                  <h4>Gaya Belajar: {stats.gayaDominant}</h4>
                  <p>
                    {stats.gayaDominant === 'Visual'
                      ? 'Anda belajar paling efektif melalui diagram, grafik, video, dan visualisasi data. Gunakan mind-map dan infografis.'
                      : stats.gayaDominant === 'Auditori'
                      ? 'Anda belajar paling efektif melalui diskusi, mendengarkan penjelasan, dan podcast.'
                      : 'Anda belajar paling efektif melalui praktik langsung, eksperimen, dan simulasi.'}
                  </p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-item__icon insight-item__icon--purple">
                  <Brain size={18} />
                </div>
                <div className="insight-item__content">
                  <h4>Pola Belajar: {stats.polaDominant}</h4>
                  <p>
                    {stats.polaDominant === 'Reflective'
                      ? 'Anda suka merefleksikan dan mengulang materi untuk pemahaman yang lebih dalam. Catat poin kunci dan review secara berkala.'
                      : stats.polaDominant === 'Consistent'
                      ? 'Anda memiliki rutinitas belajar yang teratur dan konsisten.'
                      : 'Anda memiliki keseimbangan yang baik antara berbagai metode belajar.'}
                  </p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-item__icon insight-item__icon--green">
                  <Sparkles size={18} />
                </div>
                <div className="insight-item__content">
                  <h4>Rekomendasi</h4>
                  <p>Kombinasikan strategi belajar berdasarkan gaya dan pola Anda untuk hasil optimal.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="dash-empty glass-card">
          <Brain size={48} className="dash-empty__icon" />
          <h3>Belum Ada Data</h3>
          <p>Mulai pretest pertamamu untuk mendapatkan analisis tentang gaya dan pola belajarmu.</p>
          <Link to="/pretest" className="btn btn-primary">
            Mulai Pretest <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
}
