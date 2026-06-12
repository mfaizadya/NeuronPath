import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserDashboardStats } from '../services/testResultService';
import { createConsultationSession } from '../services/aiService';
import { getChatUsage, incrementChatUsage } from '../services/chatUsageService';
import { useOutletContext } from 'react-router-dom';
import {
  Bot, Send, Sparkles, Loader2, Lock, Crown,
  Plus, MessageSquare, Trash2, ChevronLeft, ChevronRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './ConsultationPage.css';

const FREE_LIMIT = 3;

// ── LocalStorage helpers ──────────────────────────────────────────────────────
const storageKey = (uid) => `neuronpath_chat_sessions_${uid}`;

const loadSessions = (uid) => {
  try {
    const raw = localStorage.getItem(storageKey(uid));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveSessions = (uid, sessions) => {
  try {
    localStorage.setItem(storageKey(uid), JSON.stringify(sessions));
  } catch { /* quota exceeded — ignore */ }
};

const createNewSession = (greeting) => ({
  id: Date.now().toString(),
  title: 'Chat Baru',
  createdAt: new Date().toISOString(),
  messages: [{ role: 'ai', content: greeting }],
});

const formatSessionDate = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 86400000) {
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }
  if (diff < 604800000) {
    return d.toLocaleDateString('id-ID', { weekday: 'short' });
  }
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ConsultationPage() {
  const { user } = useAuth();
  const { setShowUpgradeModal } = useOutletContext() || {};

  const [sessions, setSessions]         = useState([]);
  const [activeId, setActiveId]         = useState(null);
  const [input, setInput]               = useState('');
  const [loading, setLoading]           = useState(true);
  const [typing, setTyping]             = useState(false);
  const [chatSession, setChatSession]   = useState(null);
  const [error, setError]               = useState('');
  const [chatCount, setChatCount]       = useState(0);
  // sidebarOpen default: terbuka untuk premium, tertutup untuk free
  const [sidebarOpen, setSidebarOpen]   = useState(() => !!user?.isPremium);
  const [userStats, setUserStats]       = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);

  const isLimitReached = !user?.isPremium && chatCount >= FREE_LIMIT;
  const isPremium = !!user?.isPremium;

  // active session object
  const activeSession = sessions.find(s => s.id === activeId) || null;

  // ── Persist sessions whenever they change (premium only) ──
  useEffect(() => {
    if (user?.uid && isPremium && sessions.length > 0) {
      saveSessions(user.uid, sessions);
    }
  }, [sessions, user?.uid, isPremium]);

  // ── Auto scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, typing]);

  // ── Build AI chat session from stored history ──
  const buildAiSession = useCallback((stats, existingMessages = []) => {
    const userData = {
      username:     user?.username,
      gayaDominant: stats?.gayaDominant || 'Belum diketahui',
      polaDominant: stats?.polaDominant || 'Belum diketahui',
    };
    const session = createConsultationSession(userData);

    // Replay previous messages into AI history so context is preserved
    existingMessages.forEach(m => {
      if (m.role === 'user') {
        session.history.push({ role: 'user', content: m.content });
      } else if (m.role === 'ai') {
        session.history.push({ role: 'assistant', content: m.content });
      }
    });

    return session;
  }, [user?.username]);

  // ── Initialization ──
  useEffect(() => {
    if (!user?.uid) return;

    const init = async () => {
      // Chat count
      try {
        const count = await getChatUsage(user.uid);
        setChatCount(count);
      } catch { /* ignore */ }

      // User learning stats
      let stats = null;
      try {
        stats = await getUserDashboardStats(user.uid);
        setUserStats(stats);
      } catch { /* ignore */ }

      const greeting = `Halo ${user?.username}! 👋 Saya Neuron, AI konsultan belajarmu. \n\nSaya lihat gaya belajarmu cenderung **${stats?.gayaDominant || 'belum diketahui'}** dan polamu **${stats?.polaDominant || 'belum diketahui'}**. Ada materi spesifik yang ingin kamu pelajari hari ini, atau butuh tips belajar yang cocok buat kamu?`;

      try {
        // Premium: load saved sessions. Free: always start fresh
        const saved = isPremium ? loadSessions(user.uid) : [];

        if (saved.length > 0) {
          setSessions(saved);
          const last = saved[saved.length - 1];
          setActiveId(last.id);
          // Rebuild AI session with last session's history
          const session = buildAiSession(stats, last.messages);
          setChatSession(session);
        } else {
          const fresh = createNewSession(greeting);
          setSessions([fresh]);
          setActiveId(fresh.id);
          const session = buildAiSession(stats, []);
          setChatSession(session);
        }
      } catch (err) {
        console.error('Failed to initialize AI:', err);
        setError(err.message || 'Gagal terhubung ke AI.');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user?.uid, user?.username, buildAiSession]);

  // ── Switch active session ──
  const handleSelectSession = (id) => {
    const target = sessions.find(s => s.id === id);
    if (!target) return;
    setActiveId(id);
    // Rebuild AI session with that session's history
    try {
      const session = buildAiSession(userStats, target.messages);
      setChatSession(session);
    } catch { /* ignore */ }
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  // ── New chat ──
  const handleNewChat = () => {
    const greeting = `Halo lagi ${user?.username}! 👋 Ada yang ingin kamu tanyakan seputar belajar hari ini?`;
    const fresh = createNewSession(greeting);
    setSessions(prev => [...prev, fresh]);
    setActiveId(fresh.id);
    try {
      const session = buildAiSession(userStats, []);
      setChatSession(session);
    } catch { /* ignore */ }
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  // ── Delete session ──
  const handleDeleteSession = (id, e) => {
    e.stopPropagation();
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id);
      if (id === activeId) {
        if (updated.length > 0) {
          const last = updated[updated.length - 1];
          setActiveId(last.id);
          try {
            const session = buildAiSession(userStats, last.messages);
            setChatSession(session);
          } catch { /* ignore */ }
        } else {
          setActiveId(null);
          setChatSession(null);
        }
      }
      // Persist immediately (premium only)
      if (user?.uid && isPremium) saveSessions(user.uid, updated);
      return updated;
    });
  };

  // ── Send message ──
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || !chatSession || typing || isLimitReached) return;

    const userMessage = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // Append user message to active session
    setSessions(prev => prev.map(s => {
      if (s.id !== activeId) return s;
      const updated = { ...s, messages: [...s.messages, { role: 'user', content: userMessage }] };
      // Update title from first user message
      if (s.title === 'Chat Baru') {
        updated.title = userMessage.length > 40
          ? userMessage.slice(0, 40) + '…'
          : userMessage;
      }
      return updated;
    }));

    setTyping(true);

    try {
      const aiText = await chatSession.sendMessage(userMessage);

      setSessions(prev => prev.map(s =>
        s.id === activeId
          ? { ...s, messages: [...s.messages, { role: 'ai', content: aiText }] }
          : s
      ));

      if (!user?.isPremium && user?.uid) {
        try {
          const newCount = await incrementChatUsage(user.uid);
          setChatCount(newCount);
        } catch { /* ignore */ }
      }
    } catch (err) {
      console.error('Send message error:', err);
      setSessions(prev => prev.map(s =>
        s.id === activeId
          ? { ...s, messages: [...s.messages, { role: 'ai', content: 'Maaf, terjadi kesalahan pada jaringan atau API.' }] }
          : s
      ));
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  // ── Loading screen ──
  if (loading) {
    return (
      <div className="consultation-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 size={32} className="spin" style={{ color: 'var(--accent-blue)' }} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)' }}>Menyiapkan AI Konsultan...</p>
      </div>
    );
  }

  const messages = activeSession?.messages || [];

  return (
    <div className="consultation-page">
      <div className={`consultation-layout ${sidebarOpen ? 'consultation-layout--sidebar-open' : ''}`}>

        {/* ── Sidebar History ── */}
        <aside className="chat-sidebar">
          <div className="chat-sidebar__header">
            <h3 className="chat-sidebar__title">
              <MessageSquare size={16} /> Riwayat Chat
            </h3>
            {isPremium && (
              <button className="chat-sidebar__new" onClick={handleNewChat} title="Chat Baru">
                <Plus size={18} />
              </button>
            )}
          </div>

          {isPremium ? (
            <div className="chat-sidebar__list">
              {sessions.length === 0 && (
                <p className="chat-sidebar__empty">Belum ada sesi chat.</p>
              )}
              {[...sessions].reverse().map(session => (
                <button
                  key={session.id}
                  className={`chat-session-item ${session.id === activeId ? 'chat-session-item--active' : ''}`}
                  onClick={() => handleSelectSession(session.id)}
                >
                  <div className="chat-session-item__icon">
                    <Bot size={14} />
                  </div>
                  <div className="chat-session-item__info">
                    <span className="chat-session-item__title">{session.title}</span>
                    <span className="chat-session-item__date">{formatSessionDate(session.createdAt)}</span>
                  </div>
                  <button
                    className="chat-session-item__delete"
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    title="Hapus sesi"
                  >
                    <Trash2 size={13} />
                  </button>
                </button>
              ))}
            </div>
          ) : (
            <div className="chat-sidebar__locked">
              <div className="chat-sidebar__locked-icon">
                <Lock size={22} />
              </div>
              <p className="chat-sidebar__locked-title">Fitur Premium</p>
              <p className="chat-sidebar__locked-desc">Simpan & akses riwayat percakapan dengan upgrade ke Premium.</p>
              <button
                className="chat-sidebar__locked-btn"
                onClick={() => setShowUpgradeModal?.(true)}
              >
                <Crown size={14} /> Upgrade
              </button>
            </div>
          )}
        </aside>

        {/* ── Main Chat ── */}
        <div className="chat-main">
          {/* Toggle sidebar button — premium only */}
          {isPremium && (
            <button
              className="chat-sidebar-toggle"
              onClick={() => setSidebarOpen(prev => !prev)}
              title={sidebarOpen ? 'Sembunyikan riwayat' : 'Tampilkan riwayat'}
            >
              {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          )}

          <div className="chat-container">
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header__icon">
                <Bot size={20} />
              </div>
              <div className="chat-header__title">
                <h2>Konsultasi AI <Sparkles size={14} style={{ color: '#f59e0b', display: 'inline' }} /></h2>
                <p>Powered by OpenRouter Auto</p>
              </div>
              {isPremium && (
                <button
                  className="chat-header__new-btn"
                  onClick={handleNewChat}
                  title="Mulai chat baru"
                >
                  <Plus size={16} /> <span>Baru</span>
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {error && (
                <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '0.9rem' }}>
                  {error}
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-message chat-message--${msg.role}`}>
                  <div className={`message-avatar message-avatar--${msg.role}`}>
                    {msg.role === 'ai' ? <Bot size={18} /> : (user?.username?.charAt(0)?.toUpperCase() || 'U')}
                  </div>
                  <div className="message-bubble">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="chat-message chat-message--ai">
                  <div className="message-avatar message-avatar--ai">
                    <Bot size={18} />
                  </div>
                  <div className="message-bubble" style={{ padding: '12px 16px' }}>
                    <div className="typing-indicator">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}

              {isLimitReached && (
                <div className="premium-chat-banner">
                  <div className="premium-chat-banner__content">
                    <Lock size={20} style={{ color: '#f59e0b' }} />
                    <p>Batas <strong>{FREE_LIMIT} pesan gratis</strong> telah tercapai. Upgrade untuk terus ngobrol!</p>
                  </div>
                  <button className="btn-primary btn-small" onClick={() => setShowUpgradeModal?.(true)}>
                    <Crown size={14} /> Upgrade Premium
                  </button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-area">
              <form className="chat-form" onSubmit={handleSendMessage} style={{ opacity: isLimitReached ? 0.6 : 1 }}>
                <textarea
                  ref={textareaRef}
                  className="chat-textarea"
                  placeholder={isLimitReached ? 'Batas pesan tercapai...' : 'Tanyakan sesuatu tentang cara belajar...'}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  disabled={typing || !chatSession || isLimitReached}
                  rows={1}
                />
                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={!input.trim() || typing || !chatSession || isLimitReached}
                >
                  <Send size={18} style={{ marginLeft: '-2px' }} />
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
