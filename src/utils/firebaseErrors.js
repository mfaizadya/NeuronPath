/**
 * Translate Firebase Auth error codes ke pesan bahasa Indonesia
 */
export const getFirebaseErrorMessage = (error) => {
  const code = error?.code || '';
  
  const messages = {
    'auth/user-not-found': 'Akun dengan email ini tidak ditemukan',
    'auth/wrong-password': 'Password yang Anda masukkan salah',
    'auth/invalid-credential': 'Email atau password salah',
    'auth/email-already-in-use': 'Email sudah terdaftar, silakan login',
    'auth/weak-password': 'Password terlalu lemah, minimal 6 karakter',
    'auth/invalid-email': 'Format email tidak valid',
    'auth/too-many-requests': 'Terlalu banyak percobaan, coba lagi nanti',
    'auth/network-request-failed': 'Tidak ada koneksi internet',
    'auth/requires-recent-login': 'Sesi telah kedaluwarsa, silakan login ulang',
    'auth/user-disabled': 'Akun ini telah dinonaktifkan',
  };

  return messages[code] || error?.message || 'Terjadi kesalahan, coba lagi';
};
