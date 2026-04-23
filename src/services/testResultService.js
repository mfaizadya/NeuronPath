import {
  collection, doc, getDocs, getDoc, addDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const testResultsRef = collection(db, 'testResults');

/**
 * Simpan hasil tes ke Firestore
 */
export const saveTestResult = async (userId, resultData) => {
  return await addDoc(testResultsRef, {
    userId,
    ...resultData,
    createdAt: serverTimestamp(),
  });
};

/**
 * Ambil riwayat tes milik user, diurutkan terbaru dulu
 */
export const getUserTestHistory = async (userId) => {
  const q = query(
    testResultsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    // Convert Firestore Timestamp ke ISO string agar konsisten
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  }));
};

/**
 * Ambil hasil tes terbaru milik user
 */
export const getLatestTestResult = async (userId) => {
  const q = query(
    testResultsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc_ = snapshot.docs[0];
  return {
    id: doc_.id,
    ...doc_.data(),
    createdAt: doc_.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
};

/**
 * Ambil satu hasil tes berdasarkan ID
 */
export const getTestResultById = async (resultId) => {
  const docRef = doc(db, 'testResults', resultId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
};

/**
 * Hapus hasil tes
 */
export const deleteTestResult = async (resultId) => {
  const docRef = doc(db, 'testResults', resultId);
  return await deleteDoc(docRef);
};

/**
 * Hitung statistik dashboard dari seluruh test results user
 */
export const getUserDashboardStats = async (userId) => {
  const history = await getUserTestHistory(userId);

  if (history.length === 0) {
    return {
      totalTests: 0,
      lastTestDate: null,
      gayaDominant: '-',
      polaDominant: '-',
      averageCompletion: 0,
      history: [],
    };
  }

  const latest = history[0];
  const totalAnswered = history.reduce((sum, r) => sum + (r.answeredQuestions || 0), 0);
  const totalQuestions = history.reduce((sum, r) => sum + (r.totalQuestions || 15), 0);

  return {
    totalTests: history.length,
    lastTestDate: latest.createdAt,
    gayaDominant: latest.gayaBelajar?.dominant || '-',
    polaDominant: latest.polaBelajar?.dominant || '-',
    averageCompletion: totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0,
    history,
  };
};
