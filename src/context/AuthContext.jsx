import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { createUserProfile, getUserProfile, updateUserProfile } from '../services/userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch full profile from Firestore
          let profile = await getUserProfile(firebaseUser.uid);
          if (!profile) {
            // Fallback: create profile if it doesn't exist yet (edge case)
            await createUserProfile(firebaseUser.uid, {
              username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              email: firebaseUser.email,
            });
            profile = await getUserProfile(firebaseUser.uid);
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: profile?.username || firebaseUser.displayName || 'User',
            role: profile?.role || 'user',
            photoURL: firebaseUser.photoURL,
            joinDate: profile?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          });
        } catch (err) {
          console.error('Error fetching user profile:', err);
          // Fallback to basic Firebase Auth data
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            role: 'user',
            photoURL: firebaseUser.photoURL,
            joinDate: new Date().toISOString(),
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Register user baru
   */
  const register = async (username, email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;

    // Set display name di Firebase Auth
    await firebaseUpdateProfile(firebaseUser, { displayName: username });

    // Buat dokumen profil di Firestore
    await createUserProfile(firebaseUser.uid, { username, email });

    return firebaseUser;
  };

  /**
   * Login
   */
  const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  };

  /**
   * Logout
   */
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  /**
   * Update profil (username)
   */
  const updateProfile = async (updates) => {
    if (!auth.currentUser) return;

    // Update Firebase Auth displayName
    if (updates.username) {
      await firebaseUpdateProfile(auth.currentUser, { displayName: updates.username });
    }

    // Update Firestore
    await updateUserProfile(auth.currentUser.uid, updates);

    // Update local state
    setUser(prev => ({ ...prev, ...updates }));
  };

  /**
   * Ganti password
   */
  const changePassword = async (currentPassword, newPassword) => {
    if (!auth.currentUser) throw new Error('Tidak ada user yang login');

    // Re-authenticate dulu (Firebase requirement)
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
    await reauthenticateWithCredential(auth.currentUser, credential);

    // Update password
    await updatePassword(auth.currentUser, newPassword);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
