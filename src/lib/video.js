// Deteksi tautan video + thumbnail-nya.
// Dipakai CTA artikel blog: kalau admin menempel link YouTube, tombol biasa
// diganti kartu thumbnail yang bisa diklik supaya lebih menarik.

// Menangani bentuk umum: watch?v=, youtu.be/, /embed/, /shorts/, /live/
export function getYouTubeId(url) {
  if (typeof url !== 'string') return null;
  const clean = url.trim();
  if (!clean) return null;

  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/live\/([A-Za-z0-9_-]{11})/,
  ];

  for (const re of patterns) {
    const m = clean.match(re);
    if (m) return m[1];
  }
  return null;
}

// URL gambar sampul dari YouTube. hqdefault selalu tersedia untuk semua video
// (maxresdefault sering 404 pada video lama/ber-resolusi rendah).
export function getYouTubeThumbnail(videoId) {
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
}
