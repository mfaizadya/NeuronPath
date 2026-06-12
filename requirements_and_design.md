# Spesifikasi Kebutuhan & Desain Sistem — NeuronPath 🧠

Dokumen ini menjelaskan spesifikasi kebutuhan (*requirements*), arsitektur folder, desain UI/UX, skema basis data (*database schemas*), serta alur implementasi teknis untuk platform **NeuronPath**.

---

## 📌 1. Pendahuluan & Tujuan Produk
**NeuronPath** adalah platform asesmen cerdas berbasis web yang dirancang untuk mengidentifikasi **Gaya Belajar** (Visual, Auditori, Kinestetik) dan **Pola Belajar** (Consistent, Fast Learner, Reflective, Balanced) pengguna secara terstruktur. Platform ini bertujuan membantu siswa/mahasiswa memahami metode belajar terbaik mereka serta berkonsultasi langsung dengan asisten kecerdasan buatan (AI) yang dipersonalisasi.

---

## 📋 2. Spesifikasi Kebutuhan Produk (PRD)

### A. Kebutuhan Fungsional (Functional Requirements)
1. **Autentikasi Pengguna**:
   - Pengguna dapat mendaftar (*Register*) menggunakan email, password, dan username.
   - Pengguna dapat masuk (*Login*) dan keluar (*Logout*).
   - Pengguna dapat mengubah nama profil dan memperbarui kata sandi di halaman pengaturan.
2. **Asesmen Pretest**:
   - Sistem menyediakan 15 soal penilaian berskala Likert (1-5, Sangat Tidak Setuju - Sangat Setuju).
   - Soal terbagi atas **Pola Belajar** (9 soal) dan **Gaya Belajar** (6 soal).
   - Menampilkan indikator kemajuan (*progress bar*) dan daftar status pengerjaan soal di sidebar.
3. **Analisis Hasil**:
   - Menghitung skor persentase untuk masing-masing gaya belajar dan pola belajar.
   - Menyajikan hasil dalam grafik visual (Radar Chart untuk gaya belajar, Bar Chart untuk pola belajar).
   - Menyediakan rangkuman *Smart Insight* & rekomendasi belajar otomatis.
4. **Konsultasi AI ("Neuron")**:
   - Menyediakan fitur *live chat* interaktif dengan asisten AI bernama **Neuron**.
   - Asisten AI menyesuaikan bahasa dan rekomendasi belajar berdasarkan gaya dan pola belajar pengguna yang tersimpan di Firestore.
   - Membatasi pengguna gratis (*free tier*) maksimal mengirim 3 pesan.
5. **Skema Premium**:
   - Pengguna gratis dapat melakukan simulasi peningkatan akun (*Upgrade to Premium*).
   - Akun premium membuka grafik analisis visual di Dashboard dan menghapus batasan pesan chat dengan Neuron.

### B. Kebutuhan Non-Fungsional (Non-Functional Requirements)
1. **Keamanan (Security)**:
   - Semua data sensitif pengguna dilindungi oleh aturan keamanan Firestore (*Firestore Security Rules*).
   - Hanya pengguna bersangkutan yang dapat membaca/menulis data profil mereka sendiri.
2. **Ketersediaan & Kinerja (Performance)**:
   - Halaman web harus responsif dan adaptif baik di perangkat *mobile* maupun *desktop*.
   - Transisi antar halaman lancar (SPA - *Single Page Application*).
3. **Tema Dinamis (Theme)**:
   - Mendukung mode Gelap (*Dark Mode*) dan mode Terang (*Light Mode*) secara instan.

---

## 📁 3. Arsitektur Folder & Routing

Aplikasi menggunakan **React 19** + **Vite** dan di-routing menggunakan **React Router DOM v7**.

