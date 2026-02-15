# 🚀 QUICK START GUIDE - Kebaikan Kita

## Langkah Cepat untuk Mulai (5 Menit!)

### 1. Setup Backend (2 menit)

```bash
# Masuk ke folder server
cd server

# Install dependencies
npm install

# Copy .env example
cp .env.example .env

# Initialize database
npm run init-db

# Start backend
npm start
```

✅ Backend running di: **http://localhost:5000**

---

### 2. Setup Frontend (2 menit)

Buka terminal BARU (jangan close yang backend), lalu:

```bash
# Masuk ke folder client
cd client

# Install dependencies
npm install

# Copy .env example
cp .env.example .env

# Start frontend
npm run dev
```

✅ Frontend running di: **http://localhost:5173**

---

### 3. Login Admin (1 menit)

1. Buka browser, kunjungi: **http://localhost:5173/#hasan-admin**
2. Login dengan:
   - Username: `admin`
   - Password: `Hasan0526`

---

## ✨ DONE! Selamat Menggunakan!

### Yang Bisa Lu Lakukan Sekarang:

#### Public Pages (tanpa login):
- 🏠 Home: `http://localhost:5173/`
- 📊 Kalkulator Zakat: `http://localhost:5173/#` → klik "Kalkulator"
- ℹ️ About: `http://localhost:5173/#` → klik "Tentang"
- 💰 Donasi: Klik campaign apapun → klik "Donasi Sekarang"

#### Admin Panel (setelah login):
- 📊 Dashboard: Lihat statistik
- 📝 Campaigns: Manage semua campaign
- 💵 Donations: Verify/reject donasi
- ⚙️ Settings: Upload logo/banner, edit platform info

---

## 🎯 Hal Penting yang Harus Lu Lakukan:

### 1. Upload Logo & Banner Yayasan
1. Login admin
2. Klik "Settings"
3. Upload logo yayasan
4. Upload banner yayasan

### 2. Update Informasi Bank
1. Login admin
2. Klik "Settings"
3. Edit:
   - Bank Name
   - Account Number
   - Account Holder

### 3. Update Kontak
1. Login admin
2. Klik "Settings"
3. Edit:
   - WhatsApp
   - Email
   - Instagram

### 4. Ganti Password Admin (PENTING!)
Setelah first login, **segera ganti password** di database atau buat user admin baru dengan password yang kuat.

---

## 📱 Test Workflow Lengkap:

### Sebagai User (Public):
1. Buka home page
2. Pilih kategori (Zakat/Wakaf/Infaq/Qurban)
3. Klik campaign
4. Klik "Donasi Sekarang"
5. Isi form donasi
6. Submit (status: pending)

### Sebagai Admin:
1. Login admin
2. Buka "Donations"
3. Lihat donasi pending
4. Verify donasi
5. Check dashboard - angka updated!

---

## 🆘 Need Help?

### Backend Error?
```bash
# Restart backend
cd server
npm start
```

### Frontend Error?
```bash
# Restart frontend
cd client
npm run dev
```

### Database Error?
```bash
# Reset database
cd server
rm -rf ../database/yayasan.db
npm run init-db
npm start
```

---

## 📂 File Penting:

- `/server/.env` - Backend configuration
- `/client/.env` - Frontend configuration
- `/database/yayasan.db` - Database file (BACKUP INI!)
- `/server/uploads/` - Logo, banner, gambar campaign

---

## 🎉 Next Steps:

1. ✅ Upload logo & banner yayasan
2. ✅ Edit informasi bank & kontak
3. ✅ Buat campaign baru
4. ✅ Test donation flow
5. ✅ Ganti admin password
6. 🚀 Deploy to production!

---

**Barakallahu fiikum!** 🤲

Kalau ada error atau butuh bantuan, hubungi developer.
