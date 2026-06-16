'use client';

import { useLanguage } from '@/components/LanguageContext';

export default function FloatingWhatsApp() {
  const { getTranslation } = useLanguage();

  const message = getTranslation('waFloatMessage');
  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/6281234567890?text=${encodedMessage}`;

  return (
    <a
      href={waUrl}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={getTranslation('waFloatAria')}
    >
      <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.458 3.479 1.332 5.006l-1.354 4.954 5.086-1.328c1.472.802 3.12 1.226 4.793 1.226 5.506 0 9.988-4.482 9.988-9.988C22 6.482 17.518 2 12.012 2zm4.786 13.993c-.2.56-1.166 1.074-1.615 1.123-.404.045-.929.076-2.584-.598-2.112-.86-3.48-3.006-3.585-3.147-.105-.14-1.782-2.37-1.782-4.52 0-2.15 1.123-3.2 1.523-3.626.3-.32.795-.415 1.155-.415.12 0 .23.005.325.01.29.015.435.03.625.485.24.575.82 2.002.89 2.148.07.145.115.315.02.505-.095.19-.19.31-.375.525-.185.215-.39.48-.56.645-.185.18-.38.375-.165.74.215.365.955 1.575 2.05 2.55 1.405 1.255 2.585 1.645 2.95 1.83.365.185.575.155.79-.095.215-.25.925-1.075 1.175-1.445.25-.37.5-.31.84-.185.34.125 2.15 1.015 2.52 1.2.37.185.615.275.705.43.09.155.09.895-.11 1.455z"/>
      </svg>
      <span className="whatsapp-tooltip">{getTranslation('waFloatTooltip')}</span>
    </a>
  );
}
