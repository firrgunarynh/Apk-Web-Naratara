const express = require('express');
const router = express.Router();
const { getDashboardStats, fetchExternalNews } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/v1/admin/dashboard-stats
router.get('/dashboard-stats', protect, adminOnly, getDashboardStats);

// POST /api/v1/admin/fetch-external
router.post('/fetch-external', protect, adminOnly, fetchExternalNews);

module.exports = router;
