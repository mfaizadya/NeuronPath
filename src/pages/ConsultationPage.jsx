import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserDashboardStats } from '../services/testResultService';
import { createConsultationSession } from '../services/aiService';
import { Bot, Send, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './ConsultationPage.css';

export default function ConsultationPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  // Adjust textarea height automatically
  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  // Initialize Chat Session with Context
  useEffect(() => {
    const initChat = async () => {
      try {
        // Fetch user context from Firestore
        let dashStats = null;
        if (user?.uid) {
          dashStats = await getUserDashboardStats(user.uid);
        }

        const userData = {
          username: user?.username,
          gayaDominant: dashStats?.gayaDominant || 'Belum diketahui',
          polaDominant: dashStats?.polaDominant || 'Belum diketahui',
        };

        // Create AI session
        const session = createConsultationSession(userData);
        setChatSession(session);

        // Add initial greeting message
        const greeting = `Halo ${user?.username}! 👋 Saya Neuron, AI konsultan belajarmu. \n\nSaya lihat gaya belajarmu cenderung **${userData.gayaDominant}** dan polamu **${userData.polaDominant}**. Ada materi spesifik yang ingin kamu pelajari hari ini, atau butuh tips belajar yang cocok buat kamu?`;
        
        setMessages([{ role: 'ai', content: greeting }]);

      } catch (err) {
        console.error('Failed to initialize AI:', err);
        setError(err.message || 'Gagal terhubung ke AI. Pastikan API key sudah dikonfigurasi.');
        setMessages([{ role: 'ai', content: 'Maaf, sistem AI sedang tidak tersedia saat ini. Silakan periksa konfigurasi API Key Anda.' }]);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [user]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || !chatSession || typing) return;

    const userMessage = input.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // reset height
    }

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setTyping(true);

    try {
      const response = await chatSession.sendMessage({ message: userMessage });
      const aiResponseText = response.text || 'Maaf, saya tidak bisa memproses permintaan Anda saat ini.';
      
      setMessages(prev => [...prev, { role: 'ai', content: aiResponseText }]);
    } catch (err) {
      console.error('Send message error:', err);
      setMessages(prev => [...prev, { role: 'ai', content: 'Maaf, terjadi kesalahan pada jaringan atau API limit.' }]);
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

  if (loading) {
    return (
      <div className="consultation-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 size={32} className="spin" style={{ color: 'var(--accent-blue)' }} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)' }}>Menyiapkan AI Konsultan...</p>
      </div>
    );
  }

  return (
    <div className="consultation-page">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header__icon">
            <Bot size={20} />
          </div>
          <div className="chat-header__title">
            <h2>Konsultasi AI <Sparkles size={14} style={{ color: '#f59e0b', display: 'inline' }} /></h2>
            <p>Powered by Google Gemini</p>
          </div>
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
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <form className="chat-form" onSubmit={handleSendMessage}>
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder="Tanyakan sesuatu tentang cara belajar..."
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={typing || !chatSession}
              rows={1}
            />
            <button 
              type="submit" 
              className="chat-send-btn" 
              disabled={!input.trim() || typing || !chatSession}
            >
              <Send size={18} style={{ marginLeft: '-2px' }} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
