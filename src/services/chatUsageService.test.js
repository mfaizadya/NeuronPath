import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getChatUsage, incrementChatUsage } from './chatUsageService';
import { getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Mock firebase
vi.mock('firebase/firestore', () => {
  return {
    doc: vi.fn(),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
  };
});
vi.mock('../config/firebase', () => ({
  db: {},
}));

describe('Chat Usage Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getChatUsage', () => {
    it('returns 0 if doc does not exist', async () => {
      getDoc.mockResolvedValueOnce({ exists: () => false });
      const usage = await getChatUsage('user123');
      expect(usage).toBe(0);
    });

    it('returns count if doc exists', async () => {
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ count: 5 })
      });
      const usage = await getChatUsage('user123');
      expect(usage).toBe(5);
    });

    it('returns 0 if count is missing', async () => {
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({})
      });
      const usage = await getChatUsage('user123');
      expect(usage).toBe(0);
    });
  });

  describe('incrementChatUsage', () => {
    it('sets doc with count 1 if doc does not exist', async () => {
      getDoc.mockResolvedValueOnce({ exists: () => false });
      const newCount = await incrementChatUsage('user123');
      expect(setDoc).toHaveBeenCalled();
      expect(newCount).toBe(1);
    });

    it('updates doc incrementing count if doc exists', async () => {
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ count: 3 })
      });
      const newCount = await incrementChatUsage('user123');
      expect(updateDoc).toHaveBeenCalledWith(undefined, { count: 4 });
      expect(newCount).toBe(4);
    });

    it('updates doc with count 1 if count was missing', async () => {
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({})
      });
      const newCount = await incrementChatUsage('user123');
      expect(updateDoc).toHaveBeenCalledWith(undefined, { count: 1 });
      expect(newCount).toBe(1);
    });
  });
});
