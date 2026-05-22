// src/config/database.js
const mysql = require('mysql2/promise');

// Điền trực tiếp cấu hình kết nối ở đây
const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'rootpassword',
  database: 'furniture_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;