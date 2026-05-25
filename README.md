# ============================================
# CARA MENJALANKAN APLIKASI WEB BERITA
# ============================================

## LANGKAH 1: Setup Database (XAMPP)
1. Buka XAMPP → Start Apache & MySQL
2. Buka browser → http://localhost/phpmyadmin
3. Klik "Import" → pilih file: database/berita_app.sql
4. Klik "Go" untuk import

## LANGKAH 2: Install Backend
Buka terminal di folder: c:\APK_WEB_Berita\backend
```
npm install nodemon --save-dev
npm start
```
Backend akan berjalan di: http://localhost:5000

## LANGKAH 3: Install & Jalankan Frontend
Buka terminal BARU di folder: c:\APK_WEB_Berita\frontend
```
npm install
npm run dev
```
Frontend akan berjalan di: http://localhost:5173

## AKUN LOGIN DEFAULT
| Role  | Email                | Password |
|-------|----------------------|----------|
| Admin | admin@berita.com     | password |
| User  | user@berita.com      | password |

## FITUR
- Halaman Beranda: baca berita, search, filter kategori
- Halaman Detail: baca artikel lengkap
- Admin Dashboard: statistik berita & views
- Admin Kelola Berita: CRUD berita (tambah/edit/hapus)
- Admin Kelola User: lihat semua user
- Login/Register: autentikasi JWT

## INTEGRASI ANDROID STUDIO
API base URL: http://[IP_komputer_kamu]:5000/api
Endpoints yang bisa dipakai dari Android:
- GET  /api/news          → daftar berita
- GET  /api/news/:id      → detail berita
- GET  /api/news/kategori → daftar kategori
- POST /api/auth/login    → login
- POST /api/auth/register → daftar
Library Android yang direkomendasikan: Retrofit2 + Gson
