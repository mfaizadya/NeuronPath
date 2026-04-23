/**
 * Script untuk seed 15 pertanyaan pretest ke Firestore
 * 
 * CARA PAKAI:
 * 1. Buka Firebase Console → Project Settings → Service Accounts
 * 2. Download file JSON service account key
 * 3. Rename menjadi "serviceAccountKey.json" dan letakkan di folder scripts/
 * 4. Jalankan: node scripts/seedQuestions.js
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load service account
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'serviceAccountKey.json'), 'utf8')
);

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const questions = [
  // === POLA BELAJAR (9 soal) ===
  {
    questionText: 'Saya lebih suka belajar secara rutin setiap hari dengan jadwal yang konsisten.',
    category: 'pola',
    order: 1,
  },
  {
    questionText: 'Saya cenderung menyelesaikan materi pelajaran lebih cepat dari waktu yang dijadwalkan.',
    category: 'pola',
    order: 2,
  },
  {
    questionText: 'Saya sering merefleksikan ulang materi yang telah saya pelajari sebelumnya.',
    category: 'pola',
    order: 3,
  },
  {
    questionText: 'Saya bisa menyeimbangkan waktu belajar antara berbagai mata pelajaran secara merata.',
    category: 'pola',
    order: 4,
  },
  {
    questionText: 'Saya merasa lebih nyaman belajar di waktu yang sama setiap harinya.',
    category: 'pola',
    order: 5,
  },
  {
    questionText: 'Saya sering menyelesaikan tugas lebih awal dari tenggat waktu yang diberikan.',
    category: 'pola',
    order: 6,
  },
  {
    questionText: 'Saya suka mengulang materi dari catatan atau video yang sudah saya pelajari sebelumnya.',
    category: 'pola',
    order: 7,
  },
  {
    questionText: 'Ketika belajar, saya membagi waktu secara teratur antara membaca, berlatih, dan istirahat.',
    category: 'pola',
    order: 8,
  },
  {
    questionText: 'Saya memiliki rutinitas belajar yang jarang saya ubah.',
    category: 'pola',
    order: 9,
  },

  // === GAYA BELAJAR (6 soal) ===
  {
    questionText: 'Saya lebih mudah memahami materi jika disajikan dalam bentuk diagram, grafik, atau gambar.',
    category: 'gaya',
    order: 10,
  },
  {
    questionText: 'Saya lebih suka mendengarkan penjelasan guru atau podcast daripada membaca buku teks.',
    category: 'gaya',
    order: 11,
  },
  {
    questionText: 'Saya lebih mudah mengingat sesuatu ketika mempraktikkannya secara langsung.',
    category: 'gaya',
    order: 12,
  },
  {
    questionText: 'Saya sering menggunakan warna atau highlighter saat membuat catatan.',
    category: 'gaya',
    order: 13,
  },
  {
    questionText: 'Saya lebih mudah mengingat informasi setelah mendiskusikannya dengan orang lain.',
    category: 'gaya',
    order: 14,
  },
  {
    questionText: 'Saya suka belajar melalui eksperimen, proyek, atau simulasi langsung.',
    category: 'gaya',
    order: 15,
  },
];

async function seed() {
  console.log('🌱 Mulai seeding pertanyaan pretest...\n');

  const batch = db.batch();

  for (const q of questions) {
    const docRef = db.collection('questions').doc();
    batch.set(docRef, {
      ...q,
      isActive: true,
      createdAt: Timestamp.now(),
    });
    console.log(`  ✅ [${q.category}] Soal ${q.order}: "${q.questionText.substring(0, 50)}..."`);
  }

  await batch.commit();
  console.log(`\n🎉 Berhasil seed ${questions.length} pertanyaan ke Firestore!`);
}

seed().catch(console.error);
