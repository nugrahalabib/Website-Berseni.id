# 🎨 BERSENI.ID — Dokumen Handoff Lengkap untuk Claude Code

> Dokumen ini berisi SELURUH konteks proyek Website Berseni.id agar AI assistant di sesi lain dapat langsung melanjutkan pekerjaan tanpa kehilangan konteks.

---

## 1. GAMBARAN UMUM PROYEK

### Apa Itu Berseni.id?
**Berseni.id** adalah **platform edukasi seni rupa Indonesia** yang menjembatani masyarakat umum dengan seniman profesional. Website ini berfungsi sebagai:
- **Showcase & branding** — menampilkan profil, visi misi, dan aktivitas komunitas seni
- **E-commerce** — menjual lukisan orisinal bersertifikat COA
- **Education** — menawarkan kelas melukis online (e-course) dan workshop offline
- **Content hub** — blog artikel tentang seni lukis
- **Collaboration portal** — halaman ajakan kerjasama dengan brand & venue

### Model Bisnis
Berseni.id menghasilkan pendapatan melalui:
1. **Penjualan Lukisan Orisinal** — lukisan cat akrilik/minyak bersertifikat COA, dijual via Lynk.id
2. **Workshop Offline** — workshop melukis cat akrilik di berbagai lokasi (hotel, kafe) di Jakarta, harga Rp400.000-500.000/orang
3. **Kelas Online (E-Course)** — kelas melukis cat minyak online via Lynk.id, harga Rp199.000, akses seumur hidup
4. **Kolaborasi Brand & Venue** — kerjasama dengan brand/perusahaan dan venue untuk event seni

### Bahasa
Website sepenuhnya **bilingual** (Bahasa Indonesia & English). Semua konten memiliki versi `_id` dan `_en`. Bahasa default: **Indonesia**.

### Pemilik Proyek
- **Owner**: Nugraha Labib (username GitHub: `nugrahalabib`)
- **Repository**: `https://github.com/nugrahalabib/Website-Berseni.id`
- **Path Lokal**: `c:\Users\nugra\Documents\Project\Freelance Project\Website-Berseni`

---

## 2. TECH STACK

| Layer | Teknologi | Versi |
|---|---|---|
| **Framework** | Next.js (App Router) | 16.2.9 |
| **UI Library** | React | 19.2.4 |
| **Styling** | CSS Modules (Vanilla CSS) | - |
| **Database (Production)** | Vercel KV (Upstash Redis) | @vercel/kv 3.0.0 |
| **Database (Local Dev)** | JSON file (`public/db.json`) | - |
| **File Storage** | Vercel Blob | @vercel/blob 2.4.0 |
| **Font** | Google Fonts: Montserrat (sans) + Dancing Script (cursive) | - |
| **Deployment** | Vercel | - |
| **Version Control** | Git + GitHub | - |

### Catatan Penting Tech Stack:
- `@vercel/kv` sudah **deprecated** oleh Vercel, diganti **Upstash Redis** dari Vercel Marketplace. Namun kode `db.js` tetap kompatibel karena menggunakan environment variable yang sama (`KV_REST_API_URL`, `KV_REST_API_TOKEN`).
- **TIDAK menggunakan** TailwindCSS, TypeScript, atau database SQL. Semua styling adalah Vanilla CSS Modules.
- **TIDAK ada package manager selain npm**. Tidak ada yarn atau pnpm.

---

## 3. ARSITEKTUR PROYEK

