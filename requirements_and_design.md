# Spesifikasi Kebutuhan & Desain Sistem — NeuronPath 🧠

Dokumen ini menjelaskan spesifikasi kebutuhan (*requirements*), arsitektur folder, desain UI/UX, skema basis data (*database schemas*), serta alur implementasi teknis untuk platform **NeuronPath**.

> **Status Dokumen:** Diperbarui sesuai kondisi implementasi aktual — Juni 2026.

---

## 📌 1. Pendahuluan & Tujuan Produk

**NeuronPath** adalah platform asesmen cerdas berbasis web yang dirancang untuk mengidentifikasi **Gaya Belajar** (Visual, Auditori, Kinestetik) dan **Pola Belajar** (Consistent, Fast Learner, Reflective, Balanced) pengguna secara terstruktur. Platform ini bertujuan membantu siswa/mahasiswa memahami metode belajar terbaik mereka serta berkonsultasi langsung dengan asisten kecerdasan buatan (AI) yang dipersonalisasi.

---

## 📋 2. Spesifikasi Kebutuhan Produk (PRD)

### A. Kebutuhan Fungsional (Functional Requirements)

1. **Autentikasi Pengguna**
   - Pengguna dapat mendaftar (*Register*) menggunakan email, password, dan username.
   - Pengguna dapat masuk (*Login*) dan keluar (*Logout*).
   - Halaman login menyediakan tombol **"Coba Mode Demo"** yang secara otomatis login menggunakan akun `test@neuronpath.com` / `test12345678`.
   - Pengguna dapat mengubah nama profil dan memperbarui kata sandi di halaman pengaturan.
   - Perubahan password membutuhkan re-autentikasi terlebih dahulu (persyaratan Firebase).
   - Pesan error autentikasi diterjemahkan ke Bahasa Indonesia melalui `firebaseErrors.js`.

2. **Asesmen Pretest**
   - Sistem menyediakan 15 soal penilaian berskala Likert (1–5, Sangat Tidak Setuju – Sangat Setuju).
   - Soal terbagi atas **Pola Belajar** (9 soal: `p1`–`p9`) dan **Gaya Belajar** (6 soal: `g1`–`g6`).
   - TestPage mengambil soal dari koleksi Firestore `questions`. Jika koleksi kosong atau tidak dapat dijangkau, sistem otomatis menggunakan data hardcoded dari `pretestQuestions.js` sebagai fallback.
   - Menampilkan indikator kemajuan (*progress bar*) dan sidebar daftar status pengerjaan soal.
   - Tombol kirim hanya aktif jika seluruh 15 pertanyaan telah dijawab.

3. **Analisis Hasil**
   - Skor dihitung secara **deterministik** oleh `scoringEngine.js` (tidak ada elemen acak/random).
   - Menghitung skor persentase (0–100%) untuk masing-masing subkategori gaya belajar dan pola belajar.
   - Menyajikan hasil dalam grafik visual: **Radar Chart** untuk gaya belajar dan **Bar Chart** untuk pola belajar (menggunakan library Recharts).
   - Menyediakan rangkuman *Smart Insight* & rekomendasi belajar otomatis berdasarkan hasil dominan.
   - Hasil langsung dipass melalui `router.state` ke halaman `/result` untuk menghindari pembacaan ulang dari Firestore. Akses via URL menggunakan `getTestResultById`.

4. **Konsultasi AI ("Neuron")**
   - Menyediakan fitur *live chat* interaktif dengan asisten AI bernama **Neuron**, didukung oleh **Google Gemini 2.0 Flash** melalui SDK `@google/genai`.
   - Asisten AI menggunakan *system instruction* yang dipersonalisasi dengan nama pengguna, gaya belajar dominan, dan pola belajar dominan yang diambil dari Firestore saat sesi dimulai.
   - Respons AI dirender menggunakan `react-markdown` untuk mendukung format teks (bold, bullet points).
   - Textarea input menyesuaikan tinggi secara otomatis hingga maksimum 120px.
   - Membatasi pengguna gratis (*free tier*) maksimal mengirim **3 pesan** per akun.

