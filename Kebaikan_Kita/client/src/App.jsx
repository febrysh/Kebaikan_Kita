import React, { useState, useEffect } from 'react';
import { Heart, Users, TrendingUp, Menu, X, Home, Gift, BookOpen, DollarSign, Eye, EyeOff, LogOut, ChevronLeft, ChevronRight, CheckCircle, ArrowRight, Plus, Edit2, Trash2, Save, XCircle } from 'lucide-react';

const CONFIG = {
  platformName: 'Kebaikan Kita',
  bankName: 'Bank Central Asia (BCA)',
  accountNumber: '00000000',
  accountHolder: 'FIRMAN SUTARMAN HASAN',
  whatsapp: '08000000000',
  email: 'Hasan@gmail.com',
  instagram: '@KebaikanKita',
  adminPassword: 'Hasan0526',
  platformFee: 0.10,
  primaryColor: '#9CAF2F',
  primaryDark: '#7A8C24'
};

const INITIAL_CAMPAIGNS = [
  { id: '1', title: 'Bantu Biaya Operasi Ibu Siti', category: 'infaq', target: 25000000, collected: 18500000, donors: 87, story: 'Ibu Siti membutuhkan operasi segera untuk penyakit jantung yang dideritanya. Keluarga beliau sangat membutuhkan bantuan untuk biaya operasi dan perawatan.', status: 'active', urgent: true },
  { id: '2', title: 'Wakaf Masjid Al-Ikhlas', category: 'wakaf', target: 500000000, collected: 234000000, donors: 456, story: 'Pembangunan masjid untuk umat di daerah pedalaman. Dana akan digunakan untuk pembangunan gedung masjid, fasilitas wudhu, dan area parkir.', status: 'active', urgent: true },
  { id: '3', title: 'Qurban Sapi Dhuafa', category: 'qurban', target: 20000000, collected: 12500000, donors: 34, story: 'Program qurban untuk keluarga dhuafa di berbagai daerah. Daging qurban akan didistribusikan kepada yang membutuhkan.', status: 'active', urgent: false },
  { id: '4', title: 'Zakat Fitrah 1446 H', category: 'zakat', target: 50000000, collected: 35000000, donors: 234, story: 'Penyaluran zakat fitrah untuk fakir miskin menjelang Idul Fitri 1446 H. Mari tunaikan kewajiban zakat Anda.', status: 'active', urgent: true },
];

const INITIAL_DONATIONS = [
  { id: '1', campaignId: '1', name: 'Ahmad', amount: 500000, status: 'verified', createdAt: new Date().toISOString() },
  { id: '2', campaignId: '1', name: 'Hamba Allah', amount: 100000, status: 'verified', createdAt: new Date().toISOString() },
  { id: '3', campaignId: '2', name: 'Fatimah', amount: 1000000, status: 'pending', createdAt: new Date().toISOString() }
];

export default function App() {
  const [view, setView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [donations, setDonations] = useState(INITIAL_DONATIONS);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // BACKDOOR URL RAHASIA untuk akses admin
    // Akses via: https://yoursite.com/#secret-admin-2025
    if (window.location.hash === '#hasan-admin') {
      setView('admin-login');
    }
  }, []);

  const navigate = (v, cat = null, camp = null) => {
    setView(v);
    setSelectedCategory(cat);
    setSelectedCampaign(camp);
    setShowMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar navigate={navigate} isAdmin={isAdmin} setIsAdmin={setIsAdmin} showMenu={showMenu} setShowMenu={setShowMenu} />
      
      {view === 'home' && !selectedCategory && <HomePage navigate={navigate} campaigns={campaigns} />}
      {view === 'home' && selectedCategory && <CategoryPage category={selectedCategory} campaigns={campaigns.filter(c => c.category === selectedCategory)} navigate={navigate} />}
      {view === 'campaign' && <CampaignPage campaign={selectedCampaign} donations={donations.filter(d => d.campaignId === selectedCampaign?.id)} navigate={navigate} />}
      {view === 'donation' && <DonationPage campaign={selectedCampaign} navigate={navigate} setDonations={setDonations} />}
      {view === 'admin-login' && <AdminLogin navigate={navigate} setIsAdmin={setIsAdmin} />}
      {view === 'admin' && isAdmin && <AdminPanel campaigns={campaigns} setCampaigns={setCampaigns} donations={donations} setDonations={setDonations} navigate={navigate} setIsAdmin={setIsAdmin} />}
      {view === 'calculator' && <Calculator navigate={navigate} />}
      {view === 'about' && <About navigate={navigate} />}
      
      <Footer />
    </div>
  );
}

