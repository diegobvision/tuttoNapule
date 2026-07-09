// Site-level configuration derived from env vars.
// NEXT_PUBLIC_* are inlined at build time, so these are safe on the client.

export const SITE_NAME = "Tutto Napule";
export const SITE_TAGLINE = "Cucina · Casa · Ricette";
export const SITE_DESCRIPTION =
  "Authentic Neapolitan and Italian food, coffee and kitchenware — sourced with care and delivered across the UK. Cucina, casa e ricette dal cuore di Napoli.";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

const parseHandles = (raw: string | undefined): string[] =>
  (raw ?? "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);

/** Handles shown directly in the top navigation bar. */
export const NAV_COLLECTION_HANDLES = parseHandles(
  process.env.NEXT_PUBLIC_NAV_COLLECTIONS
);

/** Handles highlighted on the homepage. */
export const FEATURED_COLLECTION_HANDLES = parseHandles(
  process.env.NEXT_PUBLIC_FEATURED_COLLECTIONS
);

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

/**
 * Human-readable fallback label for a collection handle, used when Shopify
 * has not returned a title yet (e.g. before the store is connected).
 * "pasta-sughi" → "Pasta Sughi".
 */
export function humaniseHandle(handle: string): string {
  return handle
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