5. **Skema Premium**
   - Pengguna gratis dapat melakukan simulasi peningkatan akun (*Upgrade to Premium*) melalui `UpgradeModal`.
   - Modal menampilkan simulasi loading selama 2 detik (mensimulasikan payment gateway), kemudian memanggil `upgradeUserToPremium()`.
   - Harga ditampilkan sebagai **Rp 29.000/bulan** (simulasi, tanpa payment gateway nyata).
   - Akun premium membuka:
     - Grafik Radar & Bar Chart di Dashboard (tidak lagi di-overlay)
     - Smart Insight panel di Dashboard
     - Batasan 3 pesan pada chat dengan Neuron dihapus

6. **Tema Dinamis**
   - Mendukung mode Gelap (*Dark Mode*) dan mode Terang (*Light Mode*).
   - Toggle tersedia di Landing Page, AuthLayout, dan sidebar MainLayout.
   - Pilihan tema disimpan di `localStorage` dengan key `neuronpath_theme`.

### B. Kebutuhan Non-Fungsional (Non-Functional Requirements)

1. **Keamanan (Security)**
   - Semua data sensitif dilindungi oleh Firestore Security Rules.
   - Pengguna **tidak dapat** mengubah field `role` dan `isPremium` dari sisi klien (diblokir di Firestore rules).
   - Counter chat (`chatUsage`) hanya bisa di-*increment* sebesar 1 per operasi — mencegah manipulasi dari klien.
   - Hasil tes bersifat **immutable** (tidak ada rule `update` pada koleksi `testResults`).

2. **Ketersediaan & Kinerja (Performance)**
   - Semua halaman di-*lazy load* menggunakan `React.lazy` + `Suspense` untuk code splitting.
   - Error handling global menggunakan komponen `ErrorBoundary` yang menampilkan UI fallback dan tombol "Coba Lagi".
   - Aplikasi responsif untuk perangkat mobile dan desktop.

3. **Penanganan Error**
   - Firebase Auth errors diterjemahkan ke pesan Bahasa Indonesia via `firebaseErrors.js`.
   - Semua pemanggilan Firestore di setiap halaman memiliki try-catch dengan graceful fallback.
   - `ErrorBoundary` membungkus seluruh route tree untuk menangkap render errors yang tidak terduga.

---

## 📦 3. Dependency & Tech Stack

| Dependency | Versi | Kegunaan |
|---|---|---|
| `react` | ^19.2.4 | UI Framework |
| `react-dom` | ^19.2.4 | DOM rendering |
| `react-router-dom` | ^7.14.0 | Routing & navigasi |
| `firebase` | ^12.12.1 | Auth & Firestore |
| `@google/genai` | ^1.50.1 | Integrasi Google Gemini AI |
| `recharts` | ^3.8.1 | RadarChart & BarChart |
| `lucide-react` | ^1.8.0 | Icon library |
| `react-markdown` | ^10.1.0 | Render respons AI |
| `vite` | ^8.0.4 | Build tool |

---

## 📁 4. Arsitektur Folder & Routing

Aplikasi menggunakan **React 19** + **Vite** dan di-routing menggunakan **React Router DOM v7**.

### A. Struktur Direktori

