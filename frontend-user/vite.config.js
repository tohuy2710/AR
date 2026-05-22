import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs' // Bắt buộc import thêm module fs của Node.js

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Cho phép truy cập qua IP local (192.168.100.165)
    
    // Cấu hình chứng chỉ SSL mã hóa HTTPS
    https: {
      key: fs.readFileSync('./localhost+1-key.pem'),
      cert: fs.readFileSync('./localhost+1.pem'),
    },

    // Sửa lại cấu hình HMR để iPhone tự động reload code khi bạn sửa trên Mac
    hmr: {
      protocol: 'wss',
      host: '192.168.100.165', // Điền chính xác IP local của Mac để iPhone hiểu
    },
    
    // Nếu bạn đang dùng Vite 6 trở lên, để tránh lỗi "Blocked host" khi vào từ thiết bị khác
    allowedHosts: true 
  }
})