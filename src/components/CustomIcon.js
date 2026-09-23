'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * Ikon yang bisa diganti admin.
 *
 * Membungkus ikon bawaan situs (SVG inline yang ditulis di komponen) supaya
 * admin bisa menimpanya dengan gambar sendiri dari panel, per slot, tanpa
 * menyentuh kode.
 *
 *   <CustomIcon src={content.aboutPillar1Icon} size={24}>
 *     <svg .../>            <- ikon bawaan, dipakai kalau admin belum mengunggah
 *   </CustomIcon>
 *
 * Tiga hal yang dijaga:
 *
 * 1. Kolom kosong = ikon bawaan. Admin bisa membatalkan pilihannya kapan saja
 *    hanya dengan mengosongkan kolomnya, tanpa perlu mencari ikon aslinya.
 * 2. Gambar gagal dimuat = ikon bawaan. Kalau URL-nya salah ketik atau berkasnya
 *    terhapus dari penyimpanan, section-nya tidak berlubang — ikon lama kembali
 *    dipakai. `failedSrc` menyimpan URL yang gagal, bukan boolean, supaya status
 *    gagal itu otomatis lepas begitu admin mengganti URL-nya.
 * 3. `alt` sengaja kosong secara bawaan. Ikon di situs ini selalu berdampingan
 *    dengan teks yang sudah menjelaskan maknanya (judul kartu, atau aria-label
 *    pada tautan medsos), jadi membacakan ikonnya lagi hanya mengulang.
 */
export default function CustomIcon({ src, size = 24, alt = '', children }) {
  const [failedSrc, setFailedSrc] = useState(null);

  const url = typeof src === 'string' ? src.trim() : '';
  if (!url || failedSrc === url) return children;

  return (
    <Image
      src={url}
      alt={alt}
      width={size}
      height={size}
      onError={() => setFailedSrc(url)}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
}
