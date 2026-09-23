// Daftar tautan medsos di footer — SATU sumber untuk situs dan panel admin.
//
// Sebelumnya keenam tautan ditulis keras di Footer.js, masing-masing dengan
// <svg> dan field tautannya sendiri (footerLinkIg, footerLinkTiktok, ...).
// Menyembunyikan satu platform, mengubah urutannya, atau menambah platform baru
// selalu menuntut perubahan kode. Sekarang bentuknya sebuah daftar di
// `content.footerSocials` yang bisa ditambah, dihapus, dan diurutkan admin.
//
// Bentuk satu entri:
//   {
//     id:       'soc-...'      pengenal unik untuk React key & aksi hapus
//     preset:   'whatsapp'     menentukan ikon bawaan + cara tautan dibentuk
//     label_id / label_en      dibacakan pembaca layar, dan jadi tooltip
//     icon:     ''             URL gambar kustom; kosong = ikon bawaan preset
//     link:     ''             URL/alamat; lihat resolveSocialHref di bawah
//   }

import { resolveWaNumber, buildWaLink } from '@/lib/whatsapp';

// Dipakai saat `content.footerSocials` belum ada sama sekali — yaitu pada
// database yang dibuat sebelum fitur ini. Daftarnya dibangun ULANG dari
// field-field lama, sehingga situs yang sudah berjalan tampil persis seperti
// sebelumnya dan admin tinggal menyunting dari kondisi itu. Tidak ada data lama
// yang ditimpa atau dihapus.
export function buildDefaultFooterSocials(content = {}) {
  const c = content || {};
  const entri = [
    { preset: 'whatsapp', label: 'WhatsApp', link: '', icon: c.footerIconWa },
    { preset: 'instagram', label: 'Instagram', link: c.footerLinkIg || 'https://www.instagram.com/berseni.id/', icon: c.footerIconIg },
    { preset: 'tiktok', label: 'TikTok', link: c.footerLinkTiktok || 'https://www.tiktok.com/@berseni.id', icon: c.footerIconTiktok },
    { preset: 'youtube', label: 'YouTube', link: c.footerLinkYoutube || 'https://www.youtube.com/@berseni', icon: c.footerIconYoutube },
    // Facebook & Email dulu hanya tampil kalau diisi admin — perilaku itu
    // dipertahankan dengan cara tidak memasukkannya ke daftar saat kosong.
    ...(c.footerLinkFacebook ? [{ preset: 'facebook', label: 'Facebook', link: c.footerLinkFacebook, icon: c.footerIconFacebook }] : []),
    ...(c.footerLinkEmail ? [{ preset: 'email', label: 'Email', link: c.footerLinkEmail, icon: c.footerIconEmail }] : []),
  ];

  return entri.map((e, i) => ({
    id: `soc-default-${i}`,
    preset: e.preset,
    label_id: e.label,
    label_en: e.label,
    icon: e.icon || '',
    link: e.link || '',
  }));
}

// Daftar yang dipakai untuk merender. Memakai daftar admin bila ada, dan jatuh
// ke bawaan bila belum pernah disunting.
export function getFooterSocials(content = {}) {
  const daftar = content && content.footerSocials;
  if (Array.isArray(daftar)) return daftar;
  return buildDefaultFooterSocials(content);
}

// Alamat tujuan sebuah entri. Mengembalikan '' bila tidak ada tujuan yang sah —
// pemanggilnya melewati entri itu, supaya tidak ada ikon yang diklik lalu tidak
// membawa ke mana-mana.
export function resolveSocialHref(item, content = {}) {
  if (!item) return '';
  const nilai = typeof item.link === 'string' ? item.link.trim() : '';

  if (item.preset === 'whatsapp') {
    // Nomor WhatsApp punya satu sumber di pengaturan (lihat lib/whatsapp.js),
    // jadi entri ini sengaja boleh dibiarkan kosong: kosong = ikut nomor itu.
    // Mengisinya tetap diizinkan untuk kasus nomor berbeda khusus footer.
    return nilai || buildWaLink(resolveWaNumber(content));
  }

  if (item.preset === 'email') {
    if (!nilai) return '';
    // Admin lebih mungkin mengetik alamatnya saja daripada menulis "mailto:".
    return nilai.startsWith('mailto:') ? nilai : `mailto:${nilai}`;
  }

  return nilai;
}

// Tautan keluar dibuka di tab baru; mailto: dan tautan internal tidak, karena
// membuka tab kosong lalu menyerahkannya ke aplikasi email itu mengganggu.
export function isExternalHref(href) {
  return typeof href === 'string' && /^https?:\/\//i.test(href);
}
