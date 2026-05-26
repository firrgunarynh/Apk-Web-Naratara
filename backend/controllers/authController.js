const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// ─── Helper: Generate JWT Token ──────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ─── POST /api/auth/register ─────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, dan password wajib diisi.',
        data: null
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter.',
        data: null
      });
    }

    // Cek email sudah terdaftar
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email atau username sudah terdaftar.',
        data: null
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'user']
    );

    const token = generateToken(result.insertId);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil!',
      data: {
        id: result.insertId,
        username,
        email,
        role: 'user',
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server.',
      data: null
    });
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi.',
        data: null
      });
    }

    // Cari user
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah.',
        data: null
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah.',
        data: null
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login berhasil!',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server.',
      data: null
    });
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Data user berhasil dimuat',
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server: ' + error.message, data: null });
  }
};

// ─── GET /api/auth/users (Admin only) ────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.status(200).json({ success: true, message: 'Daftar user berhasil dimuat', data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server: ' + error.message, data: null });
  }
};

// ─── PUT /api/auth/users/:id/role (Admin only) ───────────────────────────────
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (role !== 'admin' && role !== 'user') {
      return res.status(400).json({ success: false, message: 'Role tidak valid.', data: null });
    }

    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ success: false, message: 'Tidak bisa mengubah role diri sendiri.', data: null });
    }

    const [existing] = await pool.execute('SELECT id FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.', data: null });
    }

    await pool.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);

    res.json({ success: true, message: `Role berhasil diubah menjadi ${role}.` });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server: ' + error.message, data: null });
  }
};

// ─── DELETE /api/auth/users/:id (Admin only) ─────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ success: false, message: 'Tidak bisa menghapus diri sendiri.', data: null });
    }

    const [existing] = await pool.execute('SELECT id, username FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.', data: null });
    }

    await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    res.json({ success: true, message: `User "${existing[0].username}" berhasil dihapus.` });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server: ' + error.message, data: null });
  }
};

module.exports = { register, login, getMe, getAllUsers, updateRole, deleteUser };
