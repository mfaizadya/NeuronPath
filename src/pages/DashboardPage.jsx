import { useAuth } from '../context/AuthContext';
import { dashboardStats, mockTestHistory } from '../data/mockResults';
import { Link } from 'react-router-dom';
import {
  Brain, Eye, Headphones, Hand, TrendingUp,
  ClipboardList, ArrowRight, Sparkles, BarChart3, Zap
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';
import './DashboardPage.css';

const gayaData = [
  { subject: 'Visual', score: 78 },
  { subject: 'Auditori', score: 55 },
  { subject: 'Kinestetik', score: 42 },
];

const polaData = [
  { name: 'Consistent', value: 72, color: '#00d4ff' },
  { name: 'Fast', value: 60, color: '#f59e0b' },
  { name: 'Reflective', value: 85, color: '#7c3aed' },
  { name: 'Balanced', value: 68, color: '#10b981' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const stats = dashboardStats;
  const hasTests = mockTestHistory.length > 0;

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
            <span className="stat-card__value">{stats.totalTests}</span>
            <span className="stat-card__label">Total Tes</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-card__icon stat-card__icon--purple">
            <Eye size={22} />
          </div>
          <div className="stat-card__info">
            <span className="stat-card__value">{stats.gayaDominant}</span>
            <span className="stat-card__label">Gaya Belajar</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-card__icon stat-card__icon--green">
            <Brain size={22} />
          </div>
          <div className="stat-card__info">
            <span className="stat-card__value">{stats.polaDominant}</span>
            <span className="stat-card__label">Pola Belajar</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-card__icon stat-card__icon--amber">
            <TrendingUp size={22} />
          </div>
          <div className="stat-card__info">
            <span className="stat-card__value">{stats.averageCompletion}%</span>
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

          {/* AI Insight */}
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
                  <h4>Gaya Belajar: Visual</h4>
                  <p>Anda belajar paling efektif melalui diagram, grafik, video, dan visualisasi data. Gunakan mind-map dan infografis.</p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-item__icon insight-item__icon--purple">
                  <Brain size={18} />
                </div>
                <div className="insight-item__content">
                  <h4>Pola Belajar: Reflective</h4>
                  <p>Anda suka merefleksikan dan mengulang materi untuk pemahaman yang lebih dalam. Catat poin kunci dan review secara berkala.</p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-item__icon insight-item__icon--green">
                  <Sparkles size={18} />
                </div>
                <div className="insight-item__content">
                  <h4>Rekomendasi</h4>
                  <p>Kombinasikan mind-map visual dengan sesi refleksi 10 menit setelah belajar untuk hasil optimal.</p>
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
