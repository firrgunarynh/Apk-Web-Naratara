const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// ─── Middleware: Verifikasi JWT Token ─────────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    // Cek token di header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token tidak ditemukan.',
        data: null
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await pool.execute(
      'SELECT id, username, email, role FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid. User tidak ditemukan.',
        data: null
      });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token tidak valid atau sudah kedaluwarsa.',
      data: null
    });
  }
};

// ─── Middleware: Hanya Admin ──────────────────────────────────────────────────
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak. Hanya admin yang diizinkan.',
      data: null
    });
  }
};

module.exports = { protect, adminOnly };
