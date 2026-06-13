import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getActiveQuestions,
  getAllQuestions,
  addQuestion,
  updateQuestion,
  toggleQuestionActive,
  deleteQuestion
} from '../src/services/questionService';
import { getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(),
    doc: vi.fn(),
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    serverTimestamp: vi.fn(() => 'MOCK_TIMESTAMP'),
  };
});
vi.mock('../src/config/firebase', () => ({
  db: {},
}));

describe('Question Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getActiveQuestions', () => {
    it('returns formatted active questions', async () => {
      getDocs.mockResolvedValueOnce({
        docs: [
          { id: 'q1', data: () => ({ text: 'Test Q1' }) }
        ]
      });
      const res = await getActiveQuestions();
      expect(res.length).toBe(1);
      expect(res[0].id).toBe('q1');
      expect(res[0].text).toBe('Test Q1');
    });
  });

  describe('getAllQuestions', () => {
    it('returns formatted questions', async () => {
      getDocs.mockResolvedValueOnce({
        docs: [
          { id: 'q1', data: () => ({ text: 'Test Q1' }) }
        ]
      });
      const res = await getAllQuestions();
      expect(res.length).toBe(1);
    });
  });

  describe('addQuestion', () => {
    it('calls addDoc with active true', async () => {
      await addQuestion({ text: 'New Q' });
      expect(addDoc).toHaveBeenCalledWith(undefined, {
        text: 'New Q',
        isActive: true,
        createdAt: 'MOCK_TIMESTAMP',
      });
    });
  });

  describe('updateQuestion', () => {
    it('calls updateDoc with updates', async () => {
      await updateQuestion('q1', { text: 'Updated Q' });
      expect(updateDoc).toHaveBeenCalledWith(undefined, {
        text: 'Updated Q',
      });
    });
  });

  describe('toggleQuestionActive', () => {
    it('calls updateDoc with active state', async () => {
      await toggleQuestionActive('q1', false);
      expect(updateDoc).toHaveBeenCalledWith(undefined, {
        isActive: false,
      });
    });
  });

  describe('deleteQuestion', () => {
    it('calls deleteDoc', async () => {
      await deleteQuestion('q1');
      expect(deleteDoc).toHaveBeenCalled();
    });
  });
});