function Navbar({ navigate, isAdmin, setIsAdmin, showMenu, setShowMenu }) {
  // BACKDOOR: Admin hanya bisa diakses via URL rahasia, tidak ada tombol di navbar
  
  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <button onClick={() => navigate('home')} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: CONFIG.primaryColor }}>
              <Heart className="text-white" size={20} fill="white" />
            </div>
            <span className="font-bold text-lg">{CONFIG.platformName}</span>
          </button>

          <div className="hidden md:flex gap-6 items-center">
            <button onClick={() => navigate('home')}>Beranda</button>
            <button onClick={() => navigate('about')}>Tentang</button>
            <button onClick={() => navigate('calculator')}>Kalkulator</button>
            {/* Admin button HANYA muncul kalau sudah login */}
            {isAdmin && (
              <>
                <button onClick={() => navigate('admin')} className="px-4 py-2 text-white rounded" style={{ backgroundColor: CONFIG.primaryColor }}>Dashboard</button>
                <button onClick={() => { setIsAdmin(false); navigate('home'); }} title="Logout"><LogOut size={20} /></button>
              </>
            )}
          </div>

          <button onClick={() => setShowMenu(!showMenu)} className="md:hidden">
            {showMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {showMenu && (
          <div className="md:hidden pb-4 space-y-2">
            <button onClick={() => navigate('home')} className="block w-full text-left px-4 py-2">Beranda</button>
            <button onClick={() => navigate('about')} className="block w-full text-left px-4 py-2">Tentang</button>
            <button onClick={() => navigate('calculator')} className="block w-full text-left px-4 py-2">Kalkulator</button>
            {isAdmin && (
              <button onClick={() => navigate('admin')} className="block w-full text-left px-4 py-2">Dashboard Admin</button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function HomePage({ navigate, campaigns }) {
  const categories = [
    { id: 'zakat', name: 'Zakat', icon: BookOpen },
    { id: 'wakaf', name: 'Wakaf', icon: Home },
    { id: 'infaq', name: 'Infaq', icon: Gift },
    { id: 'qurban', name: 'Qurban', icon: DollarSign }
  ];

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="rounded-2xl p-12 text-white" style={{ background: `linear-gradient(135deg, ${CONFIG.primaryColor}, ${CONFIG.primaryDark})` }}>
          <p className="mb-2">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
          <h1 className="text-4xl font-bold mb-4">Berbagi Kebaikan, Raih Berkah</h1>
          <p className="text-lg">Platform donasi Islami terpercaya</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => navigate('home', cat.id)}
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl hover:shadow-lg transition"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${CONFIG.primaryColor}20` }}>
                  <Icon size={32} style={{ color: CONFIG.primaryColor }} />
                </div>
                <span className="font-semibold">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Program Prioritas</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {campaigns.filter(c => c.status === 'active').slice(0, 6).map(c => (
            <CampaignCard key={c.id} campaign={c} onClick={() => navigate('campaign', null, c)} />
          ))}
        </div>
      </section>
    </>
  );
}

function CategoryPage({ category, campaigns, navigate }) {
  const [visible, setVisible] = useState(6);
  const [slide, setSlide] = useState(0);
  
  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const urgent = activeCampaigns.filter(c => c.urgent);
  const hasMore = visible < activeCampaigns.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate('home')} className="mb-6" style={{ color: CONFIG.primaryColor }}>← Kembali</button>
      
      <h1 className="text-3xl font-bold mb-8 capitalize">{category}</h1>

      {urgent.length > 0 && (
        <div className="mb-12 relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gray-200 h-64 flex items-center justify-center">
              <p className="text-gray-500">[Foto]</p>
            </div>
            <div className="md:w-2/3 p-8">
              <span className="px-3 py-1 rounded-full text-xs font-semibold mb-3 inline-block" style={{ backgroundColor: `${CONFIG.primaryColor}20`, color: CONFIG.primaryColor }}>MENDESAK</span>
              <h3 className="text-2xl font-bold mb-3">{urgent[slide]?.title}</h3>
              <p className="text-gray-600 mb-4">{urgent[slide]?.story}</p>
              <button onClick={() => navigate('campaign', null, urgent[slide])} className="px-6 py-3 text-white rounded-lg font-semibold" style={{ backgroundColor: CONFIG.primaryColor }}>
                Donasi Sekarang
              </button>
            </div>
          </div>
          {urgent.length > 1 && (
            <>
              <button onClick={() => setSlide((slide - 1 + urgent.length) % urgent.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center">
                <ChevronLeft />
              </button>
              <button onClick={() => setSlide((slide + 1) % urgent.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center">
                <ChevronRight />
              </button>
            </>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {activeCampaigns.slice(0, visible).map(c => (
          <CampaignCard key={c.id} campaign={c} onClick={() => navigate('campaign', null, c)} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <button onClick={() => setVisible(v => v + 6)} className="px-8 py-3 border-2 rounded-lg font-semibold" style={{ borderColor: CONFIG.primaryColor, color: CONFIG.primaryColor }}>
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

function CampaignPage({ campaign, donations, navigate }) {
  const pct = (campaign.collected / campaign.target) * 100;
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button onClick={() => navigate('home', campaign.category)} className="mb-6" style={{ color: CONFIG.primaryColor }}>← Kembali</button>
      
      <div className="bg-gray-200 rounded-xl h-96 mb-8 flex items-center justify-center">
        <p className="text-gray-500">[Foto Campaign]</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-semibold" style={{ color: CONFIG.primaryColor }}>Rp {campaign.collected.toLocaleString()}</span>
            <span className="text-gray-600">dari Rp {campaign.target.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="h-3 rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: `linear-gradient(90deg, ${CONFIG.primaryColor}, ${CONFIG.primaryDark})` }}></div>
          </div>
          <p className="mt-2 text-sm">{pct.toFixed(0)}% • {campaign.donors} donatur</p>
        </div>

        <button onClick={() => navigate('donation', null, campaign)} className="w-full text-white py-4 rounded-lg font-semibold mb-6" style={{ background: `linear-gradient(135deg, ${CONFIG.primaryColor}, ${CONFIG.primaryDark})` }}>
          Donasi Sekarang
        </button>

        <div>
          <h2 className="text-xl font-bold mb-4">Cerita</h2>
          <p className="text-gray-700 whitespace-pre-line">{campaign.story}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold mb-6">Donasi Terbaru</h2>
        {donations.filter(d => d.status === 'verified').length === 0 ? (
          <p className="text-center py-4 text-gray-500">Belum ada donasi</p>
        ) : (
          donations.filter(d => d.status === 'verified').slice(0, 10).map(d => (
            <div key={d.id} className="flex justify-between py-3 border-b">
              <div>
                <p className="font-semibold">{d.name}</p>
                <p className="text-sm text-gray-600">{new Date(d.createdAt).toLocaleString('id-ID')}</p>
              </div>
              <p className="font-bold" style={{ color: CONFIG.primaryColor }}>Rp {d.amount.toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DonationPage({ campaign, navigate, setDonations }) {
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', amount: '', coverFee: false, anonymous: false });
  const [done, setDone] = useState(false);
  const [id, setId] = useState('');

  const fee = form.amount ? parseInt(form.amount) * CONFIG.platformFee : 0;
  const total = form.amount ? parseInt(form.amount) + (form.coverFee ? fee : 0) : 0;
  const unique = total ? total + Math.floor(Math.random() * 900) + 100 : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `DON-${Date.now()}`;
    setDonations(prev => [...prev, {
      id: newId,
      campaignId: campaign.id,
      name: form.anonymous ? 'Hamba Allah' : form.name,
      email: form.email,
      whatsapp: form.whatsapp,
      amount: parseInt(form.amount),
      status: 'pending',
      createdAt: new Date().toISOString()
    }]);
    setId(newId);
    setDone(true);
  };

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle size={64} className="mx-auto mb-4" style={{ color: CONFIG.primaryColor }} />
          <h1 className="text-2xl font-bold mb-2">Barakallahu Fiik!</h1>
          <p className="mb-6 text-gray-600">ID Donasi: {id}</p>
          
          <div className="p-6 rounded-lg mb-6 border-2" style={{ backgroundColor: `${CONFIG.primaryColor}10`, borderColor: CONFIG.primaryColor }}>
            <p className="font-semibold mb-2">Silakan Transfer ke:</p>
            <p className="text-lg">{CONFIG.bankName}</p>
            <p className="text-2xl font-bold my-2" style={{ color: CONFIG.primaryColor }}>{CONFIG.accountNumber}</p>
            <p className="mb-4">a.n. {CONFIG.accountHolder}</p>
            <div className="border-t pt-4 mt-4">
              <p className="font-semibold mb-2">Nominal Transfer:</p>
              <p className="text-3xl font-bold" style={{ color: CONFIG.primaryColor }}>Rp {unique.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-2">*Nominal unik untuk verifikasi otomatis</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6 text-left">
            <p className="text-sm text-yellow-800">
              <strong>Catatan:</strong> Setelah transfer, donasi Anda akan diverifikasi oleh admin. Konfirmasi akan dikirim via WhatsApp.
            </p>
          </div>

          <button onClick={() => navigate('home')} className="w-full border-2 py-3 rounded-lg font-semibold" style={{ borderColor: CONFIG.primaryColor, color: CONFIG.primaryColor }}>
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <button onClick={() => navigate('campaign', null, campaign)} className="mb-6" style={{ color: CONFIG.primaryColor }}>← Kembali</button>
      
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2">Form Donasi</h1>
        <p className="text-gray-600 mb-6">Campaign: {campaign.title}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Nama Lengkap *</label>
            <input 
              required 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
              className="w-full border rounded px-4 py-3"
              placeholder="Ahmad Fauzi"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Email *</label>
            <input 
              type="email" 
              required 
              value={form.email} 
              onChange={e => setForm({ ...form, email: e.target.value })} 
              className="w-full border rounded px-4 py-3"
              placeholder="email@example.com"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">WhatsApp *</label>
            <input 
              required 
              value={form.whatsapp} 
              onChange={e => setForm({ ...form, whatsapp: e.target.value })} 
              className="w-full border rounded px-4 py-3"
              placeholder="08123456789"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">Nominal Donasi (Rp) *</label>
            <input 
              type="number" 
              required 
              value={form.amount} 
              onChange={e => setForm({ ...form, amount: e.target.value })} 
              className="w-full border rounded px-4 py-3" 
              min="10000"
              placeholder="100000"
            />
          </div>
          
          {form.amount && (
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between mb-2">
                <span>Donasi</span>
                <span className="font-semibold">Rp {parseInt(form.amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Biaya Platform (10%)</span>
                <span>{form.coverFee ? `Rp ${fee.toLocaleString()}` : <span className="text-red-600">Dipotong dari donasi</span>}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total Transfer</span>
                <span style={{ color: CONFIG.primaryColor }}>Rp {total.toLocaleString()}</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={form.coverFee} 
              onChange={e => setForm({ ...form, coverFee: e.target.checked })} 
              className="w-5 h-5"
              id="coverFee"
            />
            <label htmlFor="coverFee" className="text-sm cursor-pointer">
              Saya bersedia menanggung biaya platform (10%) agar donasi 100% tersalurkan
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={form.anonymous} 
              onChange={e => setForm({ ...form, anonymous: e.target.checked })} 
              className="w-5 h-5"
              id="anonymous"
            />
            <label htmlFor="anonymous" className="text-sm cursor-pointer">
              Tampilkan nama saya sebagai "Hamba Allah"
            </label>
          </div>
          
          <button 
            type="submit" 
            className="w-full text-white py-4 rounded-lg font-semibold" 
            style={{ background: `linear-gradient(135deg, ${CONFIG.primaryColor}, ${CONFIG.primaryDark})` }}
          >
            Lanjut ke Pembayaran
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminLogin({ navigate, setIsAdmin }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pw === CONFIG.adminPassword) {
      setIsAdmin(true);
      navigate('admin');
    } else {
      setErr('Password salah!');
      setTimeout(() => setErr(''), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: `linear-gradient(135deg, ${CONFIG.primaryColor}10, ${CONFIG.primaryDark}10)` }}>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: CONFIG.primaryColor }}>
            <Heart className="text-white" size={32} fill="white" />
          </div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-gray-600 text-sm">Masukkan password untuk melanjutkan</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Password</label>
            <div className="relative">
              <input 
                type={show ? "text" : "password"} 
                value={pw} 
                onChange={e => setPw(e.target.value)} 
                className="w-full border rounded px-4 py-3 pr-12" 
                required 
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShow(!show)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {err && <p className="text-red-500 text-sm mt-2">⚠️ {err}</p>}
          </div>
          
          <button 
            type="submit" 
            className="w-full text-white py-3 rounded font-semibold" 
            style={{ background: `linear-gradient(135deg, ${CONFIG.primaryColor}, ${CONFIG.primaryDark})` }}
          >
            Login
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate('home')} 
            className="w-full border-2 py-3 rounded font-semibold"
            style={{ borderColor: CONFIG.primaryColor, color: CONFIG.primaryColor }}
          >
            Kembali
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminSettings() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [settings, setSettings] = useState({
    logo_url: '/uploads/logos/default-logo.png',
    banner_url: '/uploads/banners/default-banner.jpg',
    platform_name: CONFIG.platformName,
    bank_name: CONFIG.bankName,
    account_number: CONFIG.accountNumber,
    account_holder: CONFIG.accountHolder,
    whatsapp: CONFIG.whatsapp,
    email: CONFIG.email,
    instagram: CONFIG.instagram
  });

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: '❌ File terlalu besar! Maksimal 5MB' });
      return;
    }

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage({ type: 'error', text: '❌ Format file tidak valid! Gunakan JPG, PNG, atau WebP' });
      return;
    }

    setUploading(true);
    setMessage({ type: 'info', text: '⏳ Mengupload logo...' });

    try {
      const formData = new FormData();
      formData.append('logo', file);
      
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_URL}/upload/logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setSettings(prev => ({ ...prev, logo_url: result.data.url }));
        setMessage({ type: 'success', text: '✅ Logo berhasil diupload!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: `❌ ${result.message}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setUploading(false);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: '❌ File terlalu besar! Maksimal 5MB' });
      return;
    }

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage({ type: 'error', text: '❌ Format file tidak valid! Gunakan JPG, PNG, atau WebP' });
      return;
    }

    setUploading(true);
    setMessage({ type: 'info', text: '⏳ Mengupload banner...' });

    try {
      const formData = new FormData();
      formData.append('banner', file);
      
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_URL}/upload/banner`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setSettings(prev => ({ ...prev, banner_url: result.data.url }));
        setMessage({ type: 'success', text: '✅ Banner berhasil diupload!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: `❌ ${result.message}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setMessage({ type: 'info', text: '⏳ Menyimpan pengaturan...' });

    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      // Update each setting
      for (const [key, value] of Object.entries(settings)) {
        if (key !== 'logo_url' && key !== 'banner_url') { // Skip file uploads
          await fetch(`${API_URL}/settings/${key}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value })
          });
        }
      }

      setMessage({ type: 'success', text: '✅ Pengaturan berhasil disimpan!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">⚙️ Pengaturan Platform</h2>

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
          message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
          'bg-blue-50 border border-blue-200 text-blue-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Logo & Banner Upload */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Logo Upload */}
        <div className="border-2 rounded-lg p-6" style={{ borderColor: `${CONFIG.primaryColor}40` }}>
          <h3 className="font-bold text-lg mb-4">🖼️ Logo Yayasan</h3>
          
          {/* Preview */}
          <div className="mb-4 bg-gray-100 rounded-lg p-4 flex items-center justify-center" style={{ minHeight: '150px' }}>
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo Preview" className="max-h-32 max-w-full object-contain" />
            ) : (
              <p className="text-gray-500 text-sm">Preview logo akan muncul di sini</p>
            )}
          </div>

          {/* Upload Button */}
          <label className="block">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleLogoUpload}
              disabled={uploading}
              className="hidden"
            />
            <div 
              className={`text-center py-3 px-4 rounded-lg font-semibold cursor-pointer transition ${
                uploading ? 'bg-gray-300 cursor-not-allowed' : 'text-white hover:opacity-90'
              }`}
              style={{ background: uploading ? undefined : `linear-gradient(135deg, ${CONFIG.primaryColor}, ${CONFIG.primaryDark})` }}
            >
              {uploading ? '⏳ Uploading...' : '📁 Upload Logo Baru'}
            </div>
          </label>

          <p className="text-xs text-gray-600 mt-2">
            Format: JPG, PNG, WebP | Max: 5MB<br />
            Rekomendasi: Logo persegi 500x500px
          </p>
        </div>

        {/* Banner Upload */}
        <div className="border-2 rounded-lg p-6" style={{ borderColor: `${CONFIG.primaryColor}40` }}>
          <h3 className="font-bold text-lg mb-4">🎨 Banner Yayasan</h3>
          
          {/* Preview */}
          <div className="mb-4 bg-gray-100 rounded-lg p-4 flex items-center justify-center" style={{ minHeight: '150px' }}>
            {settings.banner_url ? (
              <img src={settings.banner_url} alt="Banner Preview" className="max-h-32 max-w-full object-contain" />
            ) : (
              <p className="text-gray-500 text-sm">Preview banner akan muncul di sini</p>
            )}
          </div>

          {/* Upload Button */}
          <label className="block">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleBannerUpload}
              disabled={uploading}
              className="hidden"
            />
            <div 
              className={`text-center py-3 px-4 rounded-lg font-semibold cursor-pointer transition ${
                uploading ? 'bg-gray-300 cursor-not-allowed' : 'text-white hover:opacity-90'
              }`}
              style={{ background: uploading ? undefined : `linear-gradient(135deg, ${CONFIG.primaryColor}, ${CONFIG.primaryDark})` }}
            >
              {uploading ? '⏳ Uploading...' : '📁 Upload Banner Baru'}
            </div>
          </label>

          <p className="text-xs text-gray-600 mt-2">
            Format: JPG, PNG, WebP | Max: 5MB<br />
            Rekomendasi: Banner landscape 1920x600px
          </p>
        </div>
      </div>

      {/* Platform Settings Form */}
      <form onSubmit={handleSaveSettings} className="border-2 rounded-lg p-6" style={{ borderColor: `${CONFIG.primaryColor}40` }}>
        <h3 className="font-bold text-lg mb-4">📝 Informasi Platform</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2">Nama Platform</label>
            <input
              type="text"
              value={settings.platform_name}
              onChange={(e) => setSettings(prev => ({ ...prev, platform_name: e.target.value }))}
              className="w-full border-2 rounded-lg px-4 py-3"
              placeholder="Kebaikan Kita"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
              className="w-full border-2 rounded-lg px-4 py-3"
              placeholder="info@kebaikan-kita.org"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">WhatsApp</label>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) => setSettings(prev => ({ ...prev, whatsapp: e.target.value }))}
              className="w-full border-2 rounded-lg px-4 py-3"
              placeholder="08123456789"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Instagram</label>
            <input
              type="text"
              value={settings.instagram}
              onChange={(e) => setSettings(prev => ({ ...prev, instagram: e.target.value }))}
              className="w-full border-2 rounded-lg px-4 py-3"
              placeholder="@kebaikan.kita"
            />
          </div>
        </div>

        <h3 className="font-bold text-lg mb-4 mt-8">🏦 Informasi Rekening</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2">Nama Bank</label>
            <input
              type="text"
              value={settings.bank_name}
              onChange={(e) => setSettings(prev => ({ ...prev, bank_name: e.target.value }))}
              className="w-full border-2 rounded-lg px-4 py-3"
              placeholder="Bank Central Asia (BCA)"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Nomor Rekening</label>
            <input
              type="text"
              value={settings.account_number}
              onChange={(e) => setSettings(prev => ({ ...prev, account_number: e.target.value }))}
              className="w-full border-2 rounded-lg px-4 py-3"
              placeholder="1234567890"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-2">Atas Nama</label>
            <input
              type="text"
              value={settings.account_holder}
              onChange={(e) => setSettings(prev => ({ ...prev, account_holder: e.target.value }))}
              className="w-full border-2 rounded-lg px-4 py-3"
              placeholder="YAYASAN KEBAIKAN KITA"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-4 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${CONFIG.primaryColor}, ${CONFIG.primaryDark})` }}
          >
            <Save size={20} /> Simpan Semua Pengaturan
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Tips:</strong> Setelah mengubah logo atau banner, refresh halaman untuk melihat perubahan.
          Perubahan akan langsung terlihat di halaman publik website.
        </p>
      </div>
    </div>
  );
}

function AdminPanel({ campaigns, setCampaigns, donations, setDonations, navigate, setIsAdmin }) {
  const [tab, setTab] = useState('donations');
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const approve = (id) => {
    const don = donations.find(d => d.id === id);
    if (don) {
      setDonations(prev => prev.map(d => d.id === id ? { ...d, status: 'verified' } : d));
      setCampaigns(prev => prev.map(c => c.id === don.campaignId ? { ...c, collected: c.collected + don.amount, donors: c.donors + 1 } : c));
      alert('✅ Donasi berhasil diverifikasi!');
    }
  };

  const reject = (id) => {
    if (confirm('Reject donasi ini? Donatur akan diberitahu via WhatsApp.')) {
      setDonations(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected' } : d));
      alert('❌ Donasi ditolak');
    }
  };

  const deleteCampaign = (id) => {
    if (confirm('⚠️ Hapus campaign ini?\n\nData tidak bisa dikembalikan!\nDonasi yang sudah masuk tetap tersimpan.')) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
      alert('🗑️ Campaign berhasil dihapus');
    }
  };

  const toggleCampaignStatus = (id) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c));
  };

  const saveCampaign = (campaign) => {
    if (campaign.id) {
      // Edit existing
      setCampaigns(prev => prev.map(c => c.id === campaign.id ? campaign : c));
      alert('✅ Campaign berhasil diupdate!');
    } else {
      // Add new
      const newCampaign = { 
        ...campaign, 
        id: `CAMP-${Date.now()}`, 
        collected: 0, 
        donors: 0,
        status: campaign.status || 'active'
      };
      setCampaigns(prev => [...prev, newCampaign]);
      alert('✅ Campaign baru berhasil ditambahkan!');
    }
    setEditingCampaign(null);
    setShowAddForm(false);
  };

  const pendingDonations = donations.filter(d => d.status === 'pending');
  const verifiedDonations = donations.filter(d => d.status === 'verified');
  const totalCollected = verifiedDonations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Kelola campaign dan verifikasi donasi</p>
        </div>
        <button 
          onClick={() => { 
            if (confirm('Logout dari admin panel?')) {
              setIsAdmin(false); 
              navigate('home'); 
            }
          }} 
          className="flex items-center gap-2 px-4 py-2 border-2 rounded hover:bg-gray-50"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-1">Total Campaign</p>
          <p className="text-3xl font-bold" style={{ color: CONFIG.primaryColor }}>{campaigns.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-1">Campaign Active</p>
          <p className="text-3xl font-bold text-green-600">{campaigns.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-1">Pending Donasi</p>
          <p className="text-3xl font-bold text-orange-600">{pendingDonations.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-1">Total Terkumpul</p>
          <p className="text-2xl font-bold text-blue-600">Rp {(totalCollected / 1000000).toFixed(1)}Jt</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b flex overflow-x-auto">
          <button 
            onClick={() => setTab('donations')} 
            className={`px-6 py-4 font-semibold whitespace-nowrap ${tab === 'donations' ? 'border-b-2' : ''}`} 
            style={{ borderColor: tab === 'donations' ? CONFIG.primaryColor : 'transparent', color: tab === 'donations' ? CONFIG.primaryColor : 'inherit' }}
          >
            💵 Donasi ({pendingDonations.length} Pending)
          </button>
          <button 
            onClick={() => setTab('campaigns')} 
            className={`px-6 py-4 font-semibold whitespace-nowrap ${tab === 'campaigns' ? 'border-b-2' : ''}`} 
            style={{ borderColor: tab === 'campaigns' ? CONFIG.primaryColor : 'transparent', color: tab === 'campaigns' ? CONFIG.primaryColor : 'inherit' }}
          >
            📝 Campaign ({campaigns.length})
          </button>
          <button 
            onClick={() => setTab('settings')} 
            className={`px-6 py-4 font-semibold whitespace-nowrap ${tab === 'settings' ? 'border-b-2' : ''}`} 
            style={{ borderColor: tab === 'settings' ? CONFIG.primaryColor : 'transparent', color: tab === 'settings' ? CONFIG.primaryColor : 'inherit' }}
          >
            ⚙️ Settings
          </button>
        </div>

        <div className="p-6">
          {tab === 'donations' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Verifikasi Donasi Pending</h2>
              
              {pendingDonations.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle size={64} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg">Tidak ada donasi pending</p>
                  <p className="text-gray-400 text-sm">Semua donasi sudah diverifikasi ✓</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingDonations.map(d => {
                    const camp = campaigns.find(c => c.id === d.campaignId);
                    return (
                      <div key={d.id} className="border-2 rounded-lg p-5" style={{ borderColor: `${CONFIG.primaryColor}40` }}>
                        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">PENDING</span>
                              <p className="font-mono text-sm text-gray-600">{d.id}</p>
                            </div>
                            <p className="font-bold text-lg mb-1">{d.name}</p>
                            <p className="text-sm text-gray-600 mb-1">📧 {d.email}</p>
                            <p className="text-sm text-gray-600 mb-1">📱 {d.whatsapp}</p>
                            <p className="text-sm font-semibold mb-1" style={{ color: CONFIG.primaryColor }}>Campaign: {camp?.title}</p>
                            <p className="text-xs text-gray-500">⏰ {new Date(d.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 mb-1">Nominal</p>
                            <p className="font-bold text-3xl" style={{ color: CONFIG.primaryColor }}>
                              Rp {d.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => approve(d.id)} 
                            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2"
                          >
                            <CheckCircle size={20} /> Approve & Verifikasi
                          </button>
                          <button 
                            onClick={() => reject(d.id)} 
                            className="px-8 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold flex items-center justify-center gap-2"
                          >
                            <XCircle size={20} /> Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === 'campaigns' && (
            <div>
              <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold">Kelola Campaign</h2>
                  <p className="text-sm text-gray-600">Tambah, edit, atau hapus campaign donasi</p>
                </div>
                <button 
                  onClick={() => {
                    setShowAddForm(true);
                    setEditingCampaign(null);
                  }} 
                  className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
                  style={{ background: `linear-gradient(135deg, ${CONFIG.primaryColor}, ${CONFIG.primaryDark})` }}
                >
                  <Plus size={20} /> Tambah Campaign
                </button>
              </div>

              {showAddForm && (
                <CampaignForm 
                  campaign={null} 
                  onSave={saveCampaign} 
                  onCancel={() => setShowAddForm(false)} 
                />
              )}

              <div className="space-y-4 mt-6">
                {campaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Belum ada campaign</p>
                    <p className="text-sm text-gray-400">Klik "Tambah Campaign" untuk membuat campaign baru</p>
                  </div>
                ) : (
                  campaigns.map(c => (
                    <div key={c.id}>
                      {editingCampaign?.id === c.id ? (
                        <CampaignForm 
                          campaign={editingCampaign} 
                          onSave={saveCampaign} 
                          onCancel={() => setEditingCampaign(null)} 
                        />
                      ) : (
                        <div className="border-2 rounded-lg p-5" style={{ borderColor: c.status === 'active' ? `${CONFIG.primaryColor}40` : '#e5e7eb' }}>
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <h3 className="font-bold text-xl">{c.title}</h3>
                                <span 
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {c.status === 'active' ? '🟢 ACTIVE' : '⚫ INACTIVE'}
                                </span>
                                {c.urgent && (
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                    🔥 URGENT
                                  </span>
                                )}
                                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${CONFIG.primaryColor}20`, color: CONFIG.primaryDark }}>
                                  {c.category.toUpperCase()}
                                </span>
                              </div>
                              
                              <div className="mb-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="font-semibold">Progress:</span>
                                  <span>{((c.collected / c.target) * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full" 
                                    style={{ 
                                      width: `${Math.min((c.collected / c.target) * 100, 100)}%`, 
                                      background: `linear-gradient(90deg, ${CONFIG.primaryColor}, ${CONFIG.primaryDark})` 
                                    }}
                                  ></div>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-sm font-semibold" style={{ color: CONFIG.primaryColor }}>
                                    Rp {(c.collected / 1000000).toFixed(1)} Jt
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    Target: Rp {(c.target / 1000000).toFixed(1)} Jt
                                  </span>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2">👥 {c.donors} donatur</p>
                              <p className="text-sm text-gray-700 line-clamp-2">{c.story}</p>
                            </div>
                            
                            <div className="flex md:flex-col gap-2">
                              <button 
                                onClick={() => {
                                  setEditingCampaign(c);
                                  setShowAddForm(false);
                                }} 
                                className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg hover:bg-gray-50 font-semibold"
                                style={{ borderColor: CONFIG.primaryColor, color: CONFIG.primaryColor }}
                                title="Edit Campaign"
                              >
                                <Edit2 size={18} /> Edit
                              </button>
                              
                              <button 
                                onClick={() => toggleCampaignStatus(c.id)} 
                                className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg font-semibold ${
                                  c.status === 'active' ? 'border-orange-300 text-orange-600 hover:bg-orange-50' : 'border-green-300 text-green-600 hover:bg-green-50'
                                }`}
                                title={c.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                              >
                                {c.status === 'active' ? '⏸️ Hide' : '▶️ Show'}
                              </button>
                              
                              <button 
                                onClick={() => deleteCampaign(c.id)} 
                                className="flex items-center gap-2 px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-semibold"
                                title="Hapus Campaign"
                              >
                                <Trash2 size={18} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <AdminSettings />
          )}
        </div>
      </div>
    </div>
  );
}

function CampaignForm({ campaign, onSave, onCancel }) {
  const [form, setForm] = useState(campaign || {
    title: '',
    category: 'infaq',
    target: '',
    story: '',
    status: 'active',
    urgent: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...campaign,
      ...form,
      target: parseInt(form.target),
      collected: campaign?.collected || 0,
      donors: campaign?.donors || 0
    });
  };

  return (
    <div className="border-2 rounded-lg p-6 mb-6" style={{ borderColor: CONFIG.primaryColor, backgroundColor: `${CONFIG.primaryColor}05` }}>
      <h3 className="text-xl font-bold mb-4">{campaign ? '✏️ Edit Campaign' : '➕ Tambah Campaign Baru'}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-semibold mb-2">Judul Campaign *</label>
          <input 
            required 
            value={form.title} 
            onChange={e => setForm({ ...form, title: e.target.value })} 
            className="w-full border-2 rounded-lg px-4 py-3"
            placeholder="contoh: Bantu Biaya Operasi Ibu Siti"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">{form.title.length}/100 karakter</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2">Kategori *</label>
            <select 
              required 
              value={form.category} 
              onChange={e => setForm({ ...form, category: e.target.value })} 
              className="w-full border-2 rounded-lg px-4 py-3"
            >
              <option value="zakat">💎 Zakat</option>
              <option value="wakaf">🕌 Wakaf</option>
              <option value="infaq">🤲 Infaq</option>
              <option value="qurban">🐄 Qurban</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Target Dana (Rp) *</label>
            <input 
              type="number" 
              required 
              value={form.target} 
              onChange={e => setForm({ ...form, target: e.target.value })} 
              className="w-full border-2 rounded-lg px-4 py-3"
              placeholder="25000000"
              min="100000"
              step="100000"
            />
            {form.target && (
              <p className="text-xs text-gray-600 mt-1">
                = Rp {(parseInt(form.target) / 1000000).toFixed(1)} Juta
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-2">Cerita/Deskripsi Campaign *</label>
          <textarea 
            required 
            value={form.story} 
            onChange={e => setForm({ ...form, story: e.target.value })} 
            className="w-full border-2 rounded-lg px-4 py-3 h-40"
            placeholder="Ceritakan detail campaign ini untuk menarik minat donatur...&#10;&#10;Tips:&#10;- Jelaskan situasi dengan detail&#10;- Sertakan informasi yang relevan&#10;- Tulis dengan jelas dan menyentuh hati"
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">{form.story.length}/1000 karakter</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2">Status Campaign</label>
            <select 
              value={form.status} 
              onChange={e => setForm({ ...form, status: e.target.value })} 
              className="w-full border-2 rounded-lg px-4 py-3"
            >
              <option value="active">🟢 Active (Tampil di website)</option>
              <option value="inactive">⚫ Inactive (Tersembunyi)</option>
            </select>
            <p className="text-xs text-gray-600 mt-1">Campaign inactive tidak akan muncul di halaman publik</p>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg hover:bg-gray-50 w-full">
              <input 
                type="checkbox" 
                checked={form.urgent} 
                onChange={e => setForm({ ...form, urgent: e.target.checked })} 
                className="w-6 h-6"
              />
              <div>
                <span className="font-semibold block">🔥 Tandai sebagai MENDESAK</span>
                <span className="text-xs text-gray-600">Campaign akan ditampilkan di slider urgent</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t-2">
          <button 
            type="submit" 
            className="flex-1 flex items-center justify-center gap-2 text-white py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
            style={{ background: `linear-gradient(135deg, ${CONFIG.primaryColor}, ${CONFIG.primaryDark})` }}
          >
            <Save size={22} /> {campaign ? 'Update Campaign' : 'Simpan Campaign Baru'}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-8 flex items-center gap-2 border-2 py-4 rounded-lg font-semibold hover:bg-gray-50"
          >
            <XCircle size={22} /> Batal
          </button>
        </div>
      </form>
    </div>
  );
}

function Calculator({ navigate }) {
  const [amount, setAmount] = useState('');
  const nisab = 85000000;
  const zakat = amount >= nisab ? amount * 0.025 : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button onClick={() => navigate('home')} className="mb-6 flex items-center gap-2" style={{ color: CONFIG.primaryColor }}>
        ← Kembali
      </button>
      
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Kalkulator Zakat Maal</h1>
        <p className="text-gray-600 mb-8">Hitung zakat harta (maal) yang wajib Anda tunaikan</p>
        
        <div className="mb-6">
          <label className="block font-semibold mb-2">Jumlah Harta (Rp)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            className="w-full border-2 rounded-lg px-4 py-4 text-lg" 
            placeholder="100000000"
            min="0"
          />
          {amount && (
            <p className="text-sm text-gray-600 mt-2">
              = Rp {(parseInt(amount) / 1000000).toFixed(1)} Juta
            </p>
          )}
        </div>
        
        {amount && (
          <div className="p-6 rounded-lg border-2" style={{ backgroundColor: `${CONFIG.primaryColor}10`, borderColor: CONFIG.primaryColor }}>
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-1">Nisab Zakat (setara 85 gram emas):</p>
              <p className="font-semibold text-lg">Rp {nisab.toLocaleString()}</p>
            </div>
            
            {amount >= nisab ? (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-1">Zakat yang harus dibayar (2.5%):</p>
                  <p className="text-4xl font-bold mb-2" style={{ color: CONFIG.primaryColor }}>
                    Rp {zakat.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    = Rp {(zakat / 1000000).toFixed(2)} Juta
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-semibold flex items-center gap-2">
                    <CheckCircle size={20} /> Harta Anda mencapai nisab
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Anda wajib menunaikan zakat sebesar Rp {zakat.toLocaleString()}
                  </p>
                </div>
                
                <button 
                  onClick={() => navigate('home', 'zakat')} 
                  className="w-full text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2" 
                  style={{ background: `linear-gradient(135deg, ${CONFIG.primaryColor}, ${CONFIG.primaryDark})` }}
                >
                  <ArrowRight size={20} /> Bayar Zakat Sekarang
                </button>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 font-semibold">⚠️ Harta belum mencapai nisab</p>
                <p className="text-sm text-amber-700 mt-1">
                  Anda belum wajib zakat, namun tetap dianjurkan untuk berinfaq
                </p>
                <button 
                  onClick={() => navigate('home', 'infaq')} 
                  className="w-full mt-4 border-2 py-3 rounded-lg font-semibold"
                  style={{ borderColor: CONFIG.primaryColor, color: CONFIG.primaryColor }}
                >
                  Infaq Sekarang
                </button>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-bold mb-3">ℹ️ Catatan Penting:</h3>
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
            <li>Nisab zakat = 85 gram emas (sekitar Rp {nisab.toLocaleString()})</li>
            <li>Zakat ditunaikan sebesar 2.5% dari total harta</li>
            <li>Harta harus mencapai nisab dan telah dimiliki selama 1 tahun (haul)</li>
            <li>Harta yang dizakati: uang, emas, perak, aset investasi, dll</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function About({ navigate }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Tentang {CONFIG.platformName}</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <p className="text-center mb-6 text-2xl" style={{ color: CONFIG.primaryColor }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
        <p className="text-gray-700 mb-4 text-lg leading-relaxed">
          {CONFIG.platformName} adalah platform donasi Islami yang memudahkan umat untuk menyalurkan zakat, wakaf, infaq, dan qurban dengan amanah dan transparan.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Kami berkomitmen untuk mengelola setiap donasi dengan penuh tanggung jawab dan menyalurkannya kepada yang berhak menerima.
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Hubungi Kami</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${CONFIG.primaryColor}20` }}>
              <span className="text-xl">📱</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">WhatsApp</p>
              <p className="font-semibold">{CONFIG.whatsapp}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${CONFIG.primaryColor}20` }}>
              <span className="text-xl">📧</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{CONFIG.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${CONFIG.primaryColor}20` }}>
              <span className="text-xl">📷</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Instagram</p>
              <p className="font-semibold">{CONFIG.instagram}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Rekening Donasi</h2>
        <div className="border-2 rounded-lg p-6" style={{ borderColor: CONFIG.primaryColor }}>
          <p className="text-sm text-gray-600 mb-2">Bank</p>
          <p className="font-bold text-xl mb-4">{CONFIG.bankName}</p>
          <p className="text-sm text-gray-600 mb-2">Nomor Rekening</p>
          <p className="font-bold text-2xl mb-4" style={{ color: CONFIG.primaryColor }}>{CONFIG.accountNumber}</p>
          <p className="text-sm text-gray-600 mb-2">Atas Nama</p>
          <p className="font-semibold text-lg">{CONFIG.accountHolder}</p>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="text-white mt-20" style={{ background: `linear-gradient(to bottom, ${CONFIG.primaryDark}, #2d3e15)` }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart size={20} fill="white" />
              <span className="font-bold">{CONFIG.platformName}</span>
            </div>
            <p className="text-green-200 text-sm">Platform Donasi Islami Terpercaya</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Kategori</h3>
            <div className="space-y-2 text-sm text-green-200">
              <p>💎 Zakat</p>
              <p>🕌 Wakaf</p>
              <p>🤲 Infaq</p>
              <p>🐄 Qurban</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Kontak</h3>
            <div className="space-y-2 text-sm text-green-200">
              <p>📱 {CONFIG.whatsapp}</p>
              <p>📧 {CONFIG.email}</p>
              <p>📷 {CONFIG.instagram}</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Rekening</h3>
            <div className="text-sm text-green-200">
              <p>{CONFIG.bankName}</p>
              <p className="font-mono">{CONFIG.accountNumber}</p>
              <p className="text-xs mt-2">a.n. {CONFIG.accountHolder}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-300 text-sm">
          <p>© 2025 {CONFIG.platformName}. Barakallahu fiikum.</p>
        </div>
      </div>
    </footer>
  );
}

function CampaignCard({ campaign, onClick }) {
  const pct = (campaign.collected / campaign.target) * 100;
  
  return (
    <div onClick={onClick} className="bg-white rounded-xl shadow overflow-hidden cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1">
      <div className="bg-gray-200 h-48 flex items-center justify-center relative">
        <p className="text-gray-500 text-sm">[Foto Campaign]</p>
        {campaign.urgent && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            🔥 MENDESAK
          </div>
        )}
      </div>
      <div className="p-5">
        <span className="px-3 py-1 rounded-full text-xs font-semibold inline-block mb-3" style={{ backgroundColor: `${CONFIG.primaryColor}20`, color: CONFIG.primaryColor }}>
          {campaign.category.toUpperCase()}
        </span>
        <h3 className="font-bold text-lg mb-3 line-clamp-2 h-14">{campaign.title}</h3>
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div className="h-2 rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: `linear-gradient(90deg, ${CONFIG.primaryColor}, ${CONFIG.primaryDark})` }}></div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-bold" style={{ color: CONFIG.primaryColor }}>
              Rp {(campaign.collected / 1000000).toFixed(1)} Jt
            </span>
            <span className="text-gray-600">{pct.toFixed(0)}%</span>
          </div>
        </div>
        <p className="text-sm text-gray-600">👥 {campaign.donors} donatur</p>
      </div>
    </div>
  );
}
