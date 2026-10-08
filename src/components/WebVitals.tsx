"use client";

import { useReportWebVitals } from "next/web-vitals";

/** Sends each Core Web Vital (LCP, INP, CLS, FCP, TTFB) to /api/vitals. */
export default function WebVitals() {
  useReportWebVitals((metric) => {
    const body = JSON.stringify({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      path: window.location.pathname,
    });

    // sendBeacon survives page unloads; fall back to fetch with keepalive.
    if (!navigator.sendBeacon?.("/api/vitals", body)) {
      fetch("/api/vitals", { method: "POST", body, keepalive: true }).catch(
        () => {}
      );
    }
  });

  return null;
}
