import { GoogleGenAI } from '@google/genai';

// Initialize SDK only if key is available to prevent crashes on load
let ai = null;
try {
  if (import.meta.env.VITE_GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  }
} catch (e) {
  console.warn("Failed to initialize GoogleGenAI", e);
}

/**
 * Creates a new chat session with the AI
 * @param {Object} userData - User's learning profile to customize the AI's advice
 * @returns {Object} Chat session object
 */
export const createConsultationSession = (userData) => {
  if (!ai) {
    throw new Error('API Key Gemini belum dikonfigurasi. Silakan tambahkan VITE_GEMINI_API_KEY di file .env');
  }

  const gayaBelajar = userData?.gayaDominant || 'Belum diketahui';
  const polaBelajar = userData?.polaDominant || 'Belum diketahui';
  const userName = userData?.username || 'Siswa';

  const systemInstruction = `
Kamu adalah "Neuron", seorang asisten konsultan edukasi dari platform NeuronPath.
Tugas utamamu adalah membantu menjawab pertanyaan seputar metode belajar, manajemen waktu, dan strategi memahami pelajaran dengan ramah, suportif, dan menggunakan bahasa Indonesia yang santai tapi profesional.

Konteks Pengguna Saat Ini:
- Nama: ${userName}
- Gaya Belajar Dominan: ${gayaBelajar}
- Pola Belajar Dominan: ${polaBelajar}

Instruksi Penting:
1. Selalu pertimbangkan Gaya dan Pola belajar pengguna saat memberikan saran. (Misal: jika dia Visual, sarankan mindmap/video. Jika Kinestetik, sarankan praktik langsung).
2. Jawaban harus ringkas, jelas, dan menggunakan format yang mudah dibaca (bullet points, bold).
3. Jangan membahas hal di luar pendidikan, belajar, produktivitas, atau psikologi belajar.
4. Gunakan emoji yang relevan secukupnya.
`;

  return ai.chats.create({
    model: 'gemini-2.0-flash',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    }
  });
};
