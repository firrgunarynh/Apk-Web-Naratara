const pool = require('../config/db');
const axios = require('axios');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 5 }); // Cache 5 detik

// ─── GET /api/v1/admin/dashboard-stats ──────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const cacheKey = 'dashboardStats';
    const cachedStats = myCache.get(cacheKey);

    if (cachedStats) {
      return res.status(200).json({
        success: true,
        message: 'Statistik dimuat dari cache',
        data: cachedStats
      });
    }

    // Menjalankan query secara paralel agar jauh lebih cepat
    const [
      [newsResult],
      [userResult],
      [viewsResult],
      [popularNews]
    ] = await Promise.all([
      pool.execute('SELECT COUNT(*) as total FROM berita'),
      pool.execute('SELECT COUNT(*) as total FROM users'),
      pool.execute('SELECT SUM(views) as total FROM berita'),
      pool.execute('SELECT id, judul AS title, views FROM berita ORDER BY views DESC LIMIT 5')
    ]);

    const statsData = {
      total_news: newsResult[0].total,
      total_users: userResult[0].total,
      total_views: viewsResult[0].total || 0,
      popular_news: popularNews
    };

    myCache.set(cacheKey, statsData);

    res.status(200).json({
      success: true,
      message: 'Statistik berhasil dimuat',
      data: statsData
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan server saat memuat statistik.',
      data: null 
    });
  }
};

// ─── POST /api/v1/admin/fetch-external ───────────────────────────────────────
const fetchExternalNews = async (req, res) => {
  try {
    // Menggunakan DummyJSON API sebagai placeholder scraper karena gratis & tidak butuh key.
    const response = await axios.get('https://dummyjson.com/posts?limit=3');
    const posts = response.data.posts;

    let insertedCount = 0;
    
    // Asumsi Admin ID 1
    const adminId = req.user.id || 1;

    for (const post of posts) {
      const judul = post.title;
      const konten = `<p>${post.body}</p>`;
      const ringkasan = post.body.substring(0, 100) + '...';
      const slug = judul.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').trim() + '-' + Date.now();
      const views = post.views;
      // Gunakan placeholder image acak
      const thumbnail_url = `https://picsum.photos/seed/${post.id}/800/400`;

      await pool.execute(
        `INSERT INTO berita (judul, slug, konten, ringkasan, kategori_id, penulis_id, thumbnail_url, status, views)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [judul, slug, konten, ringkasan, 1, adminId, thumbnail_url, 'published', views]
      );
      insertedCount++;
    }

    res.status(201).json({
      success: true,
      message: `Berhasil menarik ${insertedCount} berita dari API eksternal.`,
      data: null
    });
  } catch (error) {
    console.error('fetchExternal error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menarik berita eksternal.',
      data: null
    });
  }
};

module.exports = { getDashboardStats, fetchExternalNews };
