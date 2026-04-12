// Hardcoded AI analysis results and dashboard data

export const learningStyles = {
  visual: { label: 'Visual', score: 78, color: '#00d4ff', icon: 'Eye' },
  auditory: { label: 'Auditori', score: 55, color: '#7c3aed', icon: 'Headphones' },
  kinesthetic: { label: 'Kinestetik', score: 42, color: '#10b981', icon: 'Hand' },
};

export const learningPatterns = {
  consistent: { label: 'Consistent', score: 72, color: '#00d4ff' },
  fast: { label: 'Fast Learner', score: 60, color: '#f59e0b' },
  reflective: { label: 'Reflective', score: 85, color: '#7c3aed' },
  balanced: { label: 'Balanced', score: 68, color: '#10b981' },
};

export const generateResult = (answers) => {
  // Simulasi analisis - hasil hardcoded berdasarkan jawaban
  const polaTotalQs = 9;
  const gayaTotalQs = 6;

  const polaAnswers = Object.entries(answers)
    .filter(([k]) => k.startsWith('p'))
    .map(([, v]) => v);
  const gayaAnswers = Object.entries(answers)
    .filter(([k]) => k.startsWith('g'))
    .map(([, v]) => v);

  const polaAvg = polaAnswers.length > 0 
    ? polaAnswers.reduce((a, b) => a + b, 0) / polaTotalQs 
    : 3;
  const gayaAvg = gayaAnswers.length > 0 
    ? gayaAnswers.reduce((a, b) => a + b, 0) / gayaTotalQs 
    : 3;

  // Determine dominant gaya belajar
  const visualScore = Math.round(40 + (gayaAvg * 10) + Math.random() * 10);
  const auditoryScore = Math.round(30 + (gayaAvg * 8) + Math.random() * 10);
  const kinestheticScore = Math.round(25 + (gayaAvg * 7) + Math.random() * 10);

  const styles = { visualScore, auditoryScore, kinestheticScore };
  const dominantStyle = visualScore >= auditoryScore && visualScore >= kinestheticScore
    ? 'Visual'
    : auditoryScore >= kinestheticScore
    ? 'Auditori'
    : 'Kinestetik';

  // Determine pola belajar
  const patterns = ['Consistent', 'Fast Learner', 'Reflective', 'Balanced'];
  const patternIndex = Math.min(Math.floor(polaAvg), 3);
  const dominantPattern = patterns[patternIndex];

  return {
    id: Date.now(),
    date: new Date().toISOString(),
    gayaBelajar: {
      dominant: dominantStyle,
      scores: {
        visual: Math.min(visualScore, 100),
        auditori: Math.min(auditoryScore, 100),
        kinestetik: Math.min(kinestheticScore, 100),
      },
    },
    polaBelajar: {
      dominant: dominantPattern,
      scores: {
        consistent: Math.round(30 + polaAvg * 12 + Math.random() * 8),
        fast: Math.round(25 + polaAvg * 10 + Math.random() * 12),
        reflective: Math.round(35 + polaAvg * 11 + Math.random() * 10),
        balanced: Math.round(28 + polaAvg * 9 + Math.random() * 15),
      },
    },
    insights: generateInsights(dominantStyle, dominantPattern),
    totalQuestions: 15,
    answeredQuestions: Object.keys(answers).length,
  };
};

const generateInsights = (style, pattern) => [
  {
    title: 'Gaya Belajar Utama',
    description: `Berdasarkan analisis, gaya belajar dominan Anda adalah **${style}**. ${
      style === 'Visual'
        ? 'Anda belajar paling efektif melalui diagram, grafik, video, dan visualisasi data.'
        : style === 'Auditori'
        ? 'Anda belajar paling efektif melalui diskusi, mendengarkan penjelasan, dan podcast.'
        : 'Anda belajar paling efektif melalui praktik langsung, eksperimen, dan simulasi.'
    }`,
    type: 'gaya',
  },
  {
    title: 'Pola Belajar',
    description: `Pola belajar Anda dikategorikan sebagai **${pattern}**. ${
      pattern === 'Consistent'
        ? 'Anda memiliki rutinitas belajar yang teratur dan konsisten.'
        : pattern === 'Fast Learner'
        ? 'Anda cenderung menyerap materi dengan cepat dan menyelesaikan tugas lebih awal.'
        : pattern === 'Reflective'
        ? 'Anda suka merefleksikan dan mengulang materi untuk pemahaman yang lebih dalam.'
        : 'Anda memiliki keseimbangan yang baik antara berbagai metode belajar.'
    }`,
    type: 'pola',
  },
  {
    title: 'Rekomendasi Personalisasi',
    description: `Untuk memaksimalkan potensi belajar Anda, kami merekomendasikan: ${
      style === 'Visual'
        ? 'gunakan mind-map, infografis, dan video tutorial. Buat catatan berwarna dan gunakan diagram saat merangkum.'
        : style === 'Auditori'
        ? 'dengarkan audiobook, ikuti diskusi grup, dan rekam penjelasan untuk didengar ulang.'
        : 'lakukan praktik langsung, gunakan flashcard fisik, dan coba teach-back method.'
    }`,
    type: 'rekomendasi',
  },
];

export const mockTestHistory = [
  {
    id: 1,
    date: '2026-04-10T10:30:00Z',
    gayaBelajar: { dominant: 'Visual', scores: { visual: 82, auditori: 58, kinestetik: 45 } },
    polaBelajar: { dominant: 'Reflective', scores: { consistent: 65, fast: 55, reflective: 85, balanced: 70 } },
    totalQuestions: 15,
    answeredQuestions: 15,
  },
  {
    id: 2,
    date: '2026-04-08T14:15:00Z',
    gayaBelajar: { dominant: 'Auditori', scores: { visual: 50, auditori: 76, kinestetik: 48 } },
    polaBelajar: { dominant: 'Consistent', scores: { consistent: 80, fast: 45, reflective: 60, balanced: 55 } },
    totalQuestions: 15,
    answeredQuestions: 15,
  },
];

export const dashboardStats = {
  totalTests: 2,
  lastTestDate: '2026-04-10',
  gayaDominant: 'Visual',
  polaDominant: 'Reflective',
  averageCompletion: 100,
};
