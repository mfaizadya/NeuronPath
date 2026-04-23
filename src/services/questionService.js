import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const questionsRef = collection(db, 'questions');

/**
 * Ambil semua pertanyaan aktif, diurutkan berdasarkan order
 */
export const getActiveQuestions = async () => {
  const q = query(
    questionsRef,
    where('isActive', '==', true),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Ambil semua pertanyaan (termasuk nonaktif, untuk admin)
 */
export const getAllQuestions = async () => {
  const q = query(questionsRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Tambah pertanyaan baru
 */
export const addQuestion = async (questionData) => {
  return await addDoc(questionsRef, {
    ...questionData,
    isActive: true,
    createdAt: serverTimestamp(),
  });
};

/**
 * Update pertanyaan
 */
export const updateQuestion = async (questionId, updates) => {
  const docRef = doc(db, 'questions', questionId);
  return await updateDoc(docRef, updates);
};

/**
 * Toggle status aktif pertanyaan
 */
export const toggleQuestionActive = async (questionId, isActive) => {
  const docRef = doc(db, 'questions', questionId);
  return await updateDoc(docRef, { isActive });
};

/**
 * Hapus pertanyaan
 */
export const deleteQuestion = async (questionId) => {
  const docRef = doc(db, 'questions', questionId);
  return await deleteDoc(docRef);
};
