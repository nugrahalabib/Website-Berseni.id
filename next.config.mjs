/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Hosts gambar eksternal yang dirender situs (produk Lynk.id, avatar testimoni,
    // gambar blog lama). Diperlukan agar next/image boleh mengoptimasi domain ini.
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'cdn.lynkid.my.id' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'berseni.id' },
      // Upload admin di produksi tersimpan di Vercel Blob (subdomain acak).
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async redirects() {
    // Path WordPress lama yang masih terindeks Google -> arahkan ke home (hindari 404/403).
    return [
      { source: '/log-in', destination: '/', permanent: true },
      { source: '/wp-login.php', destination: '/', permanent: true },
      { source: '/wp-admin/:path*', destination: '/', permanent: true },
      { source: '/wp-content/:path*', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
