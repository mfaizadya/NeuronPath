# NeuronPath 🧠

Platform asesmen cerdas berbasis web untuk mengidentifikasi **Gaya Belajar** (Visual, Auditori, Kinestetik) dan **Pola Belajar** (Consistent, Fast Learner, Reflective, Balanced) secara terstruktur, dilengkapi konsultasi AI personal.

> MVP untuk mata kuliah **Software Engineering for Startup** — Telkom University

🌐 **Live:** [neuronpath-25115.web.app](https://neuronpath-25115.web.app)

---

## ✨ Fitur

### Tersedia untuk Semua User
| Fitur | Keterangan |
|---|---|
| 🔐 Autentikasi | Register, Login, Logout via Firebase Auth |
| 📝 Pretest 15 Soal | 9 Pola Belajar + 6 Gaya Belajar, skala Likert 1–5 |
| 📊 Hasil Analisis | Radar Chart, Bar Chart, Smart Insight |
| 📈 Riwayat Tes | Semua hasil tersimpan di Firestore |
| 👤 Profil | Edit username & ganti password |
| 🤖 Konsultasi AI | Chat dengan AI "Neuron" (3 pesan gratis) |
| 🌗 Dark / Light Mode | Toggle tema sesuai preferensi |

### Eksklusif Premium (Rp 29.000/bulan)
| Fitur | Keterangan |
|---|---|
| 💬 AI Chat Unlimited | Tidak ada batas jumlah pesan |
| 📂 History Chat | Simpan & akses riwayat percakapan AI antar sesi |
| 📊 Dashboard Penuh | Radar Chart, Bar Chart, dan Smart Insight tidak terkunci |

---

## 💳 Upgrade Premium

Tersedia dua cara upgrade:

1. **Metode Pembayaran** — Transfer Bank (VA), E-Wallet, Kartu Kredit, QRIS *(simulasi, selalu gagal)*
2. **Kode Aktivasi** — Masukkan kode untuk upgrade instan

> Kode aktivasi: **`NEURON2026`**

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19 + Vite 8 |
| Styling | Vanilla CSS + CSS Variables (glassmorphism) |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| AI | OpenRouter API (`openrouter/auto`) |
| Charts | Recharts (RadarChart, BarChart) |
| Icons | Lucide React |
| Routing | React Router DOM v7 |
| Markdown | react-markdown |

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/mfaizadya/NeuronPath.git
cd NeuronPath
npm install
```

### 2. Setup Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/) → buat project baru
2. Aktifkan **Authentication** → Sign-in method → **Email/Password** → Enable
3. Aktifkan **Cloud Firestore** → Create database → Production mode
4. Project Settings → General → **Your apps** → klik ikon Web (`</>`) → salin konfigurasi
5. Deploy Firestore Security Rules:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add        # pilih project kamu
   firebase deploy --only "firestore:rules"
   ```

### 3. Setup OpenRouter

1. Buka [openrouter.ai](https://openrouter.ai) → buat akun → **API Keys** → buat key baru
2. Salin API key

### 4. Konfigurasi Environment

```bash
cp .env.example .env
```

Isi `.env` dengan nilai dari Firebase Console dan OpenRouter:

```env
# Firebase
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# OpenRouter AI
VITE_OPENROUTER_API_KEY=sk-or-v1-...
```

### 5. (Opsional) Seed Data Awal

Untuk mengisi 15 soal pretest ke Firestore:

1. Firebase Console → Project Settings → **Service Accounts** → **Generate new private key**
2. Simpan file JSON ke `scripts/serviceAccountKey.json`
3. Jalankan:

```bash
node scripts/seedQuestions.js
```

> Jika tidak di-seed, TestPage otomatis menggunakan soal fallback dari `src/data/pretestQuestions.js`.

### 6. Jalankan

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Build & Deploy

```bash
# Build production
npm run build

# Deploy ke Firebase Hosting
firebase deploy --only hosting

# Deploy Firestore rules saja
firebase deploy --only "firestore:rules"
```

---

## 📁 Struktur Proyek

```
neuronpath/
├── public/
├── scripts/
│   ├── seedQuestions.js           # Seed 15 soal ke Firestore
│   └── seedDemoUser.js            # Seed akun demo
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css                  # CSS global + CSS variables (dark/light)
│   ├── config/
│   │   └── firebase.js            # Init Firebase App, Auth, Firestore
│   ├── context/
│   │   ├── AuthContext.jsx        # Auth state + fungsi premium
│   │   └── ThemeContext.jsx       # Dark/Light mode + localStorage
│   ├── services/
│   │   ├── aiService.js           # OpenRouter REST API (fetch langsung)
│   │   ├── chatUsageService.js    # Counter pesan chat free tier
│   │   ├── questionService.js     # Firestore: questions CRUD
│   │   ├── testResultService.js   # Firestore: test results + stats
│   │   └── userService.js         # Firestore: user profile CRUD
│   ├── data/
│   │   ├── pretestQuestions.js    # 15 soal hardcoded (fallback)
│   │   └── scoringEngine.js       # Algoritma scoring deterministik
│   ├── utils/
│   │   └── firebaseErrors.js      # Firebase error → pesan Bahasa Indonesia
│   ├── components/
│   │   ├── ErrorBoundary.jsx      # Global error catcher
│   │   └── UpgradeModal.jsx       # Modal upgrade ke premium
│   ├── layouts/
│   │   ├── AuthLayout.jsx         # Layout halaman auth
│   │   └── MainLayout.jsx         # Sidebar + topbar + hamburger menu
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx      # Stats + charts (premium-gated)
│   │   ├── PretestPage.jsx        # Info sebelum tes
│   │   ├── TestPage.jsx           # Form pengerjaan 15 soal
│   │   ├── ResultPage.jsx         # Hasil analisis + RadarChart
│   │   ├── HistoryPage.jsx        # Riwayat semua tes
│   │   ├── ConsultationPage.jsx   # AI chat + history sesi (premium)
│   │   ├── AccountPage.jsx        # Edit profil & password
│   │   ├── PaymentPage.jsx        # Halaman payment gateway (simulasi)
│   │   └── NotFoundPage.jsx
│   └── routes/
│       └── AppRoutes.jsx          # Route publik, protected, dan payment
├── firestore.rules
├── firebase.json
├── .env.example
└── package.json
```

---

## 🔒 Firestore Security Rules

| Koleksi | Akses |
|---|---|
| `users` | Owner saja. Field `role` tidak bisa diubah client |
| `questions` | Read: semua user login. Write: admin saja |
| `testResults` | Owner saja. Immutable (tidak ada update) |
| `chatUsage` | Owner saja. Update hanya boleh +1 per operasi |

---

## 🗺️ Routing

| Path | Akses | Halaman |
|---|---|---|
| `/` | Public | Landing Page |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/dashboard` | Protected | Dashboard |
| `/pretest` | Protected | Info Pretest |
| `/test` | Protected | Pengerjaan Soal |
| `/result/:id?` | Protected | Hasil Analisis |
| `/history` | Protected | Riwayat Tes |
| `/consultation` | Protected | Konsultasi AI |
| `/account` | Protected | Profil & Keamanan |
| `/payment` | Protected | Payment Gateway |

---

## 🧮 Algoritma Scoring

Scoring bersifat **deterministik** — jawaban yang sama selalu menghasilkan skor yang sama.

```
score = round( (rata-rata jawaban Likert / 5) × 100 )
```

| Soal | Subkategori |
|---|---|
| `g1`, `g4` | Visual |
| `g2`, `g5` | Auditori |
| `g3`, `g6` | Kinestetik |
| `p1`, `p5` | Consistent |
| `p2`, `p6`, `p9` | Fast Learner |
| `p3`, `p7` | Reflective |
| `p4`, `p8` | Balanced |

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik mata kuliah Software Engineering for Startup — Telkom University.

---

Built with ❤️ by [NeuronPath Team]