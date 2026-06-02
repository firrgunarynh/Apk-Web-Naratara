# 📰 APK Web Berita — Platform Berita Online

Platform berita online berbasis web yang terdiri dari **Backend REST API** (Node.js + Express + MySQL) dan **Frontend** (React + Vite + Tailwind CSS). Proyek ini juga terintegrasi dengan aplikasi mobile Android **Naratara** yang mengkonsumsi API yang sama.

---

## 📋 Daftar Isi

- [Gambaran Umum](#gambaran-umum)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Proyek](#struktur-proyek)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Panduan Instalasi](#panduan-instalasi)
- [Konfigurasi Database](#konfigurasi-database)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Akun Default](#akun-default)
- [Dokumentasi API](#dokumentasi-api)
- [Fitur Aplikasi](#fitur-aplikasi)
- [Integrasi Android](#integrasi-android)

---

## 🗺️ Gambaran Umum

**APK Web Berita** adalah sistem manajemen berita full-stack yang memungkinkan:
- **Pengguna umum** membaca berita, mencari berdasarkan kata kunci, dan memfilter berdasarkan kategori
- **Admin** mengelola seluruh konten berita (tambah, edit, hapus), mengelola pengguna, dan melihat statistik
- **Aplikasi Android** mengakses konten yang sama melalui REST API

---

## 🛠️ Teknologi yang Digunakan

### Backend
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Node.js | ≥ 18 | Runtime JavaScript |
| Express.js | ^5.2 | Framework web & routing |
| MySQL2 | ^3.22 | Driver database MySQL |
| bcryptjs | ^3.0 | Enkripsi password |
| jsonwebtoken | ^9.0 | Autentikasi JWT |
| Multer | ^2.1 | Upload file/gambar |
| Sharp | ^0.34 | Optimasi gambar |
| dotenv | ^17.4 | Manajemen variabel lingkungan |
| nodemon | ^3.1 | Auto-reload saat development |

### Frontend
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| React | ^19 | Library UI |
| Vite | ^8.0 | Build tool & dev server |
| TailwindCSS | ^4.3 | Styling utility-first |
| React Router DOM | ^7.15 | Routing halaman |
| Axios | ^1.16 | HTTP client |
| Lucide React | ^1.14 | Icon library |

### Database
| Teknologi | Kegunaan |
|-----------|----------|
| MySQL | Database relasional |
| XAMPP/MySQL Standalone | Menjalankan server MySQL lokal |

---

## 📁 Struktur Proyek

```
APK_WEB_Berita/
├── backend/
│   ├── config/
│   │   └── db.js              # Konfigurasi koneksi MySQL
│   ├── controllers/
│   │   ├── authController.js  # Login, Register, Kelola User
│   │   ├── newsController.js  # CRUD Berita & Kategori
│   │   └── adminController.js # Dashboard & Statistik Admin
│   ├── middleware/
│   │   └── authMiddleware.js  # Verifikasi JWT Token
│   ├── routes/
│   │   ├── authRoutes.js      # /api/v1/auth
│   │   ├── newsRoutes.js      # /api/v1/news
│   │   ├── adminRoutes.js     # /api/v1/admin
│   │   └── uploadRoutes.js    # /api/v1/upload
│   ├── public/                # File statis (gambar yang diupload)
│   ├── .env                   # Variabel lingkungan
│   ├── server.js              # Entry point backend
│   ├── setup_db.js            # Script setup database otomatis
│   └── seed.js                # Script isi data dummy
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Halaman beranda
│   │   │   ├── Login.jsx      # Halaman login
│   │   │   ├── Register.jsx   # Halaman registrasi
│   │   │   ├── NewsDetail.jsx # Halaman detail berita
│   │   │   └── admin/         # Halaman-halaman admin
│   │   ├── components/        # Komponen UI reusable
│   │   ├── context/           # React Context (auth state, dll)
│   │   ├── services/          # Layanan API (Axios)
│   │   └── App.jsx            # Root komponen & routing
│   └── index.html
├── database/                  # (Opsional) File SQL backup
└── README.md
```

---

## ⚙️ Persyaratan Sistem

Sebelum memulai, pastikan sudah terinstal:

- [Node.js](https://nodejs.org/) versi 18 atau lebih baru
- [XAMPP](https://www.apachefriends.org/) (untuk MySQL) **atau** MySQL Server standalone
- Git (opsional)

---

## 🚀 Panduan Instalasi

### Langkah 1 — Jalankan MySQL

Buka **XAMPP Control Panel** → klik **Start** pada baris **MySQL**

> Pastikan MySQL berjalan di port default **3306**

### Langkah 2 — Setup Database Otomatis

Buka terminal di folder `backend` lalu jalankan:

```bash
cd backend
npm install
node setup_db.js
```

Script ini akan **otomatis membuat**:
- Database `berita_app`
- Tabel `users`, `kategori`, dan `berita`
- Akun admin & user default

### Langkah 3 — Isi Data Dummy (Opsional)

```bash
node seed.js
```

Akan menambahkan 5 berita _published_ dan 1 berita _draft_ sebagai data contoh.

### Langkah 4 — Install & Jalankan Backend

```bash
# Masih di folder backend
npm start
```

Backend akan berjalan di: **http://localhost:5000**

### Langkah 5 — Install & Jalankan Frontend

Buka terminal **baru** di folder `frontend`:

```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan di: **http://localhost:5173**

---

## 🗄️ Konfigurasi Database

File konfigurasi ada di `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          # Kosongkan jika XAMPP default (tanpa password)
DB_NAME=berita_app
JWT_SECRET=berita_app_super_secret_key_2026
JWT_EXPIRES_IN=7d
```

> ⚠️ **Jangan commit file `.env` ke repository publik!**

---

## 🔑 Akun Default

| Role  | Email                | Password   |
|-------|----------------------|------------|
| Admin | admin@berita.com     | `password` |
| User  | user@berita.com      | `password` |

---

## 📡 Dokumentasi API

Base URL: `http://localhost:5000/api/v1`

### Autentikasi

| Method | Endpoint               | Deskripsi           | Auth?  |
|--------|------------------------|---------------------|--------|
| `POST` | `/auth/register`       | Daftar akun baru    | ❌ Tidak |
| `POST` | `/auth/login`          | Login & dapat token | ❌ Tidak |
| `GET`  | `/auth/me`             | Info user login     | ✅ Ya   |
| `GET`  | `/auth/users`          | Daftar semua user   | 👑 Admin |
| `PUT`  | `/auth/users/:id/role` | Ubah role user      | 👑 Admin |
| `DELETE`| `/auth/users/:id`     | Hapus user          | 👑 Admin |

### Berita

| Method   | Endpoint         | Deskripsi                         | Auth?    |
|----------|------------------|-----------------------------------|----------|
| `GET`    | `/news`          | Daftar berita (paginasi, filter)  | ❌ Tidak  |
| `GET`    | `/news/:id`      | Detail berita (+ tambah views)    | ❌ Tidak  |
| `GET`    | `/news/kategori` | Daftar kategori                   | ❌ Tidak  |
| `POST`   | `/news`          | Tambah berita baru                | 👑 Admin  |
| `PUT`    | `/news/:id`      | Edit berita                       | 👑 Admin  |
| `DELETE` | `/news/:id`      | Hapus berita                      | 👑 Admin  |

### Upload

| Method | Endpoint       | Deskripsi              | Auth?    |
|--------|----------------|------------------------|----------|
| `POST` | `/upload/image`| Upload gambar thumbnail | 👑 Admin |

### Health Check

```
GET /api/health  →  { "success": true, "message": "API Web Berita berjalan!" }
```

---

## ✨ Fitur Aplikasi

### Untuk Pengguna Umum
- 🏠 **Beranda** — Daftar berita terbaru dengan thumbnail, kategori, dan jumlah views
- 🔍 **Pencarian** — Cari berita berdasarkan judul atau ringkasan
- 🏷️ **Filter Kategori** — Filter berita berdasarkan kategori (Teknologi, Olahraga, dll)
- 📄 **Detail Berita** — Baca artikel lengkap dengan konten HTML
- 📑 **Paginasi** — Navigasi halaman berita
- 👤 **Registrasi & Login** — Buat akun dan masuk ke sistem

### Untuk Admin
- 📊 **Dashboard** — Statistik total berita, user, dan views
- ✏️ **Kelola Berita** — Tambah, edit, dan hapus berita
- 🖼️ **Upload Gambar** — Upload thumbnail untuk berita
- 👥 **Kelola User** — Lihat daftar user dan ubah role
- 📝 **Status Draft/Published** — Simpan berita sebagai draft sebelum dipublikasikan

---

## 📱 Integrasi Android

Aplikasi ini juga dikonsumsi oleh aplikasi Android **Naratara** (Kotlin + Retrofit2).

### Untuk Android Emulator
```
BASE_URL = "http://10.0.2.2:5000/api/v1/"
```

### Untuk HP Fisik (via WiFi)
```
BASE_URL = "http://<IP-WiFi-Komputer>:5000/api/v1/"
```

> Cek IP WiFi komputer Anda dengan perintah `ipconfig` di Command Prompt

---

## 📜 Lisensi

Proyek ini dibuat untuk keperluan tugas/pembelajaran. Bebas digunakan dan dimodifikasi.
