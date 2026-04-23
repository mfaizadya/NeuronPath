import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getActiveQuestions } from '../services/questionService';
import { saveTestResult } from '../services/testResultService';
import { generateResult } from '../data/mockResults';
import { likertOptions } from '../data/pretestQuestions';
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import './TestPage.css';

export default function TestPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Fetch questions from Firestore on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const firestoreQuestions = await getActiveQuestions();
        if (firestoreQuestions.length > 0) {
          // Map Firestore format to local format
          setQuestions(firestoreQuestions.map(q => ({
            id: q.id,
            question: q.questionText,
            category: q.category,
          })));
        } else {
          // Fallback to hardcoded questions if Firestore is empty
          const { getAllQuestions } = await import('../data/pretestQuestions');
          setQuestions(getAllQuestions());
        }
      } catch (err) {
        console.warn('Firestore unavailable, using fallback questions:', err);
        const { getAllQuestions } = await import('../data/pretestQuestions');
        setQuestions(getAllQuestions());
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, []);

  if (loadingQuestions || questions.length === 0) {
    return (
      <div className="test-page" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <Loader2 size={32} className="spin" style={{ color: 'var(--accent-blue)' }} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)' }}>Memuat pertanyaan...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((Object.keys(answers).length) / questions.length) * 100;
  const allAnswered = Object.keys(answers).length === questions.length;

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = generateResult(answers);

      // Save to Firestore
      if (user?.uid) {
        try {
          const docRef = await saveTestResult(user.uid, {
            answers,
            gayaBelajar: result.gayaBelajar,
            polaBelajar: result.polaBelajar,
            insights: result.insights,
            totalQuestions: result.totalQuestions,
            answeredQuestions: result.answeredQuestions,
          });
          result.id = docRef.id;
        } catch (err) {
          console.warn('Failed to save to Firestore, continuing with local result:', err);
        }
      }

      navigate('/result', { state: { result } });
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitting(false);
    }
  };

  return (
    <div className="test-page">
      {/* Progress Bar */}
      <div className="test-progress">
        <div className="test-progress__bar">
          <div
            className="test-progress__fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="test-progress__text">
          {Object.keys(answers).length} / {questions.length} dijawab
        </span>
      </div>

      <div className="test-layout">
        {/* Question Card */}
        <div className="test-main">
          <div className="test-question glass-card">
            <div className="test-question__meta">
              <span className="test-question__number">
                Soal {currentIndex + 1}
              </span>
              <span className={`test-question__category test-question__category--${currentQuestion.category}`}>
                {currentQuestion.category === 'pola' ? 'Pola Belajar' : 'Gaya Belajar'}
              </span>
            </div>

            <h2 className="test-question__text">{currentQuestion.question}</h2>

            <div className="test-options">
              {likertOptions.map((opt) => (
                <button
                  key={opt.value}
                  className={`test-option ${
                    answers[currentQuestion.id] === opt.value ? 'test-option--selected' : ''
                  }`}
                  onClick={() => handleAnswer(opt.value)}
                >
                  <span className="test-option__number">{opt.value}</span>
                  <span className="test-option__label">{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="test-nav">
              <button
                className="btn btn-ghost"
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
              >
                <ChevronLeft size={18} /> Sebelumnya
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  className="btn btn-primary"
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                >
                  Selanjutnya <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitting}
                >
                  {submitting ? (
                    <><Loader2 size={18} className="spin" /> Menganalisis...</>
                  ) : (
                    <><Check size={18} /> Kirim & Analisis</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question List Sidebar */}
        <div className="test-sidebar glass-card">
          <h3 className="test-sidebar__title">List Pertanyaan</h3>
          <div className="test-sidebar__grid">
            {questions.map((q, i) => (
              <button
                key={q.id}
                className={`test-sidebar__btn ${
                  i === currentIndex ? 'test-sidebar__btn--current' : ''
                } ${answers[q.id] ? 'test-sidebar__btn--answered' : ''}`}
                onClick={() => setCurrentIndex(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="test-sidebar__legend">
            <div className="test-sidebar__legend-item">
              <span className="legend-dot legend-dot--current" /> Saat ini
            </div>
            <div className="test-sidebar__legend-item">
              <span className="legend-dot legend-dot--answered" /> Dijawab
            </div>
            <div className="test-sidebar__legend-item">
              <span className="legend-dot legend-dot--empty" /> Belum
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
