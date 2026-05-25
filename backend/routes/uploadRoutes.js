const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadPhoto, resizeImage } = require('../middleware/uploadMiddleware');

// POST /api/v1/upload
router.post('/', protect, adminOnly, uploadPhoto, resizeImage, (req, res) => {
  if (!req.body.thumbnail_url) {
    return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah.', data: null });
  }
  
  res.status(200).json({
    success: true,
    message: 'Gambar berhasil diunggah dan dikompresi.',
    data: {
      url: req.body.thumbnail_url
    }
  });
});

module.exports = router;
