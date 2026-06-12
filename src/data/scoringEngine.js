/**
 * NeuronPath Scoring Engine
 * 
 * Algoritma scoring deterministik untuk menghitung gaya belajar dan pola belajar
 * berdasarkan jawaban pretest (skala Likert 1-5).
 * 
 * Mapping soal ke kategori:
 * - Gaya Belajar: g1,g4 → Visual | g2,g5 → Auditori | g3,g6 → Kinestetik
 * - Pola Belajar: p1,p5 → Consistent | p2,p6,p9 → Fast Learner | p3,p7 → Reflective | p4,p8 → Balanced
 */

// Mapping soal ke subkategori gaya belajar
const GAYA_MAP = {
  visual:     ['g1', 'g4'],
  auditori:   ['g2', 'g5'],
  kinestetik: ['g3', 'g6'],
};

// Mapping soal ke subkategori pola belajar
const POLA_MAP = {
  consistent:  ['p1', 'p5'],
  fast:        ['p2', 'p6', 'p9'],
  reflective:  ['p3', 'p7'],
  balanced:    ['p4', 'p8'],
};

/**
 * Hitung skor per kategori dari jawaban.
 * Rumus: (rata-rata jawaban / 5) × 100
 * @param {Object} answers - { questionId: likertValue (1-5) }
 * @param {Object} categoryMap - { categoryName: [questionIds] }
 * @returns {Object} - { categoryName: score (0-100) }
 */
const calculateCategoryScores = (answers, categoryMap) => {
  const scores = {};

  for (const [category, questionIds] of Object.entries(categoryMap)) {
    const values = questionIds
      .map(id => answers[id])
      .filter(v => v !== undefined && v !== null);

    if (values.length > 0) {
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      scores[category] = Math.round((average / 5) * 100);
    } else {
      scores[category] = 0;
    }
  }

  return scores;
};

/**
 * Tentukan kategori dominan dari skor.
 * @param {Object} scores - { categoryName: score }
 * @returns {string} - Nama kategori dengan skor tertinggi
 */
const getDominant = (scores) => {
  let maxScore = -1;
  let dominant = '';

  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      dominant = category;
    }
  }

  return dominant;
};

/**
 * Label tampilan untuk setiap kategori
 */
const DISPLAY_LABELS = {
  visual: 'Visual',
  auditori: 'Auditori',
  kinestetik: 'Kinestetik',
  consistent: 'Consistent',
  fast: 'Fast Learner',
  reflective: 'Reflective',
  balanced: 'Balanced',
};

/**
 * Generate insight berdasarkan gaya dan pola belajar dominan.
 */
const generateInsights = (styleDominant, patternDominant) => {
  const styleLabel = DISPLAY_LABELS[styleDominant] || styleDominant;
  const patternLabel = DISPLAY_LABELS[patternDominant] || patternDominant;

  const styleDescriptions = {
    visual: 'Anda belajar paling efektif melalui diagram, grafik, video, dan visualisasi data.',
    auditori: 'Anda belajar paling efektif melalui diskusi, mendengarkan penjelasan, dan podcast.',
    kinestetik: 'Anda belajar paling efektif melalui praktik langsung, eksperimen, dan simulasi.',
  };

  const patternDescriptions = {
    consistent: 'Anda memiliki rutinitas belajar yang teratur dan konsisten.',
    fast: 'Anda cenderung menyerap materi dengan cepat dan menyelesaikan tugas lebih awal.',
    reflective: 'Anda suka merefleksikan dan mengulang materi untuk pemahaman yang lebih dalam.',
    balanced: 'Anda memiliki keseimbangan yang baik antara berbagai metode belajar.',
  };

  const recommendations = {
    visual: 'gunakan mind-map, infografis, dan video tutorial. Buat catatan berwarna dan gunakan diagram saat merangkum.',
    auditori: 'dengarkan audiobook, ikuti diskusi grup, dan rekam penjelasan untuk didengar ulang.',
    kinestetik: 'lakukan praktik langsung, gunakan flashcard fisik, dan coba teach-back method.',
  };

  return [
    {
      title: 'Gaya Belajar Utama',
      description: `Berdasarkan analisis, gaya belajar dominan Anda adalah **${styleLabel}**. ${styleDescriptions[styleDominant] || ''}`,
      type: 'gaya',
    },
    {
      title: 'Pola Belajar',
      description: `Pola belajar Anda dikategorikan sebagai **${patternLabel}**. ${patternDescriptions[patternDominant] || ''}`,
      type: 'pola',
    },
    {
      title: 'Rekomendasi Personalisasi',
      description: `Untuk memaksimalkan potensi belajar Anda, kami merekomendasikan: ${recommendations[styleDominant] || 'kombinasikan berbagai strategi belajar sesuai gaya Anda.'}`,
      type: 'rekomendasi',
    },
  ];
};

/**
 * Generate hasil analisis dari jawaban pretest.
 * Scoring bersifat deterministik — jawaban yang sama akan selalu menghasilkan hasil yang sama.
 * 
 * @param {Object} answers - Jawaban user: { 'p1': 4, 'g1': 5, ... }
 * @returns {Object} - Hasil analisis lengkap
 */
export const generateResult = (answers) => {
  // Hitung skor per kategori
  const gayaScores = calculateCategoryScores(answers, GAYA_MAP);
  const polaScores = calculateCategoryScores(answers, POLA_MAP);

  // Tentukan dominan
  const gayaDominantKey = getDominant(gayaScores);
  const polaDominantKey = getDominant(polaScores);

  const gayaDominantLabel = DISPLAY_LABELS[gayaDominantKey] || gayaDominantKey;
  const polaDominantLabel = DISPLAY_LABELS[polaDominantKey] || polaDominantKey;

  // Generate insights
  const insights = generateInsights(gayaDominantKey, polaDominantKey);

  return {
    id: Date.now(),
    date: new Date().toISOString(),
    gayaBelajar: {
      dominant: gayaDominantLabel,
      scores: gayaScores,
    },
    polaBelajar: {
      dominant: polaDominantLabel,
      scores: polaScores,
    },
    insights,
    totalQuestions: 15,
    answeredQuestions: Object.keys(answers).length,
  };
};
