// Shopify Storefront API configuration + shared constants.

export const SHOPIFY_API_VERSION = "2024-10";

// Normalise the store domain: accept values pasted with a protocol
// (`https://foo.myshopify.com`), a trailing slash, or a stray path — we only
// want the bare host, e.g. `foo.myshopify.com`.
const domain = process.env.SHOPIFY_STORE_DOMAIN
  ?.trim()
  .replace(/^https?:\/\//i, "")
  .replace(/\/.*$/, "");
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();

export const SHOPIFY_ENDPOINT = domain
  ? `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`
  : "";

export const SHOPIFY_TOKEN = token ?? "";

/**
 * True only when both credentials are present. The whole data layer degrades
 * gracefully (returns empty results) when this is false, so the site builds
 * and renders before Shopify is connected.
 */
export const isShopifyConfigured = Boolean(domain && token);

// ── Revalidation policy (single source of truth) ─────────────────────────
// Site is in SETUP MODE — everything cacheable is short (60s) for fast
// prototype iteration. See AGENTS.md for the full table. Bump these once
// content stabilises.
export const REVALIDATE = {
  content: 60, // home, product, collection, page, blog, nav collections
  handles: 3600, // sitemap handle listings (rarely change)
} as const;
