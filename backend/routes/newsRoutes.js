const express = require('express');
const router = express.Router();
const {
  getAllNews, getNewsById, createNews,
  updateNews, deleteNews, getKategori,
} = require('../controllers/newsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/news/kategori  (publik)
router.get('/kategori', getKategori);

// GET /api/news  (publik, admin bisa lihat semua status)
router.get('/', (req, res, next) => {
  // Coba decode token kalau ada, tapi tidak wajib
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return protect(req, res, () => next());
  }
  next();
}, getAllNews);

// GET /api/news/:id  (publik)
router.get('/:id', getNewsById);

// POST /api/news  (admin only)
router.post('/', protect, adminOnly, createNews);

// PUT /api/news/:id  (admin only)
router.put('/:id', protect, adminOnly, updateNews);

// DELETE /api/news/:id  (admin only)
router.delete('/:id', protect, adminOnly, deleteNews);

module.exports = router;
