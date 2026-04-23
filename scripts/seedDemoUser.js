/**
 * Script untuk membuat akun Demo User di Firebase Auth + Firestore
 * 
 * CARA PAKAI:
 * 1. Pastikan file "serviceAccountKey.json" sudah ada di folder scripts/
 * 2. Jalankan: node scripts/seedDemoUser.js
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'serviceAccountKey.json'), 'utf8')
);

initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth();
const db = getFirestore();

const DEMO_EMAIL = 'demo@neuronpath.com';
const DEMO_PASSWORD = 'demo12345678';
const DEMO_USERNAME = 'Demo User';

async function seedDemoUser() {
  console.log('👤 Membuat akun Demo User...\n');

  try {
    // Cek apakah user sudah ada
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(DEMO_EMAIL);
      console.log('  ℹ️  Akun demo sudah ada, skip pembuatan Auth.');
    } catch {
      // User belum ada, buat baru
      userRecord = await auth.createUser({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        displayName: DEMO_USERNAME,
        emailVerified: true,
      });
      console.log(`  ✅ Akun Auth berhasil dibuat: ${userRecord.uid}`);
    }

    // Buat/update dokumen Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      username: DEMO_USERNAME,
      email: DEMO_EMAIL,
      role: 'user',
      photoURL: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }, { merge: true });

    console.log('  ✅ Profil Firestore berhasil dibuat/diupdate.');
    console.log(`\n🎉 Demo user siap digunakan!`);
    console.log(`   Email    : ${DEMO_EMAIL}`);
    console.log(`   Password : ${DEMO_PASSWORD}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

seedDemoUser().catch(console.error);
