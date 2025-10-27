"use client";

import dynamic from "next/dynamic";

// Dynamically import Analytics to reduce initial bundle size
const Analytics = dynamic(() => import("@vercel/analytics/next").then((mod) => mod.Analytics), {
  ssr: false,
});

export function AnalyticsWrapper() {
  return <Analytics />;
}
