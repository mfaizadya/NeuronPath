import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockTestHistory } from '../data/mockResults';
import { History, Eye, Brain, Calendar, ArrowRight, ClipboardList } from 'lucide-react';
import './HistoryPage.css';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('neuronpath_history') || '[]');
    const combined = [...stored, ...mockTestHistory];
    // Deduplicate by id
    const unique = combined.filter(
      (item, index, self) => index === self.findIndex(t => t.id === item.id)
    );
    setHistory(unique);
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
                  <span>{formatDate(item.date)}</span>
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
                    <span className="history-card__value">{item.gayaBelajar.dominant}</span>
                  </div>
                </div>

                <div className="history-card__result">
                  <div className="history-card__result-icon history-card__result-icon--purple">
                    <Brain size={20} />
                  </div>
                  <div>
                    <span className="history-card__label">Pola Belajar</span>
                    <span className="history-card__value">{item.polaBelajar.dominant}</span>
                  </div>
                </div>
              </div>

              <div className="history-card__scores">
                {Object.entries(item.gayaBelajar.scores).map(([key, val]) => (
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
