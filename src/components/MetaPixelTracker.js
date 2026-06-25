'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

function PixelTrackerInner({ pixelId }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Avoid double tracking the initial load as the inline script already fired one
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (!pixelId || !window.fbq) return;

    // Track PageView on subsequent route changes (pathname or search parameters)
    window.fbq('track', 'PageView');
  }, [pathname, searchParams, pixelId]);

  return null;
}

export default function MetaPixelTracker({ pixelId }) {
  const pathname = usePathname();

  // Do not initialize or track anything on admin routes
  if (!pixelId || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Standard Meta Pixel Script */}
      <script
        id="meta-pixel-init"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      {/* Listen to pathname / searchParams updates wrapped in Suspense to avoid build de-optimization */}
      <Suspense fallback={null}>
        <PixelTrackerInner pixelId={pixelId} />
      </Suspense>
    </>
  );
}
