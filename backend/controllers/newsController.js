const pool = require('../config/db');

// ─── Helper: Buat slug dari judul ────────────────────────────────────────────
const createSlug = (judul) => {
  return judul
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + Date.now();
};

// ─── GET /api/news ────────────────────────────────────────────────────────────
const getAllNews = async (req, res) => {
  try {
    const { page = 1, limit = 9, kategori, search, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE b.status = "published"';
    const params = [];

    // Admin bisa lihat semua status
    if (req.user && req.user.role === 'admin') {
      whereClause = 'WHERE 1=1';
      if (status) {
        whereClause += ' AND b.status = ?';
        params.push(status);
      }
    }

    if (kategori) {
      whereClause += ' AND k.nama = ?';
      params.push(kategori);
    }

    if (search) {
      whereClause += ' AND (b.judul LIKE ? OR b.ringkasan LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM berita b
      LEFT JOIN kategori k ON b.kategori_id = k.id
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    const dataQuery = `
      SELECT 
        b.id, b.judul, b.slug, b.ringkasan, b.thumbnail_url,
        b.status, b.views, b.created_at, b.updated_at,
        k.nama AS kategori, k.warna AS kategori_warna,
        u.username AS penulis
      FROM berita b
      LEFT JOIN kategori k ON b.kategori_id = k.id
      LEFT JOIN users u ON b.penulis_id = u.id
      ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.execute(dataQuery, [...params, parseInt(limit), parseInt(offset)]);

    res.status(200).json({
      success: true,
      message: 'Berita berhasil diambil',
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('getAllNews error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server: ' + error.message, data: null });
  }
};

// ─── GET /api/news/:id ────────────────────────────────────────────────────────
const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `SELECT 
        b.id, b.judul, b.slug, b.konten, b.ringkasan, b.thumbnail_url,
        b.status, b.views, b.created_at, b.updated_at,
        b.kategori_id,
        k.nama AS kategori, k.warna AS kategori_warna,
        u.username AS penulis, u.id AS penulis_id
      FROM berita b
      LEFT JOIN kategori k ON b.kategori_id = k.id
      LEFT JOIN users u ON b.penulis_id = u.id
      WHERE b.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan', data: null });
    }

    // Tambah view count
    await pool.execute('UPDATE berita SET views = views + 1 WHERE id = ?', [id]);

    res.status(200).json({ success: true, message: 'Detail berita berhasil dimuat', data: rows[0] });
  } catch (error) {
    console.error('getNewsById error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server: ' + error.message, data: null });
  }
};

// ─── POST /api/news (Admin only) ─────────────────────────────────────────────
const createNews = async (req, res) => {
  try {
    const { judul, konten, ringkasan, kategori_id, thumbnail_url, status } = req.body;

    if (!judul || !konten) {
      return res.status(400).json({ success: false, message: 'Judul dan konten wajib diisi.', data: null });
    }

    const slug = createSlug(judul);

    const [result] = await pool.execute(
      `INSERT INTO berita (judul, slug, konten, ringkasan, kategori_id, penulis_id, thumbnail_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        judul, slug, konten,
        ringkasan || '',
        kategori_id || null,
        req.user.id,
        thumbnail_url || null,
        status || 'draft',
      ]
    );

    const [newNews] = await pool.execute(
      `SELECT b.*, k.nama AS kategori, u.username AS penulis
       FROM berita b
       LEFT JOIN kategori k ON b.kategori_id = k.id
       LEFT JOIN users u ON b.penulis_id = u.id
       WHERE b.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, message: 'Berita berhasil ditambahkan!', data: newNews[0] });
  } catch (error) {
    console.error('createNews error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server: ' + error.message, data: null });
  }
};

// ─── PUT /api/news/:id (Admin only) ──────────────────────────────────────────
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, konten, ringkasan, kategori_id, thumbnail_url, status } = req.body;

    const [existing] = await pool.execute('SELECT id FROM berita WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan.', data: null });
    }

    await pool.execute(
      `UPDATE berita SET
        judul = ?, konten = ?, ringkasan = ?,
        kategori_id = ?, thumbnail_url = ?, status = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [judul, konten, ringkasan || '', kategori_id || null, thumbnail_url || null, status || 'draft', id]
    );

    const [updated] = await pool.execute(
      `SELECT b.*, k.nama AS kategori, u.username AS penulis
       FROM berita b
       LEFT JOIN kategori k ON b.kategori_id = k.id
       LEFT JOIN users u ON b.penulis_id = u.id
       WHERE b.id = ?`,
      [id]
    );

    res.json({ success: true, message: 'Berita berhasil diperbarui!', data: updated[0] });
  } catch (error) {
    console.error('updateNews error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server: ' + error.message, data: null });
  }
};

// ─── DELETE /api/news/:id (Admin only) ───────────────────────────────────────
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute('SELECT id, judul FROM berita WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan.', data: null });
    }

    await pool.execute('DELETE FROM berita WHERE id = ?', [id]);

    res.json({ success: true, message: `Berita "${existing[0].judul}" berhasil dihapus.` });
  } catch (error) {
    console.error('deleteNews error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server: ' + error.message, data: null });
  }
};

// ─── GET /api/news/kategori (Daftar kategori) ─────────────────────────────────
const getKategori = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM kategori ORDER BY nama ASC');
    res.status(200).json({ success: true, message: 'Kategori berhasil dimuat', data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server: ' + error.message, data: null });
  }
};

module.exports = { getAllNews, getNewsById, createNews, updateNews, deleteNews, getKategori };
