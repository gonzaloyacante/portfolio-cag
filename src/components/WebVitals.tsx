'use client';

import { usePathname } from 'next/navigation';
import { useReportWebVitals } from 'next/web-vitals';
import { useEffect } from 'react';

/**
 * Web Vitals reporter. Sends CLS, FID, LCP, INP, FCP, TTFB to GA4 (when
 * configured) and to console in development. Mounted once at the root
 * of the admin / landing so the metrics reflect real user sessions.
 *
 * See https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals
 */
export function WebVitals() {
  const pathname = usePathname();

  useReportWebVitals((metric) => {
    // Log to console in dev for quick inspection.
    if (process.env.NODE_ENV !== 'production') {
      console.log('[web-vitals]', metric.name, metric.value, metric.rating, pathname);
    }

    // Forward to GA4 if present.
    const gaId = process.env.NEXT_PUBLIC_GA4_ID;
    if (typeof window !== 'undefined' && gaId && 'gtag' in window) {
      const w = window as unknown as {
        gtag: (type: string, name: string, params: Record<string, unknown>) => void;
      };
      w.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
        metric_rating: metric.rating,
        page_path: pathname,
        non_interaction: true,
      });
    }
  });

  // Add a JS error listener so we capture runtime errors in dev / GA.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onError = (event: ErrorEvent) => {
      if (process.env.NODE_ENV === 'production') {
        const gaId = process.env.NEXT_PUBLIC_GA4_ID;
        if (gaId && 'gtag' in window) {
          const w = window as unknown as {
            gtag: (type: string, name: string, params: Record<string, unknown>) => void;
          };
          w.gtag('event', 'exception', {
            description: event.message,
            fatal: false,
            page_path: window.location.pathname,
          });
        }
      }
    };
    window.addEventListener('error', onError);
    return () => window.removeEventListener('error', onError);
  }, []);

  return null;
}
