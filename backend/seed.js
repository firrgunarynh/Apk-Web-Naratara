const pool = require('./config/db');

const seedDatabase = async () => {
  try {
    console.log('🌱 Memulai proses seeding data dummy...');

    // 1. Cek User Admin
    const [users] = await pool.execute('SELECT id FROM users WHERE role = "admin" LIMIT 1');
    let adminId = 1;
    if (users.length > 0) {
      adminId = users[0].id;
    } else {
      console.log('⚠️ Warning: Admin user tidak ditemukan. Menggunakan ID 1.');
    }

    // 2. Tambah Kategori Dummy (INSERT IGNORE biar nggak duplikat)
    const kategoriData = [
      ['Teknologi', '#3B82F6'],
      ['Olahraga', '#10B981'],
      ['Hiburan', '#8B5CF6'],
      ['Bisnis', '#F59E0B'],
      ['Kesehatan', '#EF4444']
    ];

    for (const [nama, warna] of kategoriData) {
      await pool.execute(
        'INSERT IGNORE INTO kategori (nama, warna) VALUES (?, ?)',
        [nama, warna]
      );
    }
    console.log('✅ Kategori dummy berhasil dicek/ditambahkan.');

    // Ambil ID Kategori untuk dipakai berita
    const [kategoriRows] = await pool.execute('SELECT id, nama FROM kategori');
    const kategoriMap = {};
    kategoriRows.forEach(k => { kategoriMap[k.nama] = k.id; });

    // 3. Tambah Berita Dummy
    const beritaDummy = [
      {
        judul: 'Startup Teknologi Indonesia Capai Valuasi Unicorn Baru',
        ringkasan: 'Sebuah startup lokal yang bergerak di bidang AI baru saja mendapatkan suntikan dana segar.',
        konten: '<p>Ini adalah konten dummy berita teknologi. Startup ini diharapkan mampu bersaing secara global dengan produk inovatif mereka.</p><p>Pendanaan seri C ini dipimpin oleh beberapa VC raksasa dari luar negeri.</p>',
        kategori_id: kategoriMap['Teknologi'] || 1,
        thumbnail_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
        views: 4520,
        status: 'published'
      },
      {
        judul: 'Tim Nasional Berhasil Masuk ke Babak Final Piala Asia',
        ringkasan: 'Kemenangan dramatis 2-1 membawa timnas melaju ke partai puncak.',
        konten: '<p>Pertandingan berlangsung sengit, di mana tim lawan sempat memimpin di babak pertama.</p><p>Gol kemenangan dicetak pada menit ke-89 melalui tendangan bebas yang sangat indah.</p>',
        kategori_id: kategoriMap['Olahraga'] || 2,
        thumbnail_url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=800',
        views: 8900,
        status: 'published'
      },
      {
        judul: 'Film Action Terbesar Tahun Ini Pecahkan Rekor Box Office',
        ringkasan: 'Hanya dalam waktu satu minggu, film ini meraup keuntungan ratusan miliar rupiah.',
        konten: '<p>Aktor utama memberikan performa yang luar biasa dengan adegan aksi tanpa stuntman.</p><p>Banyak kritikus memuji sinematografi dan alur cerita yang tidak mudah ditebak.</p>',
        kategori_id: kategoriMap['Hiburan'] || 3,
        thumbnail_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
        views: 1250,
        status: 'published'
      },
      {
        judul: 'IHSG Menguat Tipis di Tengah Sentimen Global yang Negatif',
        ringkasan: 'Investor domestik menopang laju indeks di tengah ketidakpastian suku bunga.',
        konten: '<p>Sektor perbankan menjadi pendorong utama penguatan indeks hari ini.</p><p>Analis memprediksi pasar masih akan volatile hingga akhir kuartal.</p>',
        kategori_id: kategoriMap['Bisnis'] || 4,
        thumbnail_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a2236a0?auto=format&fit=crop&q=80&w=800',
        views: 750,
        status: 'published'
      },
      {
        judul: 'Manfaat Tidur 8 Jam Sehari untuk Produktivitas Kerja',
        ringkasan: 'Penelitian terbaru menunjukkan korelasi kuat antara durasi tidur dan kualitas kerja.',
        konten: '<p>Orang yang tidur cukup terbukti memiliki kemampuan problem-solving 30% lebih baik.</p><p>Selain itu, risiko terkena penyakit kronis juga menurun drastis.</p>',
        kategori_id: kategoriMap['Kesehatan'] || 5,
        thumbnail_url: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&q=80&w=800',
        views: 3200,
        status: 'published'
      },
      {
        judul: 'Bocoran Spesifikasi Smartphone Flagship Terbaru',
        ringkasan: 'Dilengkapi dengan kamera 200MP dan baterai super awet.',
        konten: '<p>Smartphone ini dikabarkan akan rilis bulan depan dengan harga yang kompetitif.</p>',
        kategori_id: kategoriMap['Teknologi'] || 1,
        thumbnail_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
        views: 0,
        status: 'draft' // Contoh berita draft
      }
    ];

    const createSlug = (judul) => judul.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').trim() + '-' + Date.now();

    for (const berita of beritaDummy) {
      await pool.execute(
        `INSERT INTO berita (judul, slug, konten, ringkasan, kategori_id, penulis_id, thumbnail_url, status, views)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          berita.judul,
          createSlug(berita.judul),
          berita.konten,
          berita.ringkasan,
          berita.kategori_id,
          adminId,
          berita.thumbnail_url,
          berita.status,
          berita.views
        ]
      );
    }

    console.log('✅ 6 Berita dummy berhasil ditambahkan (5 Published, 1 Draft)!');
    console.log('🎉 Seeding selesai! Silakan buka Dashboard atau Halaman Utama.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Terjadi kesalahan saat seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
