import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  saveTestResult,
  getUserTestHistory,
  getLatestTestResult,
  getTestResultById,
  deleteTestResult,
  getUserDashboardStats
} from './testResultService';
import { getDoc, getDocs, addDoc, deleteDoc } from 'firebase/firestore';

vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    serverTimestamp: vi.fn(() => 'MOCK_TIMESTAMP'),
  };
});
vi.mock('../config/firebase', () => ({
  db: {},
}));

describe('Test Result Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('saveTestResult', () => {
    it('calls addDoc with proper data', async () => {
      await saveTestResult('u1', { score: 100 });
      expect(addDoc).toHaveBeenCalledWith(undefined, {
        userId: 'u1',
        score: 100,
        createdAt: 'MOCK_TIMESTAMP',
      });
    });
  });

  describe('getUserTestHistory', () => {
    it('returns formatted history', async () => {
      getDocs.mockResolvedValueOnce({
        docs: [
          { id: '1', data: () => ({ userId: 'u1', createdAt: { toDate: () => new Date('2023-01-01') } }) }
        ]
      });
      const history = await getUserTestHistory('u1');
      expect(history.length).toBe(1);
      expect(history[0].id).toBe('1');
      expect(history[0].createdAt).toBe(new Date('2023-01-01').toISOString());
    });
  });

  describe('getLatestTestResult', () => {
    it('returns null if empty', async () => {
      getDocs.mockResolvedValueOnce({ empty: true });
      const res = await getLatestTestResult('u1');
      expect(res).toBeNull();
    });

    it('returns formatted latest result', async () => {
      getDocs.mockResolvedValueOnce({
        empty: false,
        docs: [
          { id: '1', data: () => ({ userId: 'u1' }) } // without createdAt.toDate
        ]
      });
      const res = await getLatestTestResult('u1');
      expect(res.id).toBe('1');
      expect(res.userId).toBe('u1');
      expect(res.createdAt).toBeDefined(); // falls back to new Date()
    });
  });

  describe('getTestResultById', () => {
    it('returns null if does not exist', async () => {
      getDoc.mockResolvedValueOnce({ exists: () => false });
      const res = await getTestResultById('r1');
      expect(res).toBeNull();
    });

    it('returns formatted result', async () => {
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        id: 'r1',
        data: () => ({ userId: 'u1' })
      });
      const res = await getTestResultById('r1');
      expect(res.id).toBe('r1');
      expect(res.userId).toBe('u1');
    });
  });

  describe('deleteTestResult', () => {
    it('calls deleteDoc', async () => {
      await deleteTestResult('r1');
      expect(deleteDoc).toHaveBeenCalled();
    });
  });

  describe('getUserDashboardStats', () => {
    it('returns empty stats if no history', async () => {
      getDocs.mockResolvedValueOnce({ docs: [] });
      const stats = await getUserDashboardStats('u1');
      expect(stats.totalTests).toBe(0);
      expect(stats.averageCompletion).toBe(0);
    });

    it('returns calculated stats if history exists', async () => {
      getDocs.mockResolvedValueOnce({
        docs: [
          {
            id: '1',
            data: () => ({
              answeredQuestions: 10,
              totalQuestions: 15,
              gayaBelajar: { dominant: 'Visual' },
              polaBelajar: { dominant: 'Fast' }
            })
          }
        ]
      });
      const stats = await getUserDashboardStats('u1');
      expect(stats.totalTests).toBe(1);
      expect(stats.gayaDominant).toBe('Visual');
      expect(stats.polaDominant).toBe('Fast');
      expect(stats.averageCompletion).toBe(Math.round((10 / 15) * 100));
    });
  });
});