```
neuronpath/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── scripts/
│   ├── seedQuestions.js      # Seed koleksi `questions` ke Firestore via service account
│   └── seedDemoUser.js       # Seed akun demo ke Firebase Auth & Firestore
├── src/
│   ├── App.jsx                # Entry component (hanya merender AppRoutes)
│   ├── main.jsx               # Root render: BrowserRouter > ThemeProvider > AuthProvider > App
│   ├── index.css              # CSS global & variabel tema (dark/light)
│   ├── config/
│   │   └── firebase.js        # Inisialisasi Firebase App, Auth, dan Firestore
│   ├── context/
│   │   ├── AuthContext.jsx    # State autentikasi, profil user, dan fungsi premium
│   │   └── ThemeContext.jsx   # State toggle Dark/Light mode + persistensi localStorage
│   ├── services/
│   │   ├── aiService.js       # Integrasi SDK @google/genai (Gemini 2.0 Flash)
│   │   ├── chatUsageService.js# Baca/tulis counter pesan chat per user di Firestore
│   │   ├── questionService.js # CRUD koleksi `questions` di Firestore
│   │   ├── testResultService.js # CRUD + statistik koleksi `testResults` di Firestore
│   │   └── userService.js     # CRUD profil user di koleksi `users` Firestore
│   ├── data/
│   │   ├── pretestQuestions.js  # Data hardcoded 15 soal (fallback jika Firestore kosong)
│   │   ├── scoringEngine.js     # Algoritma scoring deterministik (DIGUNAKAN oleh TestPage)
│   │   └── mockResults.js       # Data mock lama (TIDAK DIGUNAKAN oleh app, hanya referensi)
│   ├── utils/
│   │   └── firebaseErrors.js  # Mapping kode error Firebase ke pesan Bahasa Indonesia
│   ├── components/
│   │   ├── ErrorBoundary.jsx  # Class component untuk menangkap render errors global
│   │   ├── UpgradeModal.jsx   # Modal simulasi upgrade ke akun premium
│   │   └── UpgradeModal.css
│   ├── layouts/
│   │   ├── AuthLayout.jsx     # Layout halaman auth (tombol kembali + toggle tema)
│   │   ├── MainLayout.jsx     # Layout utama: sidebar navigasi + topbar + Outlet
│   │   └── MainLayout.css
│   ├── pages/
│   │   ├── LandingPage.jsx    # Halaman depan publik
│   │   ├── LoginPage.jsx      # Form login + tombol demo login
│   │   ├── RegisterPage.jsx   # Form registrasi
│   │   ├── DashboardPage.jsx  # Statistik, grafik, Smart Insight (premium-gated)
│   │   ├── PretestPage.jsx    # Halaman instruksi sebelum tes
│   │   ├── TestPage.jsx       # Antarmuka pengisian 15 soal + sidebar tracker
│   │   ├── ResultPage.jsx     # Detail hasil tes: skor, RadarChart, Insights
│   │   ├── HistoryPage.jsx    # Daftar riwayat semua tes yang pernah dikerjakan
│   │   ├── AccountPage.jsx    # Pengaturan profil: ubah username & password
│   │   ├── ConsultationPage.jsx # Live chat AI "Neuron" dengan batas free tier
│   │   └── NotFoundPage.jsx   # Halaman 404
│   ├── assets/
│   │   └── hero.png
│   └── routes/
│       └── AppRoutes.jsx      # Konfigurasi rute publik, terproteksi, dan 404
├── .env                       # Variabel lingkungan (TIDAK di-commit ke git)
├── .env.example               # Template variabel lingkungan
├── firestore.rules            # Aturan keamanan Firestore
├── index.html
├── package.json
└── vite.config.js
```

