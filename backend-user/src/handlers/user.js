// src/handlers/user.js
const userController = require('../controllers/userController');

// Hàm xử lý cho POST /users
module.exports.create = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const newUser = await userController.createUser(body.name, body.email);
    
    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    };
  } catch (error) {
    console.error('Error in create user:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Dữ liệu không hợp lệ', details: error.message }),
    };
  }
};

// Hàm xử lý cho GET /users
module.exports.getAll = async (event) => {
  try {
    const users = await userController.getAllUsers();
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error('Error in get users:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};