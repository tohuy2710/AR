// src/handlers/hello.js
module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Xin chào! Lambda đang chạy Offline thành công!",
      timestamp: new Date().toISOString(),
    }),
  };
};