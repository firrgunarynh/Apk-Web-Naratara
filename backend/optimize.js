const pool = require('./config/db');

const optimizeDb = async () => {
  try {
    console.log('Menambahkan INDEX pada tabel berita...');
    // Gunakan try-catch per baris supaya tidak gagal kalau index sudah ada
    try {
      await pool.execute('CREATE INDEX idx_status_created ON berita(status, created_at)');
      console.log('✅ Index idx_status_created berhasil ditambahkan.');
    } catch (e) { console.log('⚠️ Index idx_status_created mungkin sudah ada.'); }

    try {
      await pool.execute('CREATE INDEX idx_search ON berita(judul)');
      console.log('✅ Index idx_search berhasil ditambahkan.');
    } catch (e) { console.log('⚠️ Index idx_search mungkin sudah ada.'); }

    console.log('🎉 Optimasi Database Selesai!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

optimizeDb();
