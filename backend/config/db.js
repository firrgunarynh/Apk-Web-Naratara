const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'berita_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

// Test koneksi saat startup
pool.getConnection()
  .then(conn => {
    console.log('✅ Database MySQL terhubung!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Gagal konek database:', err.message);
  });

module.exports = pool;
