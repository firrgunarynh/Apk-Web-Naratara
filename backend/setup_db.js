const mysql = require('mysql2/promise');
require('dotenv').config();

const setup = async () => {
  try {
    console.log('🔄 Memulai setup database...');
    // Connect without specifying the database first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('✅ Terhubung ke MySQL. Membuat database jika belum ada...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'berita_app'}\``);
    await connection.query(`USE \`${process.env.DB_NAME || 'berita_app'}\``);

    console.log('✅ Membuat tabel users, kategori, dan berita...');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS kategori (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(255) NOT NULL UNIQUE,
        warna VARCHAR(50) DEFAULT '#000000',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS berita (
        id INT AUTO_INCREMENT PRIMARY KEY,
        judul VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        konten LONGTEXT NOT NULL,
        ringkasan TEXT,
        kategori_id INT,
        penulis_id INT,
        thumbnail_url VARCHAR(255),
        status VARCHAR(50) DEFAULT 'draft',
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE SET NULL,
        FOREIGN KEY (penulis_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create default admin user
    const bcrypt = require('bcryptjs');
    const hashedPass = await bcrypt.hash('password', 10);
    await connection.query(`
      INSERT IGNORE INTO users (id, username, email, password, role) 
      VALUES (1, 'admin', 'admin@berita.com', ?, 'admin')
    `, [hashedPass]);

    await connection.query(`
      INSERT IGNORE INTO users (id, username, email, password, role) 
      VALUES (2, 'user', 'user@berita.com', ?, 'user')
    `, [hashedPass]);

    console.log('✅ Setup tabel dan admin user berhasil!');
    await connection.end();
  } catch (error) {
    console.error('❌ Terjadi kesalahan:', error.message);
  }
};

setup();
