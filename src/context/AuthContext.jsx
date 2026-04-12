import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 1,
  username: 'Demo User',
  email: 'demo@neuronpath.com',
  role: 'user',
  joinDate: '2026-01-15T00:00:00Z',
  avatar: null,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('neuronpath_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('neuronpath_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check demo credentials
        if (email === 'demo@neuronpath.com' && password === 'demo12345678') {
          setUser(DEMO_USER);
          localStorage.setItem('neuronpath_user', JSON.stringify(DEMO_USER));
          resolve(DEMO_USER);
          return;
        }

        // Check registered users
        const registeredUsers = JSON.parse(localStorage.getItem('neuronpath_registered') || '[]');
        const found = registeredUsers.find(u => u.email === email && u.password === password);
        if (found) {
          const userData = { ...found };
          delete userData.password;
          setUser(userData);
          localStorage.setItem('neuronpath_user', JSON.stringify(userData));
          resolve(userData);
          return;
        }

        reject(new Error('Email atau password salah'));
      }, 800);
    });
  };

  const register = (username, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const registeredUsers = JSON.parse(localStorage.getItem('neuronpath_registered') || '[]');
        
        if (registeredUsers.find(u => u.email === email)) {
          reject(new Error('Email sudah terdaftar'));
          return;
        }

        const newUser = {
          id: Date.now(),
          username,
          email,
          password,
          role: 'user',
          joinDate: new Date().toISOString(),
          avatar: null,
        };

        registeredUsers.push(newUser);
        localStorage.setItem('neuronpath_registered', JSON.stringify(registeredUsers));
        resolve(newUser);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('neuronpath_user');
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('neuronpath_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
