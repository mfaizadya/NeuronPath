// 15 Pertanyaan Pretest: 9 Pola Belajar + 6 Gaya Belajar
// Skala Likert 1-5 (Sangat Tidak Setuju - Sangat Setuju)

export const polaQuestions = [
  {
    id: 'p1',
    question: 'Saya lebih suka belajar secara rutin setiap hari dengan jadwal yang konsisten.',
    category: 'pola',
  },
  {
    id: 'p2',
    question: 'Saya cenderung menyelesaikan materi pelajaran lebih cepat dari waktu yang dijadwalkan.',
    category: 'pola',
  },
  {
    id: 'p3',
    question: 'Saya sering merefleksikan ulang materi yang telah saya pelajari sebelumnya.',
    category: 'pola',
  },
  {
    id: 'p4',
    question: 'Saya bisa menyeimbangkan waktu belajar antara berbagai mata pelajaran secara merata.',
    category: 'pola',
  },
  {
    id: 'p5',
    question: 'Saya merasa lebih nyaman belajar di waktu yang sama setiap harinya.',
    category: 'pola',
  },
  {
    id: 'p6',
    question: 'Saya sering menyelesaikan tugas lebih awal dari tenggat waktu yang diberikan.',
    category: 'pola',
  },
  {
    id: 'p7',
    question: 'Saya suka mengulang materi dari catatan atau video yang sudah saya pelajari sebelumnya.',
    category: 'pola',
  },
  {
    id: 'p8',
    question: 'Ketika belajar, saya membagi waktu secara teratur antara membaca, berlatih, dan istirahat.',
    category: 'pola',
  },
  {
    id: 'p9',
    question: 'Saya memiliki rutinitas belajar yang jarang saya ubah.',
    category: 'pola',
  },
];

export const gayaQuestions = [
  {
    id: 'g1',
    question: 'Saya lebih mudah memahami materi jika disajikan dalam bentuk diagram, grafik, atau gambar.',
    category: 'gaya',
  },
  {
    id: 'g2',
    question: 'Saya lebih suka mendengarkan penjelasan guru atau podcast daripada membaca buku teks.',
    category: 'gaya',
  },
  {
    id: 'g3',
    question: 'Saya lebih mudah mengingat sesuatu ketika mempraktikkannya secara langsung.',
    category: 'gaya',
  },
  {
    id: 'g4',
    question: 'Saya sering menggunakan warna atau highlighter saat membuat catatan.',
    category: 'gaya',
  },
  {
    id: 'g5',
    question: 'Saya lebih mudah mengingat informasi setelah mendiskusikannya dengan orang lain.',
    category: 'gaya',
  },
  {
    id: 'g6',
    question: 'Saya suka belajar melalui eksperimen, proyek, atau simulasi langsung.',
    category: 'gaya',
  },
];

export const likertOptions = [
  { value: 1, label: 'Sangat Tidak Setuju' },
  { value: 2, label: 'Tidak Setuju' },
  { value: 3, label: 'Netral' },
  { value: 4, label: 'Setuju' },
  { value: 5, label: 'Sangat Setuju' },
];

export const getAllQuestions = () => [...polaQuestions, ...gayaQuestions];
