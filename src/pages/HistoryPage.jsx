import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserTestHistory } from '../services/testResultService';
import { Eye, Brain, Calendar, ArrowRight, ClipboardList, Loader2 } from 'lucide-react';
import './HistoryPage.css';

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (user?.uid) {
          const results = await getUserTestHistory(user.uid);
          setHistory(results);
        }
      } catch (err) {
        console.warn('Failed to fetch history from Firestore:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <Loader2 size={32} className="spin" style={{ color: 'var(--accent-blue)' }} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)' }}>Memuat riwayat tes...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <span className="gradient-text">Riwayat</span> Tes
        </h1>
        <p className="page-subtitle">
          Lihat semua hasil tes yang pernah Anda kerjakan
        </p>
      </div>

      {history.length === 0 ? (
        <div className="history-empty glass-card">
          <ClipboardList size={48} className="history-empty__icon" />
          <h3>Belum Ada Riwayat</h3>
          <p>Anda belum pernah mengerjakan tes. Mulai pretest pertama Anda!</p>
          <Link to="/pretest" className="btn btn-primary">
            Mulai Pretest <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item, i) => (
            <div key={item.id} className="history-card glass-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="history-card__header">
                <div className="history-card__date">
                  <Calendar size={16} />
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                <span className="history-card__badge">
                  {item.answeredQuestions}/{item.totalQuestions} Soal
                </span>
              </div>

              <div className="history-card__body">
                <div className="history-card__result">
                  <div className="history-card__result-icon history-card__result-icon--blue">
                    <Eye size={20} />
                  </div>
                  <div>
                    <span className="history-card__label">Gaya Belajar</span>
                    <span className="history-card__value">{item.gayaBelajar?.dominant}</span>
                  </div>
                </div>

                <div className="history-card__result">
                  <div className="history-card__result-icon history-card__result-icon--purple">
                    <Brain size={20} />
                  </div>
                  <div>
                    <span className="history-card__label">Pola Belajar</span>
                    <span className="history-card__value">{item.polaBelajar?.dominant}</span>
                  </div>
                </div>
              </div>

              <div className="history-card__scores">
                {item.gayaBelajar?.scores && Object.entries(item.gayaBelajar.scores).map(([key, val]) => (
                  <div key={key} className="history-score">
                    <span>{key}</span>
                    <div className="history-score__bar">
                      <div className="history-score__fill" style={{ width: `${val}%` }} />
                    </div>
                    <span className="history-score__val">{val}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
