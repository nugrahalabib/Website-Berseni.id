// Kompresi + unggah gambar dari SISI KLIEN. Dipakai SEMUA field upload gambar di
// admin (Konten Halaman, Katalog Produk, Blog, dst).
//
// Kenapa perlu: foto dari HP/kamera biasanya 3–10MB. Endpoint /api/upload dibatasi
// 5MB (dan platform Vercel ~4.5MB body), jadi kalau file mentah dikirim langsung,
// upload GAGAL. Helper ini memperkecil gambar (sisi terpanjang <= maxDim) dan
// mengonversinya ke WebP dulu, sehingga hasilnya hampir selalu < 1MB dan upload
// berhasil TANPA pengguna perlu menyamakan ukuran gambar dengan kotaknya.

const MAX_DIMENSION = 1920; // sisi terpanjang maksimum (px) — cukup tajam untuk web
const WEBP_QUALITY = 0.82;  // kualitas encode WebP
// Tipe yang aman dikompres lewat canvas. GIF sengaja DILEWATI agar animasinya utuh.
const COMPRESSIBLE = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Gambar tidak dapat dibaca.'));
    };
    img.src = url;
  });
}

// Perkecil gambar (sisi terpanjang <= maxDim) lalu encode ke WebP.
// Fallback ke file asli bila: tipe tak didukung (mis. GIF), gagal decode, atau
// hasil kompres justru lebih besar dari aslinya.
export async function compressImageFile(file, { maxDim = MAX_DIMENSION, quality = WEBP_QUALITY } = {}) {
  if (!file || !COMPRESSIBLE.has(file.type)) return file;

  let loaded;
  try {
    loaded = await loadImage(file);
  } catch {
    return file;
  }
  const { img, url } = loaded;
  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;
  URL.revokeObjectURL(url);
  if (!srcW || !srcH) return file;

  const scale = Math.min(1, maxDim / Math.max(srcW, srcH));
  const w = Math.max(1, Math.round(srcW * scale));
  const h = Math.max(1, Math.round(srcH * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, w, h);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
  if (!blob) return file;
  if (blob.size >= file.size) return file; // sudah kecil/optimal, jangan diperbesar

  const cleanName = (file.name || 'image').replace(/\.[^/.]+$/, '') + '.webp';
  return new File([blob], cleanName, { type: 'image/webp', lastModified: Date.now() });
}

// Kompres lalu unggah. Mengembalikan URL gambar (string), atau MELEMPAR Error
// berpesan jelas — termasuk pesan dari server (mis. batas ukuran) — supaya UI
// bisa menampilkan alasan gagalnya, bukan cuma "gagal".
export async function uploadImage(file) {
  const prepared = await compressImageFile(file).catch(() => file);

  const formData = new FormData();
  formData.append('file', prepared);

  let res;
  try {
    res = await fetch('/api/upload', { method: 'POST', body: formData });
  } catch {
    throw new Error('Koneksi bermasalah saat mengunggah gambar.');
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* respons non-JSON */
  }

  // 401 = sesi admin sudah tidak berlaku (sistem satu-sesi: login baru di
  // perangkat/tab lain menggusur sesi lama). Beri instruksi jelas, bukan
  // "Unauthorized" mentah yang membingungkan.
  if (res.status === 401) {
    throw new Error('Sesi login Anda sudah berakhir (ada login lain yang lebih baru). Silakan Keluar Portal, login ulang, lalu coba unggah lagi.');
  }

  if (!res.ok || !data || !data.url) {
    throw new Error((data && data.error) || `Gagal mengunggah gambar (kode ${res.status}).`);
  }
  return data.url;
}

// ============================================================================
// IKON
// ============================================================================
// Ikon punya kebutuhan berbeda dari foto: ukurannya kecil di layar, hampir
// selalu butuh latar transparan, dan yang dipegang klien biasanya berkas SVG.
//
// Masalahnya /api/upload MENOLAK SVG — sebuah SVG bisa memuat <script> dan
// akan tersaji sebagai HTML yang dieksekusi (stored XSS). Larangan itu benar
// dan tidak diutak-atik. Sebagai gantinya SVG di-RASTERISASI dulu di browser
// menjadi WebP, sehingga admin tetap bisa mengunggah SVG apa adanya dan yang
// sampai ke server hanyalah gambar biasa yang aman.
//
// Hasil akhirnya selalu WebP: transparansi tetap terjaga, dan ukurannya jauh di
// bawah batas unggah.

const ICON_MAX_DIMENSION = 512; // cukup tajam untuk layar retina pada ikon 24-40px
const ICON_WEBP_QUALITY = 0.92; // ikon punya tepi tajam — kompresi terlalu kuat bikin berbayang

// SVG dimuat lewat data: URL, bukan blob: URL. Data URL tidak pernah menodai
// (taint) canvas, sehingga toBlob() di bawah tidak akan gagal.
function loadSvgAsImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Berkas SVG tidak dapat dibaca.'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Berkas SVG tidak dapat dibaca.'));
    reader.readAsDataURL(file);
  });
}

