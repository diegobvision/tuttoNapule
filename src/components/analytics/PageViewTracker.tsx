"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { GTM_ID } from "@/lib/config";

function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GTM_ID) return;
    const qs = searchParams.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;
    trackEvent("page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

/**
 * Fires a `page_view` on initial mount AND every client-side navigation, so
 * GA4's own on-load pageview should be DISABLED to avoid double counting
 * (this is the single source of truth). Wrapped in Suspense because
 * useSearchParams requires it.
 */
export function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
