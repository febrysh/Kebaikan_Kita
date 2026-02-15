# 🚀 DEPLOYMENT GUIDE - Kebaikan Kita

Panduan lengkap deploy aplikasi ke production untuk yayasan kakak lu!

---

## 📋 Checklist Pre-Deployment

Sebelum deploy, pastikan:
- [ ] Logo & banner yayasan sudah di-upload
- [ ] Informasi bank sudah di-update
- [ ] Contact info (WA, Email, IG) sudah benar
- [ ] Sample campaigns sudah diedit/dihapus
- [ ] Admin password sudah diganti
- [ ] Database sudah di-backup

---

## 🌐 Option 1: Deploy ke VPS (Recommended untuk Full Control)

### Platform: DigitalOcean, Linode, AWS EC2, Vultr

#### Step 1: Setup Server

```bash
# SSH ke server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install nginx (web server)
apt install -y nginx

# Install git
apt install -y git
```

#### Step 2: Clone & Setup Project

```bash
# Clone project
cd /var/www
git clone <your-github-repo-url> yayasan
cd yayasan

# Setup backend
cd server
npm install
cp .env.example .env
nano .env  # Edit dengan config production

# Generate JWT secret yang kuat
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copy output dan paste di JWT_SECRET

# Initialize database
npm run init-db

# Setup frontend
cd ../client
npm install
npm run build
```

#### Step 3: Configure Nginx

```bash
nano /etc/nginx/sites-available/yayasan
```

Paste config ini:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/yayasan/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploaded files
    location /uploads {
        alias /var/www/yayasan/server/uploads;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/yayasan /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### Step 4: Start Backend dengan PM2

```bash
cd /var/www/yayasan/server
pm2 start server.js --name yayasan-backend
pm2 save
pm2 startup  # Follow instructions
```

#### Step 5: Setup SSL (HTTPS) dengan Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

✅ DONE! Website live di **https://yourdomain.com**

---

## ☁️ Option 2: Deploy ke Railway.app (Easiest!)

### Backend

1. Push code ke GitHub
2. Buka https://railway.app
3. Click "New Project" → "Deploy from GitHub"
4. Select repository
5. Set environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=<generate-random-string>
   DATABASE_PATH=./database/yayasan.db
   ```
6. Deploy!

### Frontend

```bash
cd client
npm run build
```

Upload folder `dist` ke Vercel atau Netlify (see below)

Update `VITE_API_URL` di frontend env ke Railway URL

---

## 🔷 Option 3: Deploy Frontend ke Vercel

```bash
cd client

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL production
# Enter: https://your-backend-url.com/api
```

Atau:
1. Connect GitHub repo di https://vercel.com
2. Select `client` folder as root
3. Add environment variable `VITE_API_URL`
4. Deploy!

---

## 🟢 Option 4: Deploy Frontend ke Netlify

```bash
cd client
npm run build
```

Lalu:

#### Via CLI:
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

#### Via Web:
1. Drag & drop folder `dist` ke https://app.netlify.com
2. Done!

Set environment variable di Netlify dashboard:
- Key: `VITE_API_URL`
- Value: `https://your-backend-url.com/api`

---

## 🐳 Option 5: Deploy dengan Docker (Advanced)

### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ .
RUN mkdir -p uploads/logos uploads/banners uploads/campaigns
EXPOSE 5000
CMD ["node", "server.js"]
```

### Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client/ .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    volumes:
      - ./database:/app/database
      - ./server/uploads:/app/uploads
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
      args:
        VITE_API_URL: http://localhost:5000/api
    ports:
      - "80:80"
    depends_on:
      - backend
```

Deploy:
```bash
docker-compose up -d
```

---

## 🔒 Security Checklist Production

- [ ] HTTPS enabled (SSL certificate)
- [ ] JWT_SECRET adalah random string yang kuat
- [ ] Admin password sudah diganti
- [ ] Database di-backup secara rutin
- [ ] File permissions benar (uploads folder writable)
- [ ] Firewall aktif (UFW/iptables)
- [ ] Rate limiting enabled (nginx/express)
- [ ] CORS configured properly
- [ ] Environment variables tidak di-commit ke git

---

## 📊 Monitoring & Maintenance

### Check Backend Status (PM2)
```bash
pm2 status
pm2 logs yayasan-backend
pm2 restart yayasan-backend
```

### Backup Database
```bash
# Manual backup
cp /var/www/yayasan/database/yayasan.db /backup/yayasan-$(date +%Y%m%d).db

# Auto backup daily (crontab)
0 2 * * * cp /var/www/yayasan/database/yayasan.db /backup/yayasan-$(date +\%Y\%m\%d).db
```

### Update Application
```bash
cd /var/www/yayasan
git pull
cd server
npm install
pm2 restart yayasan-backend

cd ../client
npm install
npm run build
```

---

## 🆘 Troubleshooting Production

### Error 502 Bad Gateway
```bash
# Check backend is running
pm2 status
pm2 logs yayasan-backend

# Restart backend
pm2 restart yayasan-backend
```

### Database locked
```bash
# Check who's using the database
lsof /var/www/yayasan/database/yayasan.db

# Restart backend
pm2 restart yayasan-backend
```

### Upload not working
```bash
# Fix permissions
chmod 755 /var/www/yayasan/server/uploads
chmod 755 /var/www/yayasan/server/uploads/logos
chmod 755 /var/www/yayasan/server/uploads/banners
chmod 755 /var/www/yayasan/server/uploads/campaigns
```

---

## 📱 Post-Deployment Testing

Test semua fitur:
1. ✅ Home page load
2. ✅ Campaign list tampil
3. ✅ Campaign detail page
4. ✅ Donation form submit
5. ✅ Admin login
6. ✅ Upload logo/banner
7. ✅ Create campaign
8. ✅ Verify donation
9. ✅ Calculator page
10. ✅ About page

---

## 💰 Estimasi Biaya Hosting

### VPS (Full Control)
- DigitalOcean Droplet: $6/bulan (1GB RAM)
- Linode Nanode: $5/bulan (1GB RAM)
- Vultr: $6/bulan (1GB RAM)

### Serverless (Easy Setup)
- Railway: Free tier → $5-10/bulan
- Vercel: Free untuk frontend
- Netlify: Free untuk frontend

### Domain
- .com: ~$12/tahun
- .id: ~Rp 200,000/tahun

**Total minimal: $5-15/bulan** (tergantung traffic)

---

**Good luck with deployment! 🚀**

Kalau ada masalah saat deployment, screenshot error dan contact developer.
