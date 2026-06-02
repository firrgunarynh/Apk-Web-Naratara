# 🌐📱 Naratara — Platform Berita Online + Aplikasi Android

> Ekosistem berita digital yang terdiri dari **Web Platform** (Admin & Pembaca) dan **Aplikasi Mobile Android**, keduanya terhubung ke satu backend REST API yang sama.

---

## 📋 Daftar Isi

- [Gambaran Sistem](#-gambaran-sistem)
- [Arsitektur Keseluruhan](#-arsitektur-keseluruhan)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [A — APK Web Berita (Web Platform)](#-a--apk-web-berita-web-platform)
  - [Teknologi Web](#teknologi-web)
  - [Struktur Folder Web](#struktur-folder-web)
  - [Panduan Instalasi Web](#panduan-instalasi-web)
  - [Konfigurasi Database](#konfigurasi-database)
  - [Fitur Web](#fitur-web)
- [B — Naratara (Aplikasi Android)](#-b--naratara-aplikasi-android)
  - [Teknologi Android](#teknologi-android)
  - [Struktur Folder Android](#struktur-folder-android)
  - [Panduan Setup Android Studio](#panduan-setup-android-studio)
  - [Konfigurasi URL API](#konfigurasi-url-api)
  - [Alur Navigasi Aplikasi](#alur-navigasi-aplikasi)
  - [Fitur Android](#fitur-android)
- [Dokumentasi API Bersama](#-dokumentasi-api-bersama)
- [Akun Default](#-akun-default)
- [Menjalankan Semua Sekaligus](#-menjalankan-semua-sekaligus)
- [Troubleshooting](#-troubleshooting)

---

## 🌐 Gambaran Sistem

Proyek ini adalah satu **ekosistem berita digital** yang terdiri dari **3 lapisan**:

```
┌─────────────────────────────────────────────────────────────┐
│                    KLIEN / PENGGUNA                         │
│                                                             │
│   🌍 Web Browser           📱 Android (Naratara App)        │
│   (React + Vite)           (Kotlin + Retrofit2)             │
└──────────────┬──────────────────────┬───────────────────────┘
               │  HTTP Request         │  HTTP Request
               ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│              🖥️  BACKEND REST API                            │
│              Node.js + Express.js                            │
│              http://localhost:5000/api/v1/                   │
└──────────────────────────────┬──────────────────────────────┘
                               │  SQL Query
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    🗄️  DATABASE MySQL                        │
│               (berita_app: users, berita, kategori)          │
└─────────────────────────────────────────────────────────────┘
```

| Komponen | Folder | Port / Platform |
|----------|--------|-----------------|
| Backend API | `c:\APK_WEB_Berita\backend` | `http://localhost:5000` |
| Frontend Web | `c:\APK_WEB_Berita\frontend` | `http://localhost:5173` |
| Database | MySQL (XAMPP) | Port `3306` |
| Android App | `c:\Users\rahma\Downloads\Naratara` | Emulator / HP Fisik |

---

## 🏗️ Arsitektur Keseluruhan

```
APK_WEB_Berita/
├── backend/          ← REST API (Node.js + Express)
├── frontend/         ← Web App (React + Vite + Tailwind)
├── database/         ← (Opsional) File SQL backup
└── README_FULL.md    ← File ini

Naratara/             ← Android App (Kotlin)
├── app/
└── README.md
```

---

## ⚙️ Persyaratan Sistem

| Kebutuhan | Versi | Untuk |
|-----------|-------|-------|
| Node.js | ≥ 18 | Backend & Frontend Web |
| MySQL / XAMPP | - | Database |
| Android Studio | Hedgehog+ | Aplikasi Android |
| JDK | ≥ 11 | Android Studio |
| Android SDK | API 24+ (Android 7.0) | Emulator / HP |

---

## 🌐 A — APK Web Berita (Web Platform)

Platform web untuk membaca berita dan mengelola konten sebagai admin.

### Teknologi Web

#### Backend
| Library | Versi | Fungsi |
|---------|-------|--------|
| Express.js | ^5.2 | Framework REST API |
| MySQL2 | ^3.22 | Koneksi database |
| bcryptjs | ^3.0 | Hash password |
| jsonwebtoken | ^9.0 | Token autentikasi JWT |
| Multer | ^2.1 | Upload file/gambar |
| Sharp | ^0.34 | Optimasi gambar |
| dotenv | ^17.4 | Variabel lingkungan |
| nodemon | ^3.1 | Auto-reload dev server |

#### Frontend
| Library | Versi | Fungsi |
|---------|-------|--------|
| React | ^19 | Library UI |
| Vite | ^8.0 | Build tool & dev server |
| TailwindCSS | ^4.3 | Styling utility-first |
| React Router DOM | ^7.15 | Routing halaman |
| Axios | ^1.16 | HTTP Client |
| Lucide React | ^1.14 | Ikon |

---

### Struktur Folder Web

```
APK_WEB_Berita/
├── backend/
│   ├── config/
│   │   └── db.js               # Konfigurasi koneksi MySQL
│   ├── controllers/
│   │   ├── authController.js   # Login, Register, Kelola User
│   │   ├── newsController.js   # CRUD Berita & Kategori
│   │   └── adminController.js  # Dashboard & Statistik Admin
│   ├── middleware/
│   │   └── authMiddleware.js   # Verifikasi JWT Token
│   ├── routes/
│   │   ├── authRoutes.js       # /api/v1/auth
│   │   ├── newsRoutes.js       # /api/v1/news
│   │   ├── adminRoutes.js      # /api/v1/admin
│   │   └── uploadRoutes.js     # /api/v1/upload
│   ├── public/                 # Gambar yang diupload
│   ├── .env                    # Konfigurasi environment
│   ├── server.js               # Entry point server
│   ├── setup_db.js             # Script setup database otomatis
│   └── seed.js                 # Script data dummy
└── frontend/
    └── src/
        ├── pages/
        │   ├── Home.jsx        # Beranda
        │   ├── Login.jsx       # Halaman login
        │   ├── Register.jsx    # Halaman registrasi
        │   ├── NewsDetail.jsx  # Detail berita
        │   └── admin/          # Panel admin
        ├── components/         # Komponen UI
        ├── context/            # React Context (state global)
        ├── services/           # Layanan Axios
        └── App.jsx             # Root & routing
```

---

### Panduan Instalasi Web

#### Langkah 1 — Jalankan MySQL
Buka **XAMPP Control Panel** → klik **Start** pada **MySQL**

#### Langkah 2 — Setup Database Otomatis
```bash
cd c:\APK_WEB_Berita\backend
npm install
node setup_db.js
```
Script ini otomatis membuat: database `berita_app`, tabel `users`, `kategori`, `berita`, dan akun default.

#### Langkah 3 — Isi Data Dummy (Opsional)
```bash
node seed.js
```
Menambahkan 5 berita *published* + 1 berita *draft* sebagai contoh.

#### Langkah 4 — Jalankan Backend
```bash
npm start
```
✅ Backend berjalan di: **http://localhost:5000**

#### Langkah 5 — Jalankan Frontend
Buka terminal **baru**:
```bash
cd c:\APK_WEB_Berita\frontend
npm install
npm run dev
```
✅ Frontend berjalan di: **http://localhost:5173**

---

### Konfigurasi Database

File: `backend/.env`

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=berita_app
JWT_SECRET=berita_app_super_secret_key_2026
JWT_EXPIRES_IN=7d
```

> ⚠️ Jangan commit file `.env` ke repository publik!

---

### Fitur Web

#### Pengguna Umum
- 🏠 **Beranda** — Daftar berita terbaru dengan thumbnail, views, dan kategori
- 🔍 **Pencarian** — Cari berdasarkan judul atau ringkasan
- 🏷️ **Filter Kategori** — Filter berdasarkan kategori (Teknologi, Olahraga, dll)
- 📄 **Detail Berita** — Baca artikel lengkap
- 👤 **Login & Registrasi** — Autentikasi JWT

#### Admin
- 📊 **Dashboard** — Statistik berita, user, dan views
- ✏️ **Kelola Berita** — Tambah, edit, hapus berita
- 🖼️ **Upload Gambar** — Upload thumbnail
- 👥 **Kelola User** — Lihat daftar & ubah role user
- 📝 **Draft / Published** — Simpan sebagai draft sebelum publish

---

## 📱 B — Naratara (Aplikasi Android)

Aplikasi Android berbasis Kotlin yang mengkonsumsi API dari backend APK Web Berita.

### Teknologi Android

| Library | Versi | Fungsi |
|---------|-------|--------|
| Kotlin | - | Bahasa pemrograman |
| Android SDK | compileSdk 36, minSdk 24 | SDK Android |
| Retrofit2 | 2.9.0 | HTTP client API |
| Gson Converter | 2.9.0 | Parsing JSON |
| OkHttp Logging | 4.12.0 | Log request/response |
| Glide | 4.16.0 | Load & cache gambar |
| Kotlin Coroutines | 1.7.3 | Operasi asinkron |
| ViewModel + LiveData | 2.7.0 | Manajemen state MVVM |
| ViewBinding | - | Binding layout XML |
| SharedPreferences | - | Simpan token sesi |
| Material Design | - | Komponen UI modern |

---

### Struktur Folder Android

```
Naratara/
└── app/src/main/
    ├── java/com/example/naratara/
    │   ├── data/
    │   │   ├── model/
    │   │   │   ├── News.kt           # Data class berita
    │   │   │   ├── User.kt           # Data class user
    │   │   │   └── ApiResponse.kt    # Wrapper response API
    │   │   └── remote/
    │   │       ├── ApiService.kt     # Definisi endpoint Retrofit
    │   │       └── RetrofitClient.kt # Konfigurasi Retrofit + OkHttp
    │   ├── ui/
    │   │   ├── auth/
    │   │   │   ├── SplashActivity.kt    # Splash screen & cek sesi
    │   │   │   ├── LoginActivity.kt     # Halaman login
    │   │   │   └── RegisterActivity.kt  # Halaman registrasi
    │   │   └── dashboard/
    │   │       ├── MainActivity.kt       # Daftar berita
    │   │       ├── NewsAdapter.kt        # Adapter RecyclerView
    │   │       └── NewsDetailActivity.kt # Detail berita
    │   └── utils/
    │       ├── Constants.kt          # BASE_URL API
    │       └── SessionManager.kt     # Simpan & ambil JWT token
    ├── res/                          # Layout XML, drawable, string
    └── AndroidManifest.xml
```

---

### Panduan Setup Android Studio

#### Langkah 1 — Pastikan Backend Aktif
```bash
cd c:\APK_WEB_Berita\backend
npm start
```
Pastikan muncul: `🚀 Server berjalan di http://localhost:5000`

#### Langkah 2 — Buka di Android Studio
1. Buka **Android Studio**
2. **File → Open** → pilih `C:\Users\rahma\Downloads\Naratara`
3. Tunggu **Gradle Sync** selesai

#### Langkah 3 — Set URL API (lihat bagian berikut)

#### Langkah 4 — Jalankan
Klik **▶ Run** atau tekan **Shift + F10**

---

### Konfigurasi URL API

File: `app/src/main/java/com/example/naratara/utils/Constants.kt`

```kotlin
object Constants {
    // ✅ Untuk Android Emulator (AVD):
    const val BASE_URL = "http://10.0.2.2:5000/api/v1/"

    // 📱 Untuk HP Fisik via WiFi (ganti IP sesuai komputer Anda):
    // const val BASE_URL = "http://192.168.x.x:5000/api/v1/"
}
```

> 💡 Cek IP WiFi komputer: buka Command Prompt → ketik `ipconfig` → lihat **IPv4 Address**
> 
> 📌 HP dan komputer harus terhubung ke **WiFi yang sama**

---

### Alur Navigasi Aplikasi

```
[SplashActivity]
      │
      ├── Ada token tersimpan ──→ [MainActivity] ──→ [NewsDetailActivity]
      │
      └── Tidak ada token ──→ [LoginActivity]
                                    │
                                    ├── Login berhasil ──→ [MainActivity]
                                    │
                                    └── [RegisterActivity] ──→ [LoginActivity]
```

| Screen | Deskripsi |
|--------|-----------|
| **SplashActivity** | Cek sesi JWT. Jika ada → langsung ke beranda, jika tidak → ke login |
| **LoginActivity** | Form login email & password. Token disimpan ke SharedPreferences |
| **RegisterActivity** | Form daftar akun baru |
| **MainActivity** | Daftar berita dalam RecyclerView. Tap untuk lihat detail |
| **NewsDetailActivity** | Isi lengkap berita: judul, thumbnail, konten, kategori, penulis, views |

---

### Fitur Android

- 📋 **Daftar Berita** — Menampilkan berita terpublikasi dengan paginasi
- 📰 **Detail Berita** — Baca artikel lengkap dengan gambar thumbnail
- 🔐 **Login & Register** — Autentikasi dengan JWT Token
- 💾 **Sesi Tersimpan** — Token disimpan di SharedPreferences, tidak perlu login ulang
- 🖼️ **Load Gambar** — Thumbnail dimuat via Glide dengan caching otomatis
- 🔒 **Auto Auth Header** — Token JWT otomatis disertakan di setiap request

---

## 📡 Dokumentasi API Bersama

Base URL: `http://localhost:5000/api/v1`

> Android Emulator mengakses via: `http://10.0.2.2:5000/api/v1`

### Autentikasi

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/auth/register` | Daftar akun baru | ❌ |
| `POST` | `/auth/login` | Login & dapat token JWT | ❌ |
| `GET` | `/auth/me` | Info user yang sedang login | ✅ |
| `GET` | `/auth/users` | Daftar semua user | 👑 Admin |
| `PUT` | `/auth/users/:id/role` | Ubah role user | 👑 Admin |
| `DELETE` | `/auth/users/:id` | Hapus user | 👑 Admin |

### Berita

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/news` | Daftar berita (paginasi, filter, search) | ❌ |
| `GET` | `/news/:id` | Detail berita + tambah views | ❌ |
| `GET` | `/news/kategori` | Daftar semua kategori | ❌ |
| `POST` | `/news` | Tambah berita baru | 👑 Admin |
| `PUT` | `/news/:id` | Edit berita | 👑 Admin |
| `DELETE` | `/news/:id` | Hapus berita | 👑 Admin |

### Upload

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/upload/image` | Upload gambar thumbnail | 👑 Admin |

### Health Check

```
GET /api/health  →  { "success": true, "message": "API Web Berita berjalan!" }
```

---

## 🔑 Akun Default

Dibuat otomatis saat menjalankan `node setup_db.js`:

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@berita.com | `password` |
| 👤 User | user@berita.com | `password` |

---

## 🚀 Menjalankan Semua Sekaligus

Urutan yang benar untuk menjalankan seluruh ekosistem:

```
1. ✅ Buka XAMPP → Start MySQL
         ↓
2. ✅ Setup database (jika pertama kali):
   cd c:\APK_WEB_Berita\backend
   node setup_db.js
   node seed.js        (opsional, untuk data dummy)
         ↓
3. ✅ Jalankan Backend:
   npm start           (di folder backend)
         ↓
4. ✅ Jalankan Frontend Web (opsional):
   npm run dev         (di folder frontend)
         ↓
5. ✅ Jalankan Android di Android Studio:
   Pastikan BASE_URL = "http://10.0.2.2:5000/api/v1/"
   Klik Run ▶
```

---

## 🐛 Troubleshooting

| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| Login gagal di web/android | Database belum dibuat | Jalankan `node setup_db.js` |
| "Database tidak terhubung" | MySQL tidak aktif | Buka XAMPP → Start MySQL |
| Android tidak bisa konek API | `BASE_URL` salah | Gunakan `10.0.2.2` untuk emulator, bukan `localhost` |
| HP fisik tidak bisa konek | Beda jaringan / IP salah | Pastikan HP & komputer di WiFi sama, gunakan IP WiFi komputer |
| Gambar tidak muncul di Android | URL thumbnail tidak valid | Pastikan backend berjalan & URL gambar benar |
| Gradle Sync gagal | Tidak ada internet | Pastikan koneksi internet aktif saat pertama kali sync |
| Port 5000 sudah dipakai | Proses lain berjalan | Ganti `PORT` di `.env` atau hentikan proses yang memakai port 5000 |

---

## 📜 Lisensi

Proyek ini dibuat untuk keperluan tugas/pembelajaran. Bebas digunakan dan dimodifikasi.
