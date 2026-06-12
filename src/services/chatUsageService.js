import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Ambil jumlah chat yang sudah digunakan user
 */
export const getChatUsage = async (userId) => {
  const docRef = doc(db, 'chatUsage', userId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return 0;
  return snapshot.data().count || 0;
};

/**
 * Increment chat count di Firestore
 * Jika dokumen belum ada, buat baru dengan count = 1
 * Jika sudah ada, increment count + 1
 */
export const incrementChatUsage = async (userId) => {
  const docRef = doc(db, 'chatUsage', userId);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) {
    await setDoc(docRef, { count: 1 });
    return 1;
  }
  
  const newCount = (snapshot.data().count || 0) + 1;
  await updateDoc(docRef, { count: newCount });
  return newCount;
};
