# Furniture AR APP

Huong dan chay frontend `frontend-atelier` tren may local.

## Yeu cau

- Cai Node.js
- Cai npm

## Cach chay

1. Mo terminal tai thu muc goc `AR`, sau do vao thu muc frontend:

   ```powershell
   cd frontend-atelier
   ```

2. Cai dependencies:

   ```powershell
   npm install
   ```

3. Tao file `.env.local` neu app can cau hinh bien moi truong:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   Sau do mo `.env.local` va thay cac gia tri mau neu can.

4. Chay dev server:

   ```powershell
   npm run dev
   ```

5. Mo trinh duyet tai:

   ```text
   http://localhost:3000
   ```

## Lenh huu ich

Kiem tra TypeScript:

```powershell
npm run lint
```

Build ban production:

```powershell
npm run build
```
