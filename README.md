# Kebaikan Kita - Platform Donasi Yayasan Fullstack

Platform donasi Islami lengkap dengan backend Node.js, database SQLite, authentication, dan admin panel untuk manage konten.

## 🚀 Features

### Frontend (React + Vite + Tailwind)
- ✅ Responsive design untuk semua device
- ✅ Home page dengan kategori donasi (Zakat, Wakaf, Infaq, Qurban)
- ✅ Campaign detail page dengan progress bar
- ✅ Donation form dengan konfirmasi transfer
- ✅ Kalkulator Zakat Maal
- ✅ About page dengan info kontak
- ✅ Dynamic logo & banner dari database

### Backend (Node.js + Express)
- ✅ RESTful API endpoints
- ✅ JWT authentication untuk admin
- ✅ SQLite database (easy to deploy)
- ✅ File upload system (logo, banner, campaign images)
- ✅ CRUD operations untuk campaigns & donations
- ✅ Settings management untuk platform config

### Admin Panel
- ✅ Secure login dengan JWT
- ✅ Dashboard dengan statistics
- ✅ Manage campaigns (create, edit, delete)
- ✅ Verify/reject donations
- ✅ Upload logo & banner yayasan
- ✅ Update platform settings (bank info, contact, etc)

## 📁 Project Structure

```
yayasan-fullstack/
├── server/                 # Backend Node.js
│   ├── routes/            # API route handlers
│   │   ├── auth.js        # Login/logout endpoints
│   │   ├── campaigns.js   # Campaign CRUD
│   │   ├── donations.js   # Donation management
│   │   ├── settings.js    # Platform settings
│   │   └── upload.js      # File upload handlers
│   ├── middleware/        # Express middleware
│   │   └── auth.js        # JWT verification
│   ├── models/            # Database connection
│   │   └── database.js
│   ├── uploads/           # Uploaded files storage
│   │   ├── logos/
│   │   ├── banners/
│   │   └── campaigns/
│   ├── server.js          # Main Express app
│   ├── initDatabase.js    # Database initialization
│   ├── package.json
│   └── .env              # Environment variables
├── client/               # Frontend React
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── api.js        # API service layer
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── database/             # SQLite database file
    └── yayasan.db
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm atau yarn

### Step 1: Setup Backend

```bash
cd server
npm install
```

### Step 2: Initialize Database

```bash
npm run init-db
```

Output yang diharapkan:
```
🗄️  Initializing database...
✅ Tables created successfully
✅ Default admin user created (username: admin, password: Hasan0526)
✅ Default settings inserted
✅ Sample campaigns inserted
✅ Sample donations inserted

✨ Database initialization complete!
📍 Database location: /path/to/database/yayasan.db

🔐 Default Admin Login:
   Username: admin
   Password: Hasan0526
```

### Step 3: Start Backend Server

```bash
npm start
```

Backend akan running di `http://localhost:5000`

### Step 4: Setup Frontend

Buka terminal baru, lalu:

```bash
cd client
npm install
```

### Step 5: Configure Frontend API URL

Buat file `.env` di folder `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 6: Start Frontend

```bash
npm run dev
```

Frontend akan running di `http://localhost:5173`

## 🔐 Default Admin Access

**Login Credentials:**
- Username: `admin`
- Password: `Hasan0526`

**Cara masuk Admin Panel:**
1. Buka browser, kunjungi: `http://localhost:5173/#hasan-admin`
2. Login dengan credentials di atas
3. Setelah login, akan redirect ke Dashboard Admin

## 📝 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Semua endpoint yang butuh admin access memerlukan JWT token di header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Auth
- `POST /auth/login` - Login admin
- `GET /auth/verify` - Verify token
- `POST /auth/logout` - Logout

#### Campaigns
- `GET /campaigns` - Get all campaigns (public)
- `GET /campaigns/:id` - Get single campaign (public)
- `POST /campaigns` - Create campaign (admin)
- `PUT /campaigns/:id` - Update campaign (admin)
- `DELETE /campaigns/:id` - Delete campaign (admin)
- `GET /campaigns/stats/summary` - Get statistics (admin)

#### Donations
- `GET /donations` - Get donations
- `POST /donations` - Create donation (public)
- `PATCH /donations/:id/verify` - Verify/reject donation (admin)
- `DELETE /donations/:id` - Delete donation (admin)
- `GET /donations/stats/summary` - Get statistics (admin)

#### Settings
- `GET /settings` - Get all settings (public)
- `GET /settings/:key` - Get setting by key (public)
- `PUT /settings/:key` - Update setting (admin)
- `POST /settings/bulk` - Bulk update settings (admin)
- `POST /settings` - Create new setting (admin)
- `DELETE /settings/:key` - Delete setting (admin)

