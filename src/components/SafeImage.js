'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

/**
 * Pembungkus next/image dengan fallback saat gambar gagal dimuat.
 * next/image tidak mengizinkan mutasi e.target.src, jadi src dikelola via state.
 *
 * @param {object} props
 * @param {string} props.src - URL gambar utama
 * @param {string} [props.fallbackSrc] - URL cadangan bila src gagal dimuat (default: /og-image.jpg)
 * @param {string} [props.alt] - Teks alternatif gambar
 */
export default function SafeImage({ src, fallbackSrc, alt, ...props }) {
  const resolvedFallback = fallbackSrc || '/og-image.jpg';

  const [imgSrc, setImgSrc] = useState(src);

  // Sinkronkan kembali bila src berubah (mis. ganti produk/filter),
  // tanpa useEffect: reset state saat render via ref.
  const prevSrc = useRef(src);
  if (prevSrc.current !== src) {
    prevSrc.current = src;
    setImgSrc(src);
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (imgSrc !== resolvedFallback) setImgSrc(resolvedFallback);
      }}
    />
  );
}
