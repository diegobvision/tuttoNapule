// Central SEO helpers — the single source of truth for canonical origin,
// per-route metadata, and schema.org JSON-LD builders.

import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "./config";
import type { Product, Article, Collection, ShopifyPage, Money } from "./shopify/types";
import { isOnSale } from "./utils";

export { SITE_URL, SITE_NAME };

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

interface PageMetaArgs {
  title?: string;
  description?: string;
  path: string;
  image?: string | null;
  type?: "website" | "article" | "product";
  noindex?: boolean;
  publishedTime?: string;
  authors?: string[];
  tags?: string[];
}

/**
 * Build per-route Metadata with canonical + Open Graph pointing at the CLEAN
 * path (filter/sort/cursor variants collapse to one indexable URL).
 */
export function pageMeta({
  title,
  description,
  path,
  image,
  type = "website",
  noindex = false,
  publishedTime,
  authors,
  tags,
}: PageMetaArgs): Metadata {
  const url = absoluteUrl(path);
  const desc = description ?? SITE_DESCRIPTION;
  const images = image ? [{ url: image }] : undefined;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: type === "product" ? "website" : type,
      url,
      title: title ?? SITE_NAME,
      description: desc,
      siteName: SITE_NAME,
      images,
      ...(type === "article" && publishedTime
        ? { publishedTime, authors, tags }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? SITE_NAME,
      description: desc,
      images: image ? [image] : undefined,
    },
  };
}

// ── JSON-LD builders ─────────────────────────────────────────────────────
type JsonLd = Record<string, unknown>;

export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo/favicon-512.png"),
    description: SITE_DESCRIPTION,
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface Breadcrumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Breadcrumb[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

function offerAvailability(available: boolean): string {
  return available
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
}

export function productSchema(product: Product): JsonLd {
  const { minVariantPrice, maxVariantPrice } = product.priceRange;
  const singlePrice = minVariantPrice.amount === maxVariantPrice.amount;
  const currency = minVariantPrice.currencyCode;

  const offers: JsonLd = singlePrice
    ? {
        "@type": "Offer",
        price: minVariantPrice.amount,
        priceCurrency: currency,
        availability: offerAvailability(product.availableForSale),
        url: absoluteUrl(`/products/${product.handle}`),
      }
    : {
        "@type": "AggregateOffer",
        lowPrice: minVariantPrice.amount,
        highPrice: maxVariantPrice.amount,
        priceCurrency: currency,
        offerCount: product.variants.length,
        availability: offerAvailability(product.availableForSale),
        url: absoluteUrl(`/products/${product.handle}`),
      };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.seo.description || product.description,
    image: product.images.map((i) => i.url),
    sku: product.handle,
    brand: product.vendor
      ? { "@type": "Brand", name: product.vendor }
      : { "@type": "Brand", name: SITE_NAME },
    offers,
  };
}

export function collectionSchema(
  collection: Collection,
  productHandles: string[]
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.seo.description || collection.description,
    url: absoluteUrl(`/collections/${collection.handle}`),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: productHandles.length,
      itemListElement: productHandles.map((handle, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/products/${handle}`),
      })),
    },
  };
}

export function articleSchema(article: Article): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.seo.description || article.excerpt,
    image: article.image ? [article.image.url] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: article.author
      ? { "@type": "Person", name: article.author }
      : { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo/favicon-512.png") },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${article.handle}`),
    keywords: article.tags.join(", "),
  };
}

export function pageSchema(page: ShopifyPage): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.seo.description || page.bodySummary,
    url: absoluteUrl(`/pages/${page.handle}`),
  };
}

// Small helper re-exported for callers deciding on sale UI.
export function priceIsSale(price: Money, compareAt: Money | null): boolean {
  return isOnSale(price, compareAt);
}