### A. Struktur Direktori
```
neuronpath/
├── src/
│   ├── config/
│   │   └── firebase.js         # Inisialisasi Firebase Auth & Firestore
│   ├── context/
│   │   ├── AuthContext.jsx        # Penyedia state otentikasi & premium
│   │   └── ThemeContext.jsx       # State toggle Dark/Light mode
│   ├── services/
│   │   ├── aiService.js           # Integrasi SDK Google GenAI (Gemini-2.0-flash)
│   │   ├── questionService.js     # Layanan Firestore untuk pertanyaan pretest
│   │   ├── testResultService.js   # Layanan Firestore untuk riwayat & statistik hasil tes
│   │   └── userService.js         # Layanan Firestore untuk manajemen profil user
│   ├── pages/
│   │   ├── LandingPage.jsx        # Halaman depan / Landing (Public)
│   │   ├── LoginPage.jsx          # Halaman masuk (Public/Redirect)
│   │   ├── RegisterPage.jsx       # Halaman pendaftaran (Public/Redirect)
│   │   ├── DashboardPage.jsx      # Panel utama statistik & grafik (Protected)
│   │   ├── PretestPage.jsx        # Halaman instruksi tes (Protected)
│   │   ├── TestPage.jsx           # Antarmuka pengisian pretest (Protected)
│   │   ├── ResultPage.jsx         # Detail analisis hasil tes terbaru (Protected)
│   │   ├── HistoryPage.jsx        # Riwayat pengerjaan tes sebelumnya (Protected)
│   │   ├── AccountPage.jsx        # Pengaturan profil & password (Protected)
│   │   └── ConsultationPage.jsx   # Live chat konsultasi asisten AI (Protected)
│   ├── layouts/
│   │   ├── AuthLayout.jsx         # Layout pembungkus auth
│   │   └── MainLayout.jsx         # Layout pembungkus aplikasi (Sidebar & Navbar)
│   ├── data/
│   │   ├── pretestQuestions.js    # Data hardcoded pertanyaan (fallback)
│   │   └── mockResults.js         # Logika scoring & mock insights
│   └── routes/
│       └── AppRoutes.jsx          # Konfigurasi rute publik dan terproteksi
```

### B. Peta Navigasi & Proteksi Rute
- **Rute Publik** (Diakses siapa saja; dialihkan ke `/dashboard` jika sudah login):
  - `/` (Landing Page)
  - `/login` (Sign In)
  - `/register` (Sign Up)
- **Rute Terproteksi** (Hanya untuk pengguna terotentikasi; dialihkan ke `/login` jika belum login):
  - `/dashboard`
  - `/pretest`
  - `/test`
  - `/result`
  - `/history`
  - `/account`
  - `/consultation`

---

## 🗄️ 4. Desain Basis Data (Firestore Schemas)

Sistem menggunakan database NoSQL **Google Cloud Firestore** dengan skema sebagai berikut:

### A. Koleksi `users`
Setiap dokumen ber-ID sesuai dengan `uid` dari Firebase Auth.
```json
{
  "uid": "USER_ID_STRING",
  "username": "Rakan",
  "email": "rakan@example.com",
  "role": "user",
  "isPremium": false,
  "photoURL": null,
  "createdAt": "TIMESTAMP",
  "updatedAt": "TIMESTAMP"
}
```

### B. Koleksi `questions`
Digunakan jika admin ingin mengonfigurasi soal secara dinamis dari cloud. Jika kosong, sistem otomatis memakai fallback data lokal.
```json
{
  "questionText": "Saya lebih suka belajar secara rutin setiap hari...",
  "category": "pola", // "pola" atau "gaya"
  "order": 1,
  "isActive": true,
  "createdAt": "TIMESTAMP"
}
```

### C. Koleksi `testResults`
Dokumen dibuat setiap kali pengguna menyelesaikan pretest.
```json
{
  "userId": "USER_ID_STRING",
  "answers": {
    "p1": 5,
    "p2": 4,
    "g1": 3
  },
  "gayaBelajar": {
    "dominant": "Visual",
    "scores": {
      "visual": 82,
      "auditori": 58,
      "kinestetik": 45
    }
  },
  "polaBelajar": {
    "dominant": "Reflective",
    "scores": {
      "consistent": 65,
      "fast": 55,
      "reflective": 85,
      "balanced": 70
    }
  },
  "insights": [
    {
      "title": "Gaya Belajar Utama",
      "description": "Berdasarkan analisis, gaya belajar dominan Anda adalah...",
      "type": "gaya"
    }
  ],
  "totalQuestions": 15,
  "answeredQuestions": 15,
  "createdAt": "TIMESTAMP"
}
```

---

## 🎨 5. Desain UI & Estetika (Design System)

Aplikasi mengadopsi gaya modern bertema *Cyber-Tech Neon* dengan elemen kaca (*glassmorphism*).

