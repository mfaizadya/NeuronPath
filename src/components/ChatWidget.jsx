import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import {
  Bot, Send, X, Maximize2, Loader2,
  Lock, Crown, Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './ChatWidget.css';

export default function ChatWidget({ onUpgrade }) {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const {
    activeSession, initialized, initError,
    isLimitReached, sendMessage, hasPretest,
  } = useChat();

  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);
  const messages = activeSession?.messages || [];

  // Buka otomatis di desktop jika user sudah punya riwayat pretest
  const hasOpenedRef = useRef(false);
  useEffect(() => {
    if (
      !hasOpenedRef.current &&
      initialized &&
      hasPretest &&
      window.innerWidth > 768
    ) {
      hasOpenedRef.current = true;
      setOpen(true);
    }
  }, [initialized, hasPretest]);

  // Auto scroll — always called, no conditional hook
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typing, open]);

  // Hide widget on /consultation page — after all hooks
  const isConsultationPage = location.pathname === '/consultation';
  if (isConsultationPage) return null;

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || typing || isLimitReached || !initialized) return;
    const text = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setTyping(true);
    try {
      await sendMessage(text);
    } catch { /* error already appended by context */ }
    finally { setTyping(false); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        className={`chat-widget-fab ${open ? 'chat-widget-fab--active' : ''}`}
        onClick={() => setOpen(prev => !prev)}
        aria-label="Buka konsultasi AI"
      >
        {open ? <X size={22} /> : <Bot size={22} />}
        {!open && !isLimitReached && (
          <span className="chat-widget-fab__pulse" />
        )}
      </button>

      {/* ── Widget Window ── */}
      {open && (
        <div className="chat-widget animate-fade-in-up">
          {/* Header */}
          <div className="chat-widget__header">
            <div className="chat-widget__header-left">
              <div className="chat-widget__avatar">
                <Bot size={16} />
              </div>
              <div>
                <span className="chat-widget__name">
                  Neuron <Sparkles size={11} style={{ color: '#f59e0b', verticalAlign: 'middle' }} />
                </span>
                <span className="chat-widget__sub">AI Konsultan Belajar</span>
              </div>
            </div>
            <div className="chat-widget__header-actions">
              <button
                className="chat-widget__expand"
                onClick={() => { setOpen(false); navigate('/consultation'); }}
                title="Buka halaman penuh"
              >
                <Maximize2 size={14} />
              </button>
              <button
                className="chat-widget__close"
                onClick={() => setOpen(false)}
                title="Tutup"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-widget__messages">
            {!initialized ? (
              <div className="chat-widget__loading">
                <Loader2 size={20} className="spin" />
                <span>Menyiapkan AI...</span>
              </div>
            ) : initError ? (
              <div className="chat-widget__error">{initError}</div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`chat-widget__msg chat-widget__msg--${msg.role}`}>
                    {msg.role === 'ai' && (
                      <div className="chat-widget__msg-avatar">
                        <Bot size={12} />
                      </div>
                    )}
                    <div className="chat-widget__bubble">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="chat-widget__msg chat-widget__msg--ai">
                    <div className="chat-widget__msg-avatar">
                      <Bot size={12} />
                    </div>
                    <div className="chat-widget__bubble">
                      <div className="typing-indicator">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                    </div>
                  </div>
                )}

                {isLimitReached && (
                  <div className="chat-widget__limit-banner">
                    <Lock size={14} />
                    <span>Batas 3 pesan gratis tercapai.</span>
                    <button onClick={() => { setOpen(false); onUpgrade?.(); }}>
                      <Crown size={12} /> Upgrade
                    </button>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-widget__input-area">
            <form
              className="chat-widget__form"
              onSubmit={handleSend}
              style={{ opacity: isLimitReached || !initialized ? 0.55 : 1 }}
            >
              <textarea
                ref={textareaRef}
                className="chat-widget__textarea"
                placeholder={
                  isLimitReached ? 'Batas pesan tercapai...'
                  : !initialized  ? 'Menyiapkan AI...'
                  : 'Tanya sesuatu...'
                }
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                disabled={typing || isLimitReached || !initialized}
                rows={1}
              />
              <button
                type="submit"
                className="chat-widget__send"
                disabled={!input.trim() || typing || isLimitReached || !initialized}
              >
                {typing ? <Loader2 size={14} className="spin" /> : <Send size={14} />}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
