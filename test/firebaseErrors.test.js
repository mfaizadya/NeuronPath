import { describe, it, expect } from 'vitest';
import { getFirebaseErrorMessage } from '../src/utils/firebaseErrors';

describe('Firebase Errors Util', () => {
  it('returns correct message for known codes', () => {
    expect(getFirebaseErrorMessage({ code: 'auth/user-not-found' })).toBe('Akun dengan email ini tidak ditemukan');
    expect(getFirebaseErrorMessage({ code: 'auth/invalid-credential' })).toBe('Email atau password salah');
    expect(getFirebaseErrorMessage({ code: 'auth/too-many-requests' })).toBe('Terlalu banyak percobaan, coba lagi nanti');
  });

  it('returns fallback message if code is unknown', () => {
    expect(getFirebaseErrorMessage({ code: 'unknown-code' })).toBe('Terjadi kesalahan, coba lagi');
  });

  it('returns original error message if no translation exists', () => {
    expect(getFirebaseErrorMessage({ code: 'unknown-code', message: 'Original Error' })).toBe('Original Error');
  });

  it('handles null or undefined error safely', () => {
    expect(getFirebaseErrorMessage(null)).toBe('Terjadi kesalahan, coba lagi');
    expect(getFirebaseErrorMessage(undefined)).toBe('Terjadi kesalahan, coba lagi');
  });
});
