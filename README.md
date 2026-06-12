# NeuronPath 🧠

Platform asesmen cerdas untuk mengidentifikasi **Gaya Belajar** (Visual, Auditori, Kinestetik) dan **Pola Belajar** (Consistent, Fast, Reflective, Balanced) secara terstruktur.

> MVP untuk mata kuliah **Software Engineering for Startup** — Telkom University

## ✨ Fitur

- 🔐 **Autentikasi** — Register, Login, Logout via Firebase Auth
- 📝 **Pretest 15 Soal** — 9 Pola Belajar + 6 Gaya Belajar (skala Likert)
- 📊 **Dashboard** — Statistik, Radar Chart, Bar Chart, Smart Insight
- 📈 **Riwayat Tes** — Semua hasil tes tersimpan di cloud
- 👤 **Profil** — Edit username & ganti password
- 🌗 **Dark/Light Mode** — Toggle tema sesuai preferensi

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19 + Vite |
| Styling | Vanilla CSS (CSS Variables) |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router DOM v7 |

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/mfaizadya/NeuronPath.git
cd NeuronPath
npm install
```

### 2. Setup Firebase Project

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Add project"** → beri nama (misal: `NeuronPath`)
3. Aktifkan **Authentication** → Sign-in method → **Email/Password** → Enable
4. Aktifkan **Cloud Firestore** → Create database → Start in **test mode**
5. Klik ⚙️ **Project Settings** → **General** → scroll ke **Your apps** → klik ikon **Web** (`</>`)
6. Register app → salin konfigurasi Firebase

### 3. Konfigurasi Environment

Salin file `.env.example` menjadi `.env`, lalu isi dengan konfigurasi dari Firebase Console:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=neuronpath-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=neuronpath-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=neuronpath-xxxxx.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 4. (Opsional) Seed Data Awal

Untuk mengisi 15 soal pretest dan akun demo ke Firestore:

1. Buka Firebase Console → Project Settings → **Service Accounts** → **Generate new private key**
2. Simpan file JSON ke `scripts/serviceAccountKey.json`
3. Jalankan:

```bash
node scripts/seedQuestions.js
node scripts/seedDemoUser.js
```

> **Catatan:** Jika tidak di-seed, aplikasi akan otomatis menggunakan soal fallback yang sudah ter-hardcode di frontend.

### 5. Jalankan

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

## 📁 Struktur Proyek

```
neuronpath/
├── src/
│   ├── config/firebase.js         # Firebase initialization
│   ├── context/
│   │   ├── AuthContext.jsx        # Firebase Auth state
│   │   └── ThemeContext.jsx       # Dark/Light mode
│   ├── services/
│   │   ├── questionService.js     # Firestore: questions CRUD
│   │   ├── testResultService.js   # Firestore: test results CRUD
│   │   └── userService.js         # Firestore: users CRUD
│   ├── pages/
│   │   ├── LandingPage.jsx        # Landing / homepage
│   │   ├── LoginPage.jsx          # Login
│   │   ├── RegisterPage.jsx       # Register
│   │   ├── DashboardPage.jsx      # Dashboard + charts
│   │   ├── PretestPage.jsx        # Info sebelum tes
│   │   ├── TestPage.jsx           # Pengerjaan soal
│   │   ├── ResultPage.jsx         # Hasil analisis
│   │   ├── HistoryPage.jsx        # Riwayat tes
│   │   └── AccountPage.jsx        # Pengaturan profil
│   ├── layouts/
│   ├── data/                      # Fallback hardcoded data
│   ├── utils/
│   └── routes/AppRoutes.jsx       # Routing + protected routes
├── scripts/
│   ├── seedQuestions.js           # Seed soal ke Firestore
│   └── seedDemoUser.js            # Seed akun demo
├── firestore.rules                # Firestore security rules
├── .env.example                   # Template environment variables
└── package.json
```

## 🔒 Akun Demo

| | |
|---|---|
| **Email** | `test@neuronpath.com` |
| **Password** | `test12345678` |

> Akun demo harus di-seed terlebih dahulu menggunakan script `seedDemoUser.js`.

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik mata kuliah Software Engineering for Startup.

---

Built with ❤️ by [mfaizadya](https://github.com/mfaizadya)
