// src/controllers/userController.js
const db = require('../config/database');

class UserController {
  // Lấy danh sách users từ DB
  async getAllUsers() {
    // db.query sẽ tự động mượn một connection từ Pool và trả lại sau khi chạy xong
    const [rows] = await db.query('SELECT id, name, email FROM users');
    return rows;
  }

  // Tạo user mới
  async createUser(name, email) {
    const [result] = await db.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    return { id: result.insertId, name, email };
  }
}

module.exports = new UserController();