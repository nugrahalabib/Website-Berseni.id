'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * Pembungkus next/image dengan fallback saat gambar gagal dimuat.
 * next/image tidak mengizinkan mutasi e.target.src, jadi src dikelola via state.
 *
 * @param {object} props
 * @param {string} props.src - URL gambar utama
 * @param {string} [props.fallbackSrc] - URL cadangan bila src gagal dimuat
 */
export default function SafeImage({ src, fallbackSrc, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);

  // Sinkronkan kembali bila src berubah (mis. ganti produk/filter).
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={imgSrc}
      onError={() => {
        if (fallbackSrc && imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
      }}
    />
  );
}