### B. Variabel Lingkungan (`.env`)

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_GEMINI_API_KEY=...
```

### C. Peta Navigasi & Proteksi Rute

- **Rute Publik** (dialihkan ke `/dashboard` jika sudah login):
  - `/` — Landing Page
  - `/login` — Sign In (termasuk tombol Demo Login)
  - `/register` — Sign Up

- **Rute Terproteksi** (dialihkan ke `/login` jika belum login, menggunakan `MainLayout`):
  - `/dashboard`
  - `/pretest`
  - `/test`
  - `/result/:resultId?`
  - `/history`
  - `/account`
  - `/consultation`

- **Fallback:** `*` → `NotFoundPage`

---

## 🗄️ 5. Desain Basis Data (Firestore Schemas)

Sistem menggunakan database NoSQL **Google Cloud Firestore** dengan empat koleksi utama.

### A. Koleksi `users`
ID dokumen = `uid` dari Firebase Auth.
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
Digunakan jika admin ingin mengonfigurasi soal secara dinamis dari Firestore. Jika kosong atau tidak dapat dijangkau, sistem otomatis memakai data lokal `pretestQuestions.js` sebagai fallback.
```json
{
  "questionText": "Saya lebih suka belajar secara rutin setiap hari...",
  "category": "pola",
  "order": 1,
  "isActive": true,
  "createdAt": "TIMESTAMP"
}
```
> Akses write dibatasi hanya untuk user dengan `role == "admin"`.

### C. Koleksi `testResults`
Dibuat setiap kali pengguna menyelesaikan dan mengirimkan pretest. **Tidak ada rule update** — semua dokumen bersifat immutable.
```json
{
  "userId": "USER_ID_STRING",
  "answers": {
    "p1": 5, "p2": 4, "g1": 3
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

### D. Koleksi `chatUsage`
ID dokumen = `uid` pengguna. Digunakan untuk membatasi pesan gratis.
```json
{
  "count": 3
}
```
> Firestore rules hanya mengizinkan: create dengan `count == 1`, dan update dengan `count == resource.data.count + 1`. Ini mencegah manipulasi counter dari sisi klien.

---

## 🔒 6. Firestore Security Rules (Ringkasan)

| Koleksi | Read | Create | Update | Delete |
|---|---|---|---|---|
| `users/{uid}` | Owner saja | Owner saja | Owner saja, **kecuali** field `role` & `isPremium` | ✗ |
| `questions/{id}` | Semua user login | Admin saja | Admin saja | Admin saja |
| `testResults/{id}` | Owner saja | Owner saja | ✗ (immutable) | Owner saja |
| `chatUsage/{uid}` | Owner saja | Owner (`count == 1`) | Owner (`count == count + 1`) | ✗ |

---

## 🎨 7. Desain UI & Estetika (Design System)

Aplikasi mengadopsi gaya modern bertema *Cyber-Tech Neon* dengan elemen kaca (*glassmorphism*).

### A. Palet Warna (CSS Variables)

| Variabel | Dark Mode | Light Mode | Kegunaan |
|---|---|---|---|
| `--bg-primary` | `#0f172a` | `#f1f5f9` | Latar belakang utama |
| `--bg-secondary` | `#1e293b` | `#e2e8f0` | Latar kartu/sidebar |
| `--accent-blue` | `#00d4ff` | `#0284c7` | Gaya Visual, aksi utama |
| `--accent-purple` | `#7c3aed` | `#7c3aed` | Pola belajar / Reflektif |
| `--accent-amber` | `#f59e0b` | `#f59e0b` | Fast Learner / energi |
| `--text-primary` | `#f1f5f9` | `#0f172a` | Teks utama |
| `--text-secondary` | `#94a3b8` | `#64748b` | Teks deskripsi/subtitle |

### B. Tipografi
- Font Utama: **Inter** (keterbacaan teks deskripsi)
- Font Header: **Space Grotesk** (kesan futuristik pada judul)

### C. Komponen UI Kunci
- **`.glass-card`** — Kartu dengan `backdrop-filter: blur(20px)` dan border semi-transparan
- **`.btn-primary` / `.btn-secondary` / `.btn-ghost`** — Sistem tombol konsisten di seluruh app
- **`.gradient-text`** — Judul dengan gradient warna aksen
- **`.animate-fade-in` / `.animate-fade-in-up`** — Animasi masuk halaman
- **`.spin`** — Animasi rotasi untuk ikon loading (digunakan bersama `Loader2` dari Lucide)

---

## ⚙️ 8. Alur & Algoritma Implementasi

### A. Alur Scoring Pretest (Implementasi Aktual — `scoringEngine.js`)

Scoring bersifat **sepenuhnya deterministik** — jawaban yang sama selalu menghasilkan skor yang sama.

**Mapping soal ke subkategori:**

| Soal | Kategori | Subkategori |
|---|---|---|
| `g1`, `g4` | Gaya Belajar | Visual |
| `g2`, `g5` | Gaya Belajar | Auditori |
| `g3`, `g6` | Gaya Belajar | Kinestetik |
| `p1`, `p5` | Pola Belajar | Consistent |
| `p2`, `p6`, `p9` | Pola Belajar | Fast Learner |
| `p3`, `p7` | Pola Belajar | Reflective |
| `p4`, `p8` | Pola Belajar | Balanced |

**Formula skor per subkategori:**
```
score = round( (rata-rata jawaban Likert dalam subkategori / 5) × 100 )
```

**Penentuan dominan:** Subkategori dengan skor tertinggi dipilih sebagai tipe dominan.

**Insight:** Dihasilkan dari lookup table berdasarkan kombinasi `gayaDominan` × `polaDominan`.

**Alur data lengkap:**
```
TestPage
  └─ getActiveQuestions()         ← Firestore (atau fallback pretestQuestions.js)
  └─ User mengisi 15 soal
  └─ handleSubmit()
       └─ generateResult(answers) ← scoringEngine.js (deterministik)
       └─ saveTestResult(uid, ...) ← Firestore testResults
       └─ navigate('/result/:id', { state: { result } })

ResultPage
  ├─ Dari router state            ← Langsung tampil (tanpa fetch Firestore)
  └─ Dari URL /result/:id         ← getTestResultById(resultId)
```

> **Catatan:** `mockResults.js` masih ada di codebase sebagai referensi iterasi awal, tetapi **tidak digunakan** oleh alur aplikasi. Scoring aktual sepenuhnya ditangani oleh `scoringEngine.js`.

### B. Inisialisasi Chat AI (`aiService.js`)

1. SDK diinisialisasi dengan `VITE_GEMINI_API_KEY` saat modul dimuat. Jika key tidak ada, `ai` diset `null` dan error dilempar saat `createConsultationSession()` dipanggil.
2. `ConsultationPage` memanggil `getUserDashboardStats(uid)` untuk mendapat `gayaDominant` dan `polaDominant` dari Firestore.
3. `createConsultationSession(userData)` membuat sesi chat `gemini-2.0-flash` dengan *system instruction* yang menyertakan nama, gaya, dan pola belajar pengguna.
4. Setiap pengiriman pesan memanggil `chatSession.sendMessage({ message })` dan menampilkan respons yang dirender sebagai Markdown.
5. Setelah respons berhasil diterima, `incrementChatUsage(uid)` dipanggil untuk update counter di Firestore (hanya untuk user non-premium).

**System Instruction Template:**
```
Kamu adalah "Neuron", seorang asisten konsultan edukasi dari platform NeuronPath.
Konteks Pengguna:
- Nama: {username}
- Gaya Belajar Dominan: {gayaDominant}
- Pola Belajar Dominan: {polaDominant}
```

### C. Alur Autentikasi

```
Register:
  createUserWithEmailAndPassword()  ← Firebase Auth
  updateProfile({ displayName })    ← Firebase Auth
  createUserProfile(uid, data)      ← Firestore users/{uid}
  → navigate('/login')

Login:
  signInWithEmailAndPassword()      ← Firebase Auth
  onAuthStateChanged callback
    └─ getUserProfile(uid)          ← Firestore users/{uid}
    └─ setUser({ uid, email, username, role, isPremium, ... })
  → navigate('/dashboard')

Change Password:
  reauthenticateWithCredential()    ← Firebase Auth (wajib)
  updatePassword()                  ← Firebase Auth
```

---

## 🛠️ 9. Scripts Developer

Tersedia di folder `scripts/` untuk setup lingkungan development:

| Script | Kegunaan |
|---|---|
| `node scripts/seedQuestions.js` | Mengisi koleksi `questions` di Firestore dengan 15 soal default |
| `node scripts/seedDemoUser.js` | Membuat akun demo (`test@neuronpath.com` / `test12345678`) di Firebase Auth & Firestore |

> Script ini menggunakan Firebase Admin SDK dengan service account, sehingga dijalankan di sisi server/terminal — bukan dari browser.

---

## 🧪 10. Rencana Verifikasi & Pengujian

1. **Pengujian Autentikasi**
   - Mendaftar user baru dan memastikan data masuk ke Firebase Auth & Firestore.
   - Login dengan kredensial salah dan verifikasi pesan error tampil dalam Bahasa Indonesia.
   - Login menggunakan tombol "Coba Mode Demo" dan verifikasi redirect ke dashboard.
   - Ganti password dengan re-autentikasi dan tanpa re-autentikasi (harus gagal).

2. **Pengujian Pretest & Scoring**
   - Memastikan tombol "Kirim & Analisis" tidak aktif sebelum semua 15 soal dijawab.
   - Verifikasi hasil scoring deterministik: jawaban yang sama menghasilkan skor yang sama.
   - Verifikasi hasil tersimpan di Firestore dan muncul di riwayat tes.
   - Uji fallback: nonaktifkan koneksi Firestore dan pastikan soal hardcoded dimuat.

3. **Verifikasi Premium**
   - Pastikan overlay kunci tampil di dashboard untuk user free.
   - Klik "Upgrade Premium" dan verifikasi overlay hilang setelah simulasi selesai.
   - Verifikasi batas 3 pesan chat aktif untuk user free dan hilang setelah upgrade.

4. **Pengujian Keamanan**
   - Coba akses route terproteksi tanpa login → harus redirect ke `/login`.
   - Coba tulis langsung ke Firestore dengan mengubah `isPremium: true` → harus ditolak oleh Security Rules.
   - Coba manipulasi `chatUsage` dengan nilai selain `+1` → harus ditolak.
