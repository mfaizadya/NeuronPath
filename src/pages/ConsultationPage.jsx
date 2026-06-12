import { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat, formatSessionDate } from '../context/ChatContext';
import { useOutletContext } from 'react-router-dom';
import {
  Bot, Send, Sparkles, Loader2, Lock, Crown,
  Plus, MessageSquare, Trash2, ChevronLeft, ChevronRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './ConsultationPage.css';

export default function ConsultationPage() {
  const { user } = useAuth();
  const { setShowUpgradeModal } = useOutletContext() || {};

  const {
    sessions, activeId, activeSession,
    initialized, initError, isLimitReached, isPremium,
    selectSession, newChat, deleteSession, sendMessage,
  } = useChat();

  const [input, setInput]   = useState('');
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => !!user?.isPremium);

  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);

  const messages = useMemo(() => activeSession?.messages || [], [activeSession]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || typing || isLimitReached || !initialized) return;
    const text = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setTyping(true);
    try {
      await sendMessage(text);
    } catch { /* error appended by context */ }
    finally { setTyping(false); }
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

  const handleSelectSession = (id) => {
    selectSession(id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleNewChat = () => {
    newChat();
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleDeleteSession = (id, e) => {
    e.stopPropagation();
    deleteSession(id);
  };

  if (!initialized) {
    return (
      <div className="consultation-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 size={32} className="spin" style={{ color: 'var(--accent-blue)' }} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)' }}>Menyiapkan AI Konsultan...</p>
      </div>
    );
  }

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
                  <div className="chat-session-item__icon"><Bot size={14} /></div>
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
              <div className="chat-sidebar__locked-icon"><Lock size={22} /></div>
              <p className="chat-sidebar__locked-title">Fitur Premium</p>
              <p className="chat-sidebar__locked-desc">Simpan & akses riwayat percakapan dengan upgrade ke Premium.</p>
              <button className="chat-sidebar__locked-btn" onClick={() => setShowUpgradeModal?.(true)}>
                <Crown size={14} /> Upgrade
              </button>
            </div>
          )}
        </aside>

        {/* ── Main Chat ── */}
        <div className="chat-main">
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
            <div className="chat-header">
              <div className="chat-header__icon"><Bot size={20} /></div>
              <div className="chat-header__title">
                <h2>Konsultasi AI <Sparkles size={14} style={{ color: '#f59e0b', display: 'inline' }} /></h2>
                <p>Powered by OpenRouter Auto</p>
              </div>
              {isPremium && (
                <button className="chat-header__new-btn" onClick={handleNewChat} title="Mulai chat baru">
                  <Plus size={16} /> <span>Baru</span>
                </button>
              )}
            </div>

            <div className="chat-messages">
              {initError && (
                <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '0.9rem' }}>
                  {initError}
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
                  <div className="message-avatar message-avatar--ai"><Bot size={18} /></div>
                  <div className="message-bubble" style={{ padding: '12px 16px' }}>
                    <div className="typing-indicator">
                      <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}

              {isLimitReached && (
                <div className="premium-chat-banner">
                  <div className="premium-chat-banner__content">
                    <Lock size={20} style={{ color: '#f59e0b' }} />
                    <p>Batas <strong>3 pesan gratis</strong> telah tercapai. Upgrade untuk terus ngobrol!</p>
                  </div>
                  <button className="btn-primary btn-small" onClick={() => setShowUpgradeModal?.(true)}>
                    <Crown size={14} /> Upgrade Premium
                  </button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <form className="chat-form" onSubmit={handleSendMessage} style={{ opacity: isLimitReached ? 0.6 : 1 }}>
                <textarea
                  ref={textareaRef}
                  className="chat-textarea"
                  placeholder={isLimitReached ? 'Batas pesan tercapai...' : 'Tanyakan sesuatu tentang cara belajar...'}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  disabled={typing || isLimitReached}
                  rows={1}
                />
                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={!input.trim() || typing || isLimitReached}
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
