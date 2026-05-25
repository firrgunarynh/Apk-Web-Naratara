const express = require('express');
const router = express.Router();
const { register, login, getMe, getAllUsers, updateRole, deleteUser } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me  (perlu login)
router.get('/me', protect, getMe);

// GET /api/auth/users  (admin only)
router.get('/users', protect, adminOnly, getAllUsers);

// PUT /api/auth/users/:id/role (admin only)
router.put('/users/:id/role', protect, adminOnly, updateRole);

// DELETE /api/auth/users/:id (admin only)
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;
