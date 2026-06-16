# 🎨 Berseni.id — Premium Art & Painting Portal

> **Berseni.id** is a premium, high-fidelity web application built to connect professional Indonesian artists with art lovers, beginners, and collectors worldwide. Featuring immersive interactive galleries, online e-courses, offline workshop registrations, and an enterprise-grade administration portal.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Enabled-blueviolet?style=for-the-badge&logo=vercel)](https://nextjs.org/docs/app/api-reference/turbopack)
[![Vercel KV](https://img.shields.io/badge/Vercel%20KV-Ready-000000?style=for-the-badge&logo=vercel)](https://vercel.com/docs/storage/vercel-kv)
[![Styling](https://img.shields.io/badge/CSS-Vanilla%20Premium-blue?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

## ✨ Key Features & Capabilities

### 1. Immersive User Experience (UX)
* **Responsive Marquee Testimonials**: A beautiful "Apa Kata Mereka" section featuring seamless dual-direction looping reviews powered by dynamic database content.
* **Liquid Parallax Hero**: Staggered scroll animations, background trees parallax, and a responsive custom video frame container.
* **Bilingual Experience**: Built-in multi-language toggle (Indonesian/English) with dynamically loaded default language configs.

### 2. High-Performance Architecture
* **Hybrid Database Core**: Smart DB adapter that auto-detects environments. Uses **Vercel KV (Redis)** for serverless production deployment and falls back to a clean JSON flat-file storage for local offline development.
* **Auto-Generating Sitemap**: Fully automated dynamic `/sitemap.xml` that updates whenever you publish new products, classes, or blog posts.
* **Custom Media Uploader**: Serverless file uploader utilizing Next.js API endpoints to handle media assets and profile pictures safely.

### 3. Integrated Admin Dashboard & Content Manager
* **Full Section Editor**: Dynamically modify website banners, pillars, descriptions, call-to-actions, and button visibility options.
* **Catalogue Manager**: Complete CRUD operations for original physical artworks, online e-courses, and offline workshop tickets.
* **Testimonials & Carousel Editors**: Manage user feedback, photos, star ratings, and theme variables directly from the portal.
* **Logo Partner Manager**: Sort, add, download, or edit brand logos ("Dipercaya Oleh") using visual drag-reorder interfaces.

### 4. Meta-Analytics & GEO (AI Optimization)
* **Meta Pixel Integration**: Manage Meta/Facebook Pixel status and ID from the admin panel to track conversions and run ads smoothly.
* **Google Search Console**: Easily register Google Site Verification tokens directly in settings.
* **Generative Engine Optimization (GEO)**: Dedicated fields to feed ChatGPT, Gemini, and Perplexity with key brand facts and structured FAQ schemas, securing AI-powered search references.

---

## 🔒 Security & Data Integrity

* **Single-Device Session Enforcement**: Employs advanced session-jacking protection. When an admin logs in on a new device, all older sessions on other browsers are instantly invalidated.
* **Isolated Environment Configurations**: Strictly protects credentials by running database keys, encryption, and passwords inside server-side env scripts.
* **Instant Database Backup**: Features a one-click database export tool (`/api/backup`) that packs your entire site configuration, products, and articles into a JSON package.

---

## 🛠️ Technology Stack

* **Frontend Framework**: Next.js 16 (App Router) with React Server Components (RSC).
* **Styling System**: Premium Vanilla CSS Modules with root variables supporting high-contrast accent themes (`Tosca`, `Maroon`, `Kunyit`).
* **Database**: `@vercel/kv` (Redis) / Flat-file JSON (`public/db.json`).
* **Fonts**: Google Fonts (Montserrat & Dancing Script).

---

## ⚙️ Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/nugrahalabib/Website-Berseni.id.git
cd Website-Berseni.id
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
ADMIN_PASSWORD=your_secure_admin_password
# Vercel KV credentials (only required for production environment)
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

### 4. Start the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the homepage, and navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to log in.

---

## 🚀 Production Deployment (Vercel)

1. Import your repository to the **Vercel Dashboard**.
2. Go to **Storage** in Vercel and create a new **KV database**, then connect it to your project.
3. Configure the `ADMIN_PASSWORD` environment variable in Vercel Project Settings.
4. Deploy! The project auto-seeds the KV store with the default site database on the first request.