function canvasToWebpFile(canvas, baseName) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Ikon gagal dikonversi. Coba berkas lain.'));
          return;
        }
        const cleanName = (baseName || 'icon').replace(/\.[^/.]+$/, '') + '.webp';
        resolve(new File([blob], cleanName, { type: 'image/webp', lastModified: Date.now() }));
      },
      'image/webp',
      ICON_WEBP_QUALITY
    );
  });
}

// Ubah APA PUN yang dipilih admin menjadi WebP siap pakai.
// SVG diperbesar sampai ICON_MAX_DIMENSION (vektor, jadi tetap tajam); gambar
// raster hanya diperkecil, tidak pernah diperbesar (memperbesar raster cuma
// menambah ukuran berkas tanpa menambah detail).
export async function convertIconFile(file) {
  if (!file) throw new Error('Tidak ada berkas yang dipilih.');

  const isSvg = file.type === 'image/svg+xml' || /\.svg$/i.test(file.name || '');

  // GIF dibiarkan apa adanya supaya animasinya tidak hilang.
  if (!isSvg && file.type === 'image/gif') return file;

  let img;
  if (isSvg) {
    img = await loadSvgAsImage(file);
  } else {
    const loaded = await loadImage(file);
    img = loaded.img;
    URL.revokeObjectURL(loaded.url);
  }

  // SVG tanpa width/height (hanya viewBox) dilaporkan browser sebagai 0 atau
  // ukuran bawaan 300x150 — pakai bujur sangkar penuh supaya tidak gepeng.
  const srcW = img.naturalWidth || img.width || ICON_MAX_DIMENSION;
  const srcH = img.naturalHeight || img.height || ICON_MAX_DIMENSION;

  const scale = isSvg
    ? ICON_MAX_DIMENSION / Math.max(srcW, srcH)
    : Math.min(1, ICON_MAX_DIMENSION / Math.max(srcW, srcH));

  const w = Math.max(1, Math.round(srcW * scale));
  const h = Math.max(1, Math.round(srcH * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Peramban tidak mendukung konversi ikon.');
  ctx.drawImage(img, 0, 0, w, h);

  return canvasToWebpFile(canvas, file.name);
}

// Konversi lalu unggah. Mengembalikan URL ikon (string).
export async function uploadIcon(file) {
  const prepared = await convertIconFile(file);

  const formData = new FormData();
  formData.append('file', prepared);

  let res;
  try {
    res = await fetch('/api/upload', { method: 'POST', body: formData });
  } catch {
    throw new Error('Koneksi bermasalah saat mengunggah ikon.');
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* respons non-JSON */
  }

  if (res.status === 401) {
    throw new Error('Sesi login Anda sudah berakhir (ada login lain yang lebih baru). Silakan Keluar Portal, login ulang, lalu coba unggah lagi.');
  }

  if (!res.ok || !data || !data.url) {
    throw new Error((data && data.error) || `Gagal mengunggah ikon (kode ${res.status}).`);
  }
  return data.url;
}
