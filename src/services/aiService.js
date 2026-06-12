const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Buat sesi konsultasi AI dengan konteks profil belajar user.
 * Menggunakan fetch langsung ke OpenRouter REST API (browser-compatible).
 *
 * @param {Object} userData - { username, gayaDominant, polaDominant }
 * @returns {{ sendMessage: (text: string) => Promise<string> }}
 */
export const createConsultationSession = (userData) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error(
      'API Key OpenRouter belum dikonfigurasi. Silakan tambahkan VITE_OPENROUTER_API_KEY di file .env'
    );
  }

  const gayaBelajar = userData?.gayaDominant || 'Belum diketahui';
  const polaBelajar = userData?.polaDominant || 'Belum diketahui';
  const userName    = userData?.username     || 'Siswa';

  const systemPrompt = `Kamu adalah "Neuron", seorang asisten konsultan edukasi dari platform NeuronPath.
Tugas utamamu adalah membantu menjawab pertanyaan seputar metode belajar, manajemen waktu, dan strategi memahami pelajaran dengan ramah, suportif, dan menggunakan bahasa Indonesia yang santai tapi profesional.

Konteks Pengguna Saat Ini:
- Nama: ${userName}
- Gaya Belajar Dominan: ${gayaBelajar}
- Pola Belajar Dominan: ${polaBelajar}

Instruksi Penting:
1. Selalu pertimbangkan Gaya dan Pola belajar pengguna saat memberikan saran.
2. Jawaban harus ringkas, jelas, dan menggunakan format yang mudah dibaca (bullet points, bold).
3. Jangan membahas hal di luar pendidikan, belajar, produktivitas, atau psikologi belajar.
4. Gunakan emoji yang relevan secukupnya.`;

  // Riwayat percakapan multi-turn
  const history = [
    { role: 'system', content: systemPrompt },
  ];

  /**
   * Kirim pesan user dan dapatkan respons AI via fetch.
   * @param {string} text
   * @returns {Promise<string>}
   */
  const sendMessage = async (text) => {
    history.push({ role: 'user', content: text });

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'NeuronPath',
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        messages: history,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`OpenRouter error ${res.status}: ${errBody}`);
    }

    const data = await res.json();
    const aiText =
      data.choices?.[0]?.message?.content ||
      'Maaf, saya tidak bisa memproses permintaan Anda saat ini.';

    history.push({ role: 'assistant', content: aiText });

    return aiText;
  };

  return { sendMessage, history };
};
