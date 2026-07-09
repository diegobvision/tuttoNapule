import {
  SHOPIFY_ENDPOINT,
  SHOPIFY_TOKEN,
  isShopifyConfigured,
} from "./config";

interface ShopifyFetchArgs<V> {
  query: string;
  variables?: V;
  /** Seconds for Next ISR. Omit + pass `cache: "no-store"` for live data. */
  revalidate?: number;
  cache?: RequestCache;
  tags?: string[];
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

/**
 * Low-level Storefront API fetch. Integrates with Next's fetch cache:
 * pass `revalidate` for time-based ISR, or `cache: "no-store"` for live
 * (cart, search). Throws on transport/GraphQL errors so callers can decide
 * whether to swallow (see the graceful helpers in ./index).
 */
export async function shopifyFetch<T, V = Record<string, unknown>>({
  query,
  variables,
  revalidate,
  cache,
  tags,
}: ShopifyFetchArgs<V>): Promise<T> {
  if (!isShopifyConfigured) {
    throw new Error(
      "Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and " +
        "SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local."
    );
  }

  const next: { revalidate: number | false; tags?: string[] } | undefined =
    cache === "no-store"
      ? undefined
      : { revalidate: revalidate ?? false, tags };

  const res = await fetch(SHOPIFY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    ...(cache ? { cache } : {}),
    ...(next ? { next } : {}),
  });

  if (!res.ok) {
    throw new Error(`Shopify HTTP ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(
      `Shopify GraphQL error: ${json.errors.map((e) => e.message).join("; ")}`
    );
  }

  if (!json.data) {
    throw new Error("Shopify returned no data.");
  }

  return json.data;
}
