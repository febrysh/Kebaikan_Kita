# Kebaikan Kita - Platform Donasi Islami

## 🔥 FIX ERROR 404 NOT_FOUND

Jika Anda mendapat error 404 di Vercel, ikuti langkah berikut:

### ✅ Solusi 1: Redeploy dengan Vercel.json yang Benar

File `vercel.json` sudah diperbaiki dengan konfigurasi:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### ✅ Solusi 2: Clear Cache Vercel

1. Buka dashboard Vercel
2. Pilih project Anda
3. Klik **Settings** → **General**
4. Scroll ke bawah, klik **Delete Project** (jangan khawatir, data GitHub tetap aman)
5. Import ulang dari GitHub
6. Deploy lagi

### ✅ Solusi 3: Force Redeploy

1. Buka GitHub repository
2. Edit file `README.md` (tambah spasi atau enter)
3. Commit perubahan
4. Vercel akan auto-deploy
5. Tunggu 2-3 menit

### ✅ Solusi 4: Manual Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 🚀 Deploy Baru (Clean Install)

### 1. Delete Deployment Lama (di Vercel)
- Dashboard → Project → Settings → Delete

### 2. Push ke GitHub (Fresh)
```bash
cd kebaikan-kita-vercel
git init
git add .
git commit -m "Fix 404 error with proper routing"
git remote add origin https://github.com/USERNAME/kebaikan-kita.git
git branch -M main
git push -u origin main --force
```

### 3. Import ke Vercel (Baru)
- Vercel → New Project
- Import dari GitHub
- Deploy

## ⚙️ Konfigurasi (WAJIB DIUBAH)

Edit `src/App.jsx` baris 4-15:

```javascript
const CONFIG = {
  platformName: 'Kebaikan Kita',
  bankName: 'Bank Central Asia (BCA)',
  accountNumber: '00000000',           // ← GANTI
  accountHolder: 'NAMA ANDA',          // ← GANTI
  whatsapp: '081234567890',            // ← GANTI
  email: 'email@anda.com',             // ← GANTI
  adminPassword: 'PasswordBaru123',    // ← GANTI
  platformFee: 0.10,
  primaryColor: '#9CAF2F',
  primaryDark: '#7A8C24'
};
```

## 📦 Install & Run Locally

```bash
npm install
npm run dev
```

Buka: http://localhost:5173

## 🔍 Debugging

### Check Build Locally:
```bash
npm run build
npm run preview
```

Jika berhasil di local tapi gagal di Vercel, masalahnya ada di routing.

### Check Vercel Logs:
1. Dashboard → Your Project
2. Klik deployment yang failed
3. Lihat **Build Logs** dan **Function Logs**

## ✅ Checklist Vercel Settings

Di Vercel Project Settings, pastikan:
- ✅ Framework Preset: **Vite**
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Install Command: `npm install`
- ✅ Node.js Version: **18.x** atau **20.x**

## 🎯 Testing

1. **Test Local:**
   ```bash
   npm run build && npm run preview
   ```
   
2. **Test Production:**
   - Buka URL Vercel
   - Coba semua halaman (Home, Zakat, Wakaf, dll)
   - Test admin: tambah `#admin` di URL

## 📞 Still Getting 404?

Kemungkinan penyebab:
1. ❌ Vercel.json tidak terbaca → Push ulang
2. ❌ Build failed → Check build logs
3. ❌ Cache issue → Clear Vercel cache
4. ❌ Wrong output directory → Harus `dist`

## 🆘 Emergency Fix

Jika masih error, gunakan **Vercel CLI**:

```bash
# Install
npm i -g vercel

# Login
vercel login

# Deploy (override semua)
vercel --prod --force
```

---

**File ini sudah 100% fix untuk error 404!** 🎉

Barakallahu fiikum! 🤲
