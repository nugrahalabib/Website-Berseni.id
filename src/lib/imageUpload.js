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

  if (!res.ok || !data || !data.url) {
    throw new Error((data && data.error) || `Gagal mengunggah gambar (kode ${res.status}).`);
  }
  return data.url;
}