### Struktur Direktori
```
Website-Berseni/
├── public/
│   ├── db.json                    # Database lokal (hanya untuk dev)
│   ├── logo.png                   # Logo Berseni
│   ├── og-image.jpg               # Open Graph image
│   ├── hero-bg.jpg                # Background hero
│   ├── hero-frame.png             # Frame foto hero
│   ├── hero-corner-*.png          # 4 corner ornaments hero
│   ├── pohon-kiri.png             # Dekorasi pohon kiri hero
│   ├── pohon-kanan.png            # Dekorasi pohon kanan hero
│   ├── burung-burung.webp         # Animasi burung hero
│   ├── video-intro-logo.mp4       # Video intro landing page
│   ├── pantai-sunset.webp         # Background CTA section
│   ├── about-studio.webp          # Foto studio About page
│   ├── activity-*.webp            # Foto-foto aktivitas (5 buah)
│   ├── collage-*.jpg              # Foto collage
│   ├── offline-*.png              # Poster workshop offline (4 buah)
│   ├── support/                   # Logo partner/supporter (8 buah: 1.png-8.png)
│   └── uploads/                   # Upload dari admin (gambar produk/blog)
│
├── src/
│   ├── app/
│   │   ├── layout.js              # Root layout (meta, fonts, JSON-LD, LanguageProvider)
│   │   ├── page.js                # Landing page (server component, fetch data dari DB)
│   │   ├── globals.css            # CSS variables, reset, scrollbar, animations
│   │   ├── page.module.css        # Landing page supplementary styles
│   │   ├── robots.js              # Dynamic robots.txt
│   │   ├── sitemap.js             # Dynamic sitemap.xml
│   │   ├── icon.png               # Favicon
│   │   │
│   │   ├── about/page.js          # About Us page
│   │   ├── store/page.js          # Store/Galeri page
│   │   ├── classes/page.js        # Kelas & Workshop page
│   │   ├── blog/page.js           # Blog listing page
│   │   ├── blog/[slug]/page.js    # Blog detail page (dynamic route)
│   │   ├── collaboration/page.js  # Kolaborasi/Partnership page
│   │   │
│   │   ├── admin/
│   │   │   ├── page.js            # Admin dashboard (server component)
│   │   │   └── login/page.js      # Admin login page
│   │   │
│   │   └── api/
│   │       ├── auth/route.js      # Login/logout/change password API
│   │       ├── content/route.js   # CRUD konten (GET/POST)
│   │       ├── products/route.js  # CRUD produk (GET/POST/DELETE)
│   │       ├── posts/route.js     # CRUD blog posts (GET/POST/DELETE)
│   │       ├── seo/route.js       # CRUD SEO/GEO settings
│   │       ├── upload/route.js    # File upload (Vercel Blob)
│   │       └── backup/route.js    # Backup/restore database
│   │
│   ├── components/
│   │   ├── LandingPageClient.js   # Komponen utama landing page (54KB, terbesar)
│   │   ├── AboutPageClient.js     # Komponen halaman About Us
│   │   ├── StorePageClient.js     # Komponen halaman Store
│   │   ├── ClassesPageClient.js   # Komponen halaman Classes
│   │   ├── BlogPageClient.js      # Komponen halaman Blog listing
│   │   ├── BlogPostPageClient.js  # Komponen halaman Blog detail
│   │   ├── CollaborationPageClient.js  # Komponen halaman Kolaborasi
│   │   ├── Navbar.js              # Navigasi capsule melayang (floating pill navbar)
│   │   ├── Footer.js              # Footer dinamis (dari DB)
│   │   ├── HeroCarousel.js        # Carousel foto di hero section
│   │   ├── ProductCard.js         # Card produk untuk store/landing
│   │   ├── ProductModal.js        # Modal detail produk
│   │   ├── ActivityModal.js       # Modal aktivitas/galeri
│   │   ├── FloatingWhatsApp.js    # Floating WhatsApp button
│   │   ├── MetaPixelTracker.js    # Meta Pixel (Facebook) tracker client component
│   │   ├── LanguageContext.js     # Context provider bahasa (ID/EN) + helper translate
│   │   ├── JsonLd.js              # Komponen untuk inject JSON-LD structured data
│   │   │
│   │   └── Admin/
│   │       ├── DashboardClient.js     # Layout utama admin (tab navigation)
│   │       ├── ContentEditor.js       # Editor konten hero, navbar, dll (tab 1)
│   │       ├── PageContentEditor.js   # Editor konten per-halaman lengkap (tab 2, 101KB)
│   │       ├── ProductEditor.js       # CRUD produk/lukisan/kelas
│   │       ├── BlogEditor.js          # CRUD artikel blog
│   │       ├── SeoEditor.js           # Editor SEO meta tags + GEO per halaman
│   │       └── AccountEditor.js       # Ganti password admin
│   │
│   ├── lib/
│   │   ├── db.js                  # Database abstraction layer (KV + local JSON fallback)
│   │   └── auth.js                # Enkripsi/dekripsi session token (HMAC SHA-256)
│   │
│   └── styles/
│       ├── Landing.module.css     # Styles landing page (40KB, terbesar)
│       ├── About.module.css       # Styles About page
│       ├── Store.module.css       # Styles Store page
│       ├── Blog.module.css        # Styles Blog page
│       ├── Collaboration.module.css  # Styles Collaboration page
│       ├── Components.module.css  # Styles shared components (navbar, footer, dll)
│       └── Admin.module.css       # Styles admin dashboard
│
├── package.json
├── next.config.mjs                # Next.js config (minimal, kosong)
├── jsconfig.json                  # Path alias (@/ -> src/)
├── eslint.config.mjs
├── AGENTS.md                      # Agent rules untuk Next.js
└── .gitignore
```