#### Upload
- `POST /upload/logo` - Upload logo (admin)
- `POST /upload/banner` - Upload banner (admin)
- `POST /upload/campaign` - Upload campaign image (admin)
- `DELETE /upload/:type/:filename` - Delete file (admin)

## 📊 Database Schema

### Tables

**users**
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- email (TEXT UNIQUE)
- password (TEXT - bcrypt hashed)
- role (TEXT)
- created_at, updated_at (DATETIME)

**campaigns**
- id (INTEGER PRIMARY KEY)
- title, slug (TEXT)
- category (TEXT) - zakat, wakaf, infaq, qurban
- target, collected, donors (INTEGER)
- story, image_url (TEXT)
- status (TEXT) - active, inactive
- urgent (BOOLEAN)
- created_at, updated_at (DATETIME)

**donations**
- id (INTEGER PRIMARY KEY)
- campaign_id (INTEGER FOREIGN KEY)
- donor_name, donor_email, donor_phone (TEXT)
- amount (INTEGER)
- payment_method, payment_proof (TEXT)
- status (TEXT) - pending, verified, rejected
- verified_at, created_at (DATETIME)

**settings**
- id (INTEGER PRIMARY KEY)
- key (TEXT UNIQUE)
- value (TEXT)
- type (TEXT) - text, file, number
- updated_at (DATETIME)

## 🎨 Customization

### Update Logo & Banner
1. Login ke admin panel
2. Buka menu "Settings"
3. Upload logo baru (max 5MB, format: JPG, PNG, WebP)
4. Upload banner baru (max 5MB, format: JPG, PNG, WebP)

### Update Platform Info
1. Login ke admin panel
2. Buka menu "Settings"
3. Edit informasi seperti:
   - Nama platform
   - Tagline
   - Nomor rekening bank
   - WhatsApp, Email, Instagram
   - Warna tema

### Manage Campaigns
1. Login ke admin panel
2. Buka menu "Campaigns"
3. Klik "Buat Campaign Baru"
4. Isi form dan upload gambar
5. Klik "Simpan"

### Verify Donations
1. Login ke admin panel
2. Buka menu "Donations"
3. Lihat donasi dengan status "Pending"
4. Klik "Verify" atau "Reject"

## 🚀 Deployment

### Deploy Backend (Server)

#### Option 1: VPS (DigitalOcean, Linode, AWS EC2)
```bash
# Clone project
git clone <your-repo>
cd yayasan-fullstack/server

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit dengan config production

# Initialize database
npm run init-db

# Install PM2 untuk process management
npm install -g pm2

# Start dengan PM2
pm2 start server.js --name yayasan-backend
pm2 save
pm2 startup
```

#### Option 2: Railway.app
1. Upload project ke GitHub
2. Connect Railway dengan GitHub repo
3. Set environment variables di Railway dashboard
4. Deploy otomatis!

#### Option 3: Heroku
```bash
# Install Heroku CLI
heroku create yayasan-backend
heroku config:set NODE_ENV=production
git push heroku main
```

### Deploy Frontend

#### Option 1: Vercel (Recommended)
```bash
cd client
npm install -g vercel
vercel
```

#### Option 2: Netlify
1. Drag & drop folder `client/dist` ke Netlify
2. Atau connect dengan GitHub untuk auto-deploy

#### Option 3: Build & Upload ke Hosting
```bash
cd client
npm run build
# Upload folder 'dist' ke hosting (cPanel, etc)
```

### Production .env Example

**Backend (.env):**
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secret-key-change-this-please
DATABASE_PATH=../database/yayasan.db
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## 🔒 Security Notes

1. **Ganti JWT Secret** di `.env` dengan random string yang kuat
2. **Ganti Admin Password** setelah first login
3. **Enable HTTPS** untuk production
4. **Backup Database** secara rutin
5. **Rate Limiting** - Consider adding rate limiting untuk API endpoints

## 🐛 Troubleshooting

### Backend tidak bisa start
- Pastikan Node.js sudah terinstall: `node --version`
- Cek apakah port 5000 sudah terpakai: `lsof -i :5000`
- Cek error di console

### Frontend tidak bisa connect ke backend
- Pastikan backend sedang running
- Cek VITE_API_URL di `.env` sudah benar
- Cek CORS settings di `server.js`

### Database error
- Delete file `database/yayasan.db`
- Run ulang `npm run init-db`

### Upload file error
- Cek folder `server/uploads` ada dan writable
- Cek file size tidak lebih dari 5MB

## 📞 Support

Kalau ada pertanyaan atau butuh bantuan:
- WhatsApp: 08000000000
- Email: Hasan@gmail.com
- Instagram: @KebaikanKita

## 📄 License

MIT License - Bebas dipakai dan dimodifikasi

---

**Barakallahu fiikum!** 🤲

Dibuat dengan ❤️ untuk Yayasan Kebaikan Kita
