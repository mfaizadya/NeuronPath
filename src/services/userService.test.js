import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUserProfile, getUserProfile, updateUserProfile, upgradeUserToPremium } from './userService';
import { getDoc, setDoc, updateDoc } from 'firebase/firestore';

vi.mock('firebase/firestore', () => {
  return {
    doc: vi.fn(),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    serverTimestamp: vi.fn(() => 'MOCK_TIMESTAMP'),
  };
});
vi.mock('../config/firebase', () => ({
  db: {},
}));

describe('User Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createUserProfile', () => {
    it('calls setDoc with correct payload', async () => {
      await createUserProfile('u1', { username: 'testuser', email: 't@t.com' });
      expect(setDoc).toHaveBeenCalledWith(undefined, {
        uid: 'u1',
        username: 'testuser',
        email: 't@t.com',
        role: 'user',
        isPremium: false,
        photoURL: null,
        createdAt: 'MOCK_TIMESTAMP',
        updatedAt: 'MOCK_TIMESTAMP',
      });
    });
  });

  describe('getUserProfile', () => {
    it('returns null if does not exist', async () => {
      getDoc.mockResolvedValueOnce({ exists: () => false });
      const user = await getUserProfile('u1');
      expect(user).toBeNull();
    });

    it('returns user data with id if exists', async () => {
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        id: 'u1',
        data: () => ({ username: 'testuser' })
      });
      const user = await getUserProfile('u1');
      expect(user).toEqual({ id: 'u1', username: 'testuser' });
    });
  });

  describe('updateUserProfile', () => {
    it('calls updateDoc with payload and timestamp', async () => {
      await updateUserProfile('u1', { photoURL: 'http://test.com' });
      expect(updateDoc).toHaveBeenCalledWith(undefined, {
        photoURL: 'http://test.com',
        updatedAt: 'MOCK_TIMESTAMP',
      });
    });
  });

  describe('upgradeUserToPremium', () => {
    it('sets isPremium to true', async () => {
      await upgradeUserToPremium('u1');
      expect(updateDoc).toHaveBeenCalledWith(undefined, {
        isPremium: true,
        updatedAt: 'MOCK_TIMESTAMP',
      });
    });
  });
});