---

## 4. SISTEM DATABASE

### Arsitektur Hybrid (Local + Production)
File: `src/lib/db.js` (868 baris, 59KB)

```
Local Development:
  db.get('content') -> Baca dari public/db.json
  db.set('content', data) -> Tulis ke public/db.json

Production (Vercel):
  db.get('content') -> Baca dari Vercel KV (Redis): key "berseni:content"
  db.set('content', data) -> Tulis ke Vercel KV (Redis): key "berseni:content"
```

### Deteksi Otomatis
```javascript
const isLocal = !process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN;
```

### Database Keys (Stored in KV)
| Key | Isi | Keterangan |
|---|---|---|
| `berseni:content` | Object | Semua konten website (hero, about, statistik, testimonials, footer, warna, bahasa, tombol, dll) |
| `berseni:products` | Array | Daftar produk (lukisan, workshop, kelas online) |
| `berseni:posts` | Array | Daftar artikel blog |
| `berseni:seo_pages` | Object | Pengaturan SEO/GEO per halaman + global (meta pixel, google verification) |
| `berseni:admin_password` | String | Password admin (bisa diganti dari admin panel) |
| `berseni:admin_session_id` | String | Session ID aktif (single-session enforcement) |

### Auto-Seeding & Migration
`db.js` memiliki fungsi `initLocalDb()` yang:
1. Jika database belum ada -> seed dengan data default lengkap
2. Jika database sudah ada -> jalankan migrasi (menambahkan field baru yang belum ada)
3. Di production (KV): jika key kosong -> ambil data default dari seed -> tulis ke KV

### Konten `content` Object (Field Utama)
- **Hero Section**: `heroTitle_id/en`, `heroSubtitle_id/en`, `heroDescription_id/en`, `heroCardOpacity`, `heroBirdsTop`
- **Navbar**: `navLayout` (floating/standard), `navOpacity`
- **About Page**: `aboutTitle_id/en`, `aboutSubtitle_id/en`, `aboutDescription_id/en`, `visiTitle/Description`, `misiTitle/Description/List`
- **Statistik**: `statsUsers`, `stats2Number`, `stats3Number`, `stats4Number`, `statsDescription_id/en`
- **Footer**: `footerDesc_id/en`, `footerContactDesc_id/en`, `footerLinkWa/Ig/Tiktok/Youtube`
- **Testimonials**: Array of `{ id, name, avatar, rating, comment_id/en, borderColor, videoThumbnail, videoLink }`
- **Partners**: Array of image paths (`/support/1.png`, dll)
- **Tombol/CTA**: `heroBtn1Link/Status`, `heroBtn2Link/Status`, `prog1-3Link/Status`, `galleryBtnLink/Status`, `blogBtnLink/Status`, `ctaBtnLink/Status`, dsb
- **Bahasa Default**: `defaultLanguage` ("id" atau "en")
- **Warna Background**: 20+ field `bg_*` untuk warna tiap section (e.g., `bg_home_hero`, `bg_about_stats`, dll)

---

## 5. SISTEM AUTENTIKASI

File: `src/lib/auth.js` + `src/app/api/auth/route.js`

### Mekanisme:
1. **Login** (POST `/api/auth`): Password -> cocokkan DB > env > default -> buat session -> set HttpOnly cookie
2. **Check Auth** (GET `/api/auth`): Baca cookie -> decrypt -> cocokkan session ID
3. **Change Password** (PUT `/api/auth`): Validasi old password -> simpan new ke DB
4. **Logout** (DELETE `/api/auth`): Hapus cookie

### Prioritas Password:
```
1. db.get('admin_password')        <- Prioritas tertinggi (dari Redis/JSON)
2. process.env.ADMIN_PASSWORD      <- Fallback (env variable Vercel)
3. 'admin123'                      <- Default terakhir
```

---

## 6. DESIGN SYSTEM

