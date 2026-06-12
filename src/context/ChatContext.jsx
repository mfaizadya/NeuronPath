/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { createConsultationSession } from '../services/aiService';
import { getChatUsage, incrementChatUsage } from '../services/chatUsageService';
import { getUserDashboardStats } from '../services/testResultService';

const ChatContext = createContext(null);

// ── LocalStorage helpers ──────────────────────────────────────────────────────
const storageKey = (uid) => `neuronpath_chat_sessions_${uid}`;

export const loadSessions = (uid) => {
  try {
    const raw = localStorage.getItem(storageKey(uid));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

export const saveSessions = (uid, sessions) => {
  try {
    localStorage.setItem(storageKey(uid), JSON.stringify(sessions));
  } catch { /* quota exceeded */ }
};

export const createNewSession = (greeting) => ({
  id: Date.now().toString(),
  title: 'Chat Baru',
  createdAt: new Date().toISOString(),
  messages: [{ role: 'ai', content: greeting }],
});

export const formatSessionDate = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 86400000) return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  if (diff < 604800000) return d.toLocaleDateString('id-ID', { weekday: 'short' });
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

export const FREE_LIMIT = 3;

// ── Provider ──────────────────────────────────────────────────────────────────
export function ChatProvider({ children }) {
  const { user } = useAuth();
  const isPremium = !!user?.isPremium;

  const [sessions, setSessions]       = useState([]);
  const [activeId, setActiveId]       = useState(null);
  const [chatSession, setChatSession] = useState(null);
  const [chatCount, setChatCount]     = useState(0);
  const [userStats, setUserStats]     = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [initError, setInitError]     = useState('');

  // Ref to avoid stale closure in buildAiSession
  const userStatsRef = useRef(null);
  userStatsRef.current = userStats;

  const isLimitReached = !isPremium && chatCount >= FREE_LIMIT;
  const activeSession  = sessions.find(s => s.id === activeId) || null;

  // ── Persist (premium only) ──
  useEffect(() => {
    if (user?.uid && isPremium && sessions.length > 0) {
      saveSessions(user.uid, sessions);
    }
  }, [sessions, user?.uid, isPremium]);

  // ── Build AI session ──
  const buildAiSession = useCallback((stats, existingMessages = []) => {
    const userData = {
      username:     user?.username,
      gayaDominant: stats?.gayaDominant || 'Belum diketahui',
      polaDominant: stats?.polaDominant || 'Belum diketahui',
    };
    const session = createConsultationSession(userData);
    existingMessages.forEach(m => {
      if (m.role === 'user')      session.history.push({ role: 'user',      content: m.content });
      else if (m.role === 'ai')   session.history.push({ role: 'assistant', content: m.content });
    });
    return session;
  }, [user?.username]);

  // ── Initialize once per user ──
  useEffect(() => {
    if (!user?.uid) return;

    const init = async () => {
      try {
        const count = await getChatUsage(user.uid);
        setChatCount(count);
      } catch { /* ignore */ }

      let stats = null;
      try {
        stats = await getUserDashboardStats(user.uid);
        setUserStats(stats);
      } catch { /* ignore */ }

      const greeting = `Halo ${user?.username}! 👋 Saya Neuron, AI konsultan belajarmu.\n\nSaya lihat gaya belajarmu cenderung **${stats?.gayaDominant || 'belum diketahui'}** dan polamu **${stats?.polaDominant || 'belum diketahui'}**. Ada materi spesifik yang ingin kamu pelajari hari ini, atau butuh tips belajar yang cocok buat kamu?`;

      try {
        const saved = isPremium ? loadSessions(user.uid) : [];
        if (saved.length > 0) {
          setSessions(saved);
          const last = saved[saved.length - 1];
          setActiveId(last.id);
          setChatSession(buildAiSession(stats, last.messages));
        } else {
          const fresh = createNewSession(greeting);
          setSessions([fresh]);
          setActiveId(fresh.id);
          setChatSession(buildAiSession(stats, []));
        }
      } catch (err) {
        console.error('ChatContext init error:', err);
        setInitError(err.message || 'Gagal terhubung ke AI.');
      } finally {
        setInitialized(true);
      }
    };

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, user?.username]);

  // ── Actions ──
  const selectSession = useCallback((id) => {
    const target = sessions.find(s => s.id === id);
    if (!target) return;
    setActiveId(id);
    try {
      setChatSession(buildAiSession(userStatsRef.current, target.messages));
    } catch { /* ignore */ }
  }, [sessions, buildAiSession]);

  const newChat = useCallback(() => {
    const greeting = `Halo lagi ${user?.username}! 👋 Ada yang ingin kamu tanyakan seputar belajar hari ini?`;
    const fresh = createNewSession(greeting);
    setSessions(prev => [...prev, fresh]);
    setActiveId(fresh.id);
    try {
      setChatSession(buildAiSession(userStatsRef.current, []));
    } catch { /* ignore */ }
  }, [user?.username, buildAiSession]);

  const deleteSession = useCallback((id) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id);
      if (id === activeId) {
        if (updated.length > 0) {
          const last = updated[updated.length - 1];
          setActiveId(last.id);
          try { setChatSession(buildAiSession(userStatsRef.current, last.messages)); } catch { /* ignore */ }
        } else {
          setActiveId(null);
          setChatSession(null);
        }
      }
      if (user?.uid && isPremium) saveSessions(user.uid, updated);
      return updated;
    });
  }, [activeId, buildAiSession, user?.uid, isPremium]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || !chatSession || isLimitReached) return;

    // Append user message
    setSessions(prev => prev.map(s => {
      if (s.id !== activeId) return s;
      const updated = { ...s, messages: [...s.messages, { role: 'user', content: text }] };
      if (s.title === 'Chat Baru') {
        updated.title = text.length > 40 ? text.slice(0, 40) + '…' : text;
      }
      return updated;
    }));

    try {
      const aiText = await chatSession.sendMessage(text);
      setSessions(prev => prev.map(s =>
        s.id === activeId
          ? { ...s, messages: [...s.messages, { role: 'ai', content: aiText }] }
          : s
      ));
      if (!isPremium && user?.uid) {
        try {
          const newCount = await incrementChatUsage(user.uid);
          setChatCount(newCount);
        } catch { /* ignore */ }
      }
      return aiText;
    } catch (err) {
      console.error('sendMessage error:', err);
      setSessions(prev => prev.map(s =>
        s.id === activeId
          ? { ...s, messages: [...s.messages, { role: 'ai', content: 'Maaf, terjadi kesalahan pada jaringan atau API.' }] }
          : s
      ));
      throw err;
    }
  }, [chatSession, activeId, isLimitReached, isPremium, user?.uid]);

  return (
    <ChatContext.Provider value={{
      sessions, activeId, activeSession, chatSession,
      chatCount, userStats, initialized, initError,
      isLimitReached, isPremium,
      selectSession, newChat, deleteSession, sendMessage,
      setSessions, setActiveId,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};
