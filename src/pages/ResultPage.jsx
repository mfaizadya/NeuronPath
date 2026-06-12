import { useState, useEffect } from 'react';
import { useLocation, useParams, Link, Navigate } from 'react-router-dom';
import { getTestResultById } from '../services/testResultService';
import {
  Eye, Headphones, Hand, Brain, Sparkles, ArrowRight,
  Home, CheckCircle2, Loader2
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import './ResultPage.css';

const styleIcons = { Visual: Eye, Auditori: Headphones, Kinestetik: Hand };

export default function ResultPage() {
  const location = useLocation();
  const { resultId } = useParams();
  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!location.state?.result && !!resultId);
  const [error, setError] = useState('');

  // If no state but has resultId in URL, fetch from Firestore
  useEffect(() => {
    const fetchResult = async () => {
      if (result || !resultId) return;
      
      try {
        setLoading(true);
        const fetched = await getTestResultById(resultId);
        if (fetched) {
          setResult(fetched);
        } else {
          setError('Hasil tes tidak ditemukan.');
        }
      } catch (err) {
        console.error('Failed to fetch result:', err);
        setError('Gagal memuat hasil tes.');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId, result]);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <Loader2 size={32} className="spin" style={{ color: 'var(--accent-blue)' }} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)' }}>Memuat hasil tes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <p style={{ color: '#ef4444', marginBottom: 16 }}>{error}</p>
        <Link to="/pretest" className="btn btn-primary">Ambil Pretest</Link>
      </div>
    );
  }

  // No result and no resultId — redirect to pretest
  if (!result && !resultId) {
    return <Navigate to="/pretest" replace />;
  }

  if (!result) return null;

  const { gayaBelajar, polaBelajar, insights } = result;

  const gayaChartData = [
    { subject: 'Visual', score: gayaBelajar.scores.visual },
    { subject: 'Auditori', score: gayaBelajar.scores.auditori },
    { subject: 'Kinestetik', score: gayaBelajar.scores.kinestetik },
  ];

  const DominantIcon = styleIcons[gayaBelajar.dominant] || Eye;

  return (
    <div className="page-container result-page">
      {/* Success Banner */}
      <div className="result-banner glass-card animate-fade-in">
        <div className="result-banner__icon">
          <CheckCircle2 size={32} />
        </div>
        <div>
          <h2>Analisis Selesai! 🎉</h2>
          <p>Berikut adalah profil belajar Anda berdasarkan penilaian sistem</p>
        </div>
      </div>

      {/* Profile Cards */}
      <div className="result-profiles animate-fade-in-up">
        <div className="result-profile glass-card">
          <div className="result-profile__badge">Gaya Belajar</div>
          <div className="result-profile__icon result-profile__icon--blue">
            <DominantIcon size={32} />
          </div>
          <h3 className="result-profile__dominant">{gayaBelajar.dominant}</h3>
          <div className="result-profile__scores">
            {Object.entries(gayaBelajar.scores).map(([key, val]) => (
              <div key={key} className="result-score">
                <div className="result-score__header">
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <span className="result-score__value">{val}%</span>
                </div>
                <div className="result-score__bar">
                  <div
                    className="result-score__fill result-score__fill--blue"
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="result-profile glass-card">
          <div className="result-profile__badge result-profile__badge--purple">Pola Belajar</div>
          <div className="result-profile__icon result-profile__icon--purple">
            <Brain size={32} />
          </div>
          <h3 className="result-profile__dominant">{polaBelajar.dominant}</h3>
          <div className="result-profile__scores">
            {Object.entries(polaBelajar.scores).map(([key, val]) => (
              <div key={key} className="result-score">
                <div className="result-score__header">
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <span className="result-score__value">{Math.min(val, 100)}%</span>
                </div>
                <div className="result-score__bar">
                  <div
                    className="result-score__fill result-score__fill--purple"
                    style={{ width: `${Math.min(val, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="result-chart glass-card animate-fade-in-up">
        <h3><Sparkles size={18} /> Profil Gaya Belajar</h3>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={gayaChartData}>
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

      {/* Insights */}
      <div className="result-insights animate-fade-in-up">
        {insights.map((insight, i) => (
          <div key={i} className="result-insight glass-card">
            <div className={`result-insight__icon result-insight__icon--${
              insight.type === 'gaya' ? 'blue' : insight.type === 'pola' ? 'purple' : 'green'
            }`}>
              {insight.type === 'gaya' ? <Eye size={20} /> :
               insight.type === 'pola' ? <Brain size={20} /> :
               <Sparkles size={20} />}
            </div>
            <h4>{insight.title}</h4>
            <p>{insight.description}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="result-actions">
        <Link to="/dashboard" className="btn btn-primary btn-lg">
          <Home size={18} /> Ke Dashboard
        </Link>
        <Link to="/history" className="btn btn-secondary btn-lg">
          Lihat Riwayat <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
