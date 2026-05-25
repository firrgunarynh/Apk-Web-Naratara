const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Storage di memori sementara sebelum diolah oleh Sharp
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Bukan file gambar! Silakan upload hanya gambar.'), false);
    }
  }
});

const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filename = `berita-${Date.now()}.webp`;
    const uploadPath = path.join(__dirname, '../public/uploads');

    // Buat folder jika belum ada
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    await sharp(req.file.buffer)
      .resize({ width: 800, withoutEnlargement: true }) // Max width 800px
      .toFormat('webp', { quality: 80 }) // Konversi ke webp 80% quality
      .toFile(path.join(uploadPath, filename));

    // Simpan nama file ke req object
    req.body.thumbnail_url = `/uploads/${filename}`;
    next();
  } catch (error) {
    console.error('Error saat memproses gambar:', error);
    res.status(500).json({ success: false, message: 'Gagal memproses gambar.', data: null });
  }
};

module.exports = { uploadPhoto: upload.single('image'), resizeImage };
