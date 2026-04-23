import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Buat dokumen profil user di Firestore saat register
 */
export const createUserProfile = async (uid, userData) => {
  const userRef = doc(db, 'users', uid);
  return await setDoc(userRef, {
    uid,
    username: userData.username,
    email: userData.email,
    role: 'user',
    isPremium: false,
    photoURL: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Ambil profil user dari Firestore
 */
export const getUserProfile = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

/**
 * Update profil user
 */
export const updateUserProfile = async (uid, updates) => {
  const userRef = doc(db, 'users', uid);
  return await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Upgrade profil user ke premium
 */
export const upgradeUserToPremium = async (uid) => {
  const userRef = doc(db, 'users', uid);
  return await updateDoc(userRef, {
    isPremium: true,
    updatedAt: serverTimestamp(),
  });
};