### Brand Colors
```css
--color-tosca: #14789B     /* Biru kehijauan - warna utama brand */
--color-maroon: #AB2223    /* Merah marun - warna aksen/CTA */
--color-kunyit: #FAA433    /* Kuning kunyit - warna aksen/bintang rating */
--color-cream-bg: #FAF5EB  /* Krem - background utama */
--color-dark-bg: #0B132B   /* Gelap - untuk section kontras */
```

### Fonts
- **Sans-serif**: Montserrat (400, 500, 700, 800)
- **Cursive**: Dancing Script (700)

### Navbar
- Floating capsule (pill-shaped) melayang di atas konten
- Logo, menu, language switcher (ID/EN dengan SVG flags)
- Responsive hamburger menu di mobile

---

## 7. HALAMAN WEBSITE

### 7.1 Landing Page (`/`) - LandingPageClient.js (54KB)
Sections: Hero (video+ornaments), Partners marquee, Programs (3 cards), Gallery grid, Testimonials (2 marquee rows), Blog preview, CTA sunset

### 7.2 About Us (`/about`) - AboutPageClient.js
Sections: Hero, Features, Empower (visi misi), Pillars, Statistics (4 angka dinamis), CTA

### 7.3 Store (`/store`) - StorePageClient.js
Grid produk + filter kategori + search + modal detail

### 7.4 Classes (`/classes`) - ClassesPageClient.js
Grid kelas/workshop + filter + search

### 7.5 Blog (`/blog`) - BlogPageClient.js
Grid artikel blog

### 7.6 Blog Detail (`/blog/[slug]`) - BlogPostPageClient.js
Detail artikel + "Tentang Berseni" section

### 7.7 Collaboration (`/collaboration`) - CollaborationPageClient.js
Kolaborasi Brand + Venue, masing-masing dengan CTA WhatsApp

### 7.8-7.9 Admin (`/admin`, `/admin/login`)
6 tab: Konten, Halaman, Produk, Blog, SEO, Akun
Fitur: Backup/Restore, Single Session

---

## 8. SEO & GEO

- Dynamic meta tags per halaman (editable di admin)
- JSON-LD: Organization + WebSite schemas
- Open Graph + Twitter Card
- Dynamic sitemap.xml + robots.txt
- Google Site Verification (editable)
- Meta Pixel Facebook (configurable dari admin)
- Geo meta tags (region, placename, position, ICBM)

---

## 9. DEPLOYMENT

### Vercel
- **Team**: `berseniid` | **Project**: `berseni-id`
- **URL**: `https://berseni-id.vercel.app`
- **Domain**: `berseni.id` (Hostinger, DNS sudah di-set)

### Environment Variables:
- `KV_REST_API_URL` - Upstash Redis URL
- `KV_REST_API_TOKEN` - Upstash Redis token
- `ADMIN_PASSWORD` - Password admin fallback

### Deploy Command:
```powershell
powershell -ExecutionPolicy Bypass -Command "npx vercel deploy --prod --token 'VERCEL_TOKEN_KAMU_DISINI'"
```

---

## 10. STATUS & PENDING TASKS

### Sudah Selesai:
- Website 9 halaman publik + admin panel lengkap
- Bilingual ID/EN di semua konten
- SEO/GEO + JSON-LD + sitemap + robots.txt
- Meta Pixel integration
- Deploy ke Vercel + Upstash Redis
- DNS berseni.id di Hostinger

### Perlu Dicek/Dilanjutkan:
- [ ] Verifikasi domain berseni.id aktif (DNS di-set 2+ minggu lalu)
- [ ] Hubungkan GitHub -> Vercel auto-deploy
- [ ] Google Search Console setup + submit sitemap
- [ ] Password hashing (saat ini plaintext)
- [ ] Image optimization (beberapa file 6-9MB)

---

## 11. KONVENSI KODE

### Pattern Server/Client:
```
page.js (Server) -> fetch db.get() -> pass props -> NamaPageClient.js (Client)
```

### Bilingual Pattern:
```javascript
// Database: heroTitle_id, heroTitle_en
// Komponen: t(content, 'heroTitle') -> otomatis pilih berdasarkan bahasa aktif
```

### Warna Dinamis:
```jsx
<section style={{ backgroundColor: content.bg_home_hero || '#FAF5EB' }}>
```

---

## 12. CARA MENJALANKAN

```powershell
cd "c:\Users\nugra\Documents\Project\Freelance Project\Website-Berseni"
npm install
npm run dev
# http://localhost:3000 (website) | http://localhost:3000/admin (admin panel)
```
