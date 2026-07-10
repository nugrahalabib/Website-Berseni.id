/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Hosts gambar eksternal yang dirender situs (produk Lynk.id, avatar testimoni,
    // gambar blog lama). Diperlukan agar next/image boleh mengoptimasi domain ini.
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.lynkid.my.id' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'berseni.id' },
    ],
  },
};

export default nextConfig;
