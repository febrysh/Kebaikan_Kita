import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../database/yayasan.db');
const uploadsPath = path.join(__dirname, 'uploads');

// Create uploads directory if not exists
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  fs.mkdirSync(path.join(uploadsPath, 'logos'), { recursive: true });
  fs.mkdirSync(path.join(uploadsPath, 'banners'), { recursive: true });
  fs.mkdirSync(path.join(uploadsPath, 'campaigns'), { recursive: true });
}

const db = new Database(dbPath);

console.log('🗄️  Initializing database...');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Users table (for admin authentication)
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Platform settings (logo, banner, contact info)
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Campaigns table
  CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    target INTEGER NOT NULL,
    collected INTEGER DEFAULT 0,
    donors INTEGER DEFAULT 0,
    story TEXT NOT NULL,
    image_url TEXT,
    status TEXT DEFAULT 'active',
    urgent BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Donations table
  CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL,
    donor_name TEXT NOT NULL,
    donor_email TEXT,
    donor_phone TEXT,
    amount INTEGER NOT NULL,
    payment_method TEXT,
    payment_proof TEXT,
    status TEXT DEFAULT 'pending',
    verified_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
  );

  -- Create indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_campaigns_category ON campaigns(category);
  CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
  CREATE INDEX IF NOT EXISTS idx_donations_campaign ON donations(campaign_id);
  CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
`);

console.log('✅ Tables created successfully');

// Insert default admin user
const hashedPassword = bcrypt.hashSync('Hasan0526', 10);
try {
  const stmt = db.prepare(`
    INSERT INTO users (username, email, password, role)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run('admin', 'admin@kebaikan-kita.org', hashedPassword, 'admin');
  console.log('✅ Default admin user created (username: admin, password: Hasan0526)');
} catch (err) {
  if (err.message.includes('UNIQUE constraint failed')) {
    console.log('ℹ️  Admin user already exists');
  } else {
    throw err;
  }
}

// Insert default settings
const defaultSettings = [
  { key: 'platform_name', value: 'Kebaikan Kita', type: 'text' },
  { key: 'logo_url', value: '/uploads/logos/default-logo.png', type: 'file' },
  { key: 'banner_url', value: '/uploads/banners/default-banner.jpg', type: 'file' },
  { key: 'tagline', value: 'Platform Donasi Terpercaya untuk Berbagi Kebaikan', type: 'text' },
  { key: 'about_text', value: 'Kebaikan Kita adalah platform donasi yang menghubungkan para donatur dengan mereka yang membutuhkan bantuan. Kami berkomitmen untuk transparansi dan akuntabilitas dalam setiap kampanye.', type: 'text' },
  { key: 'bank_name', value: 'Bank Central Asia (BCA)', type: 'text' },
  { key: 'account_number', value: '1234567890', type: 'text' },
  { key: 'account_holder', value: 'YAYASAN KEBAIKAN KITA', type: 'text' },
  { key: 'whatsapp', value: '6281234567890', type: 'text' },
  { key: 'email', value: 'info@kebaikan-kita.org', type: 'text' },
  { key: 'instagram', value: '@kebaikan.kita', type: 'text' },
  { key: 'platform_fee', value: '0.10', type: 'number' },
  { key: 'primary_color', value: '#9CAF2F', type: 'text' },
  { key: 'primary_dark', value: '#7A8C24', type: 'text' }
];

const insertSetting = db.prepare(`
  INSERT OR IGNORE INTO settings (key, value, type)
  VALUES (?, ?, ?)
`);

defaultSettings.forEach(setting => {
  insertSetting.run(setting.key, setting.value, setting.type);
});

console.log('✅ Default settings inserted');

// Insert sample campaigns
const sampleCampaigns = [
  {
    title: 'Bantu Biaya Operasi Ibu Siti',
    slug: 'bantu-biaya-operasi-ibu-siti',
    category: 'infaq',
    target: 25000000,
    collected: 18500000,
    donors: 87,
    story: 'Ibu Siti membutuhkan operasi segera untuk penyakit jantung yang dideritanya. Keluarga beliau sangat membutuhkan bantuan untuk biaya operasi dan perawatan.',
    status: 'active',
    urgent: 1
  },
  {
    title: 'Wakaf Masjid Al-Ikhlas',
    slug: 'wakaf-masjid-al-ikhlas',
    category: 'wakaf',
    target: 500000000,
    collected: 234000000,
    donors: 456,
    story: 'Pembangunan masjid untuk umat di daerah pedalaman. Dana akan digunakan untuk pembangunan gedung masjid, fasilitas wudhu, dan area parkir.',
    status: 'active',
    urgent: 1
  },
  {
    title: 'Qurban Sapi Dhuafa',
    slug: 'qurban-sapi-dhuafa',
    category: 'qurban',
    target: 20000000,
    collected: 12500000,
    donors: 34,
    story: 'Program qurban untuk keluarga dhuafa di berbagai daerah. Daging qurban akan didistribusikan kepada yang membutuhkan.',
    status: 'active',
    urgent: 0
  },
  {
    title: 'Zakat Fitrah 1446 H',
    slug: 'zakat-fitrah-1446-h',
    category: 'zakat',
    target: 50000000,
    collected: 35000000,
    donors: 234,
    story: 'Penyaluran zakat fitrah untuk fakir miskin menjelang Idul Fitri 1446 H. Mari tunaikan kewajiban zakat Anda.',
    status: 'active',
    urgent: 1
  }
];

const insertCampaign = db.prepare(`
  INSERT OR IGNORE INTO campaigns (title, slug, category, target, collected, donors, story, status, urgent)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

sampleCampaigns.forEach(campaign => {
  insertCampaign.run(
    campaign.title,
    campaign.slug,
    campaign.category,
    campaign.target,
    campaign.collected,
    campaign.donors,
    campaign.story,
    campaign.status,
    campaign.urgent
  );
});

console.log('✅ Sample campaigns inserted');

// Insert sample donations
const campaigns = db.prepare('SELECT id FROM campaigns LIMIT 3').all();
if (campaigns.length > 0) {
  const sampleDonations = [
    { campaign_id: campaigns[0].id, donor_name: 'Ahmad Wijaya', amount: 500000, status: 'verified' },
    { campaign_id: campaigns[0].id, donor_name: 'Hamba Allah', amount: 100000, status: 'verified' },
    { campaign_id: campaigns[1].id, donor_name: 'Fatimah Zahra', amount: 1000000, status: 'pending' }
  ];

  const insertDonation = db.prepare(`
    INSERT INTO donations (campaign_id, donor_name, amount, status)
    VALUES (?, ?, ?, ?)
  `);

  sampleDonations.forEach(donation => {
    insertDonation.run(donation.campaign_id, donation.donor_name, donation.amount, donation.status);
  });

  console.log('✅ Sample donations inserted');
}

db.close();

console.log('\n✨ Database initialization complete!');
console.log('📍 Database location:', dbPath);
console.log('\n🔐 Default Admin Login:');
console.log('   Username: admin');
console.log('   Password: Hasan0526');
console.log('\n🚀 Run "npm start" to start the server');