### A. Palet Warna (CSS Variables)
- **Warna Latar Belakang (Dark Mode)**:
  - Utama: `#0f172a` (Slate 900)
  - Sekunder: `#1e293b` (Slate 800)
  - Kartu Kaca: `rgba(30, 41, 59, 0.75)` dengan `backdrop-filter: blur(20px)`
- **Warna Aksen**:
  - Biru Neon: `#00d4ff` (Untuk gaya Visual)
  - Ungu Neon: `#7c3aed` (Untuk pola Belajar / Reflektif)
  - Hijau: `#10b981` (Untuk Konsistensi)
  - Kuning/Amber: `#f59e0b` (Untuk Fast Learner / Energi)
- **Warna Teks**:
  - Utama: `#f1f5f9` (Slate 100)
  - Sekunder: `#94a3b8` (Slate 400)

### B. Tipografi
- Font Utama: **Inter** (untuk keterbacaan teks deskripsi)
- Font Header: **Space Grotesk** (memberikan kesan futuristik dan tegas pada judul)

---

## ⚙️ 6. Alur & Algoritma Implementasi

### A. Alur Scoring Pretest
Skor dihitung berdasarkan rata-rata nilai pilihan skala Likert (1 s.d. 5) yang dimasukkan pengguna:
1. Pengerjaan Soal: Jawaban disimpan dalam struktur key-value `[questionId]: value`.
2. Pengelompokan Soal:
   - Jawaban soal berkode `p1` s.d. `p9` diakumulasi untuk menghitung **Pola Belajar**.
   - Jawaban soal berkode `g1` s.d. `g6` diakumulasi untuk menghitung **Gaya Belajar**.
3. Penentuan Dominansi:
   - **Gaya Belajar**: Nilai dasar (Visual/Auditori/Kinestetik) diberi bobot, lalu ditambahkan variansi acak kecil untuk simulasi keragaman visual. Kategori dengan nilai tertinggi ditetapkan sebagai tipe dominan.
   - **Pola Belajar**: Rata-rata pola belajar (`polaAvg`) mengalokasikan indeks kategori:
     - `polaAvg <= 1` → Consistent
     - `polaAvg == 2` → Fast Learner
     - `polaAvg == 3` → Reflective
     - `polaAvg >= 4` → Balanced
4. Penyimpanan: Hasil yang dihitung beserta insight langsung disimpan di Firestore (`testResults`) dan dipass ke halaman `/result`.

### B. Integrasi Chat Konsultasi AI
1. **Konstruksi Sesi**: Halaman [ConsultationPage.jsx](file:///c:/Users/Rakan/Documents/GitHub/NeuronPath/src/pages/ConsultationPage.jsx) memicu `createConsultationSession(userData)` dari [aiService.js](file:///c:/Users/Rakan/Documents/GitHub/NeuronPath/src/services/aiService.js).
2. **Konteks Prompt (System Instruction)**:
   ```
   Kamu adalah "Neuron", seorang asisten konsultan edukasi dari platform NeuronPath.
   Tugas utamamu adalah membantu menjawab pertanyaan seputar metode belajar dengan bahasa Indonesia yang santai tapi profesional.
   Konteks Pengguna:
   - Nama: {username}
   - Gaya Belajar Dominan: {gayaDominant}
   - Pola Belajar Dominan: {polaDominant}
   ```
3. **Pembatasan Free Tier**: Jika pengguna belum premium, setiap pesan yang dikirim menambahkan `chatCount`. Jika `chatCount >= 3`, input dinonaktifkan dan spanduk penawaran upgrade premium ditampilkan.

---

## 🧪 7. Rencana Verifikasi & Pengujian
1. **Pengujian Autentikasi**:
   - Mendaftar user baru dan memastikan data masuk ke Authentication & Firestore database.
   - Menguji login dengan kredensial salah untuk memastikan validasi pesan error bekerja.
2. **Pengujian Pengisian Soal**:
   - Memastikan pretest tidak dapat dikirim sebelum semua 15 pertanyaan dijawab.
   - Memverifikasi riwayat pengisian tersimpan dengan benar di Firestore.
3. **Verifikasi Fitur Premium**:
   - Memastikan saat menekan tombol "Upgrade Premium", overlay penguncian di dashboard menghilang dan batasan chat Neuron terhapus.
